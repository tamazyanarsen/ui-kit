import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableTopDetails } from "@/components/ui/table-top"

import { TableColumnSettings } from "./column-settings"
import { DataTable } from "./data-table"
import type { TableField } from "./field-types"
import { useAddedRows } from "./use-added-rows"

// Регрессии второго круга аудита таблиц: каждый блок — одна находка.

afterEach(() => {
  vi.restoreAllMocks()
})

interface Plain {
  name: string
  amount?: number
  client?: { name: string }
}

const NAME_FIELDS: TableField<Plain>[] = [{ key: "name", title: "Название" }]

function rowCheckboxes() {
  return screen.getAllByRole("checkbox", { name: "Выбрать строку" })
}

describe("один объект в rows несколько раз", () => {
  it("у каждого вхождения свой ключ: выбор одной копии не отмечает другую", async () => {
    const user = userEvent.setup()
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const shared: Plain = { name: "Общая" }
    const onSelect = vi.fn()
    render(
      <DataTable
        fields={NAME_FIELDS}
        rows={[shared, shared, { name: "Своя" }]}
        selectable
        onSelectedKeysChange={onSelect}
      />
    )
    await user.click(rowCheckboxes()[0])

    expect(onSelect).toHaveBeenLastCalledWith(["0"])
    expect(rowCheckboxes().map((box) => box.getAttribute("aria-checked"))).toEqual([
      "true",
      "false",
      "false",
    ])
    const duplicateKey = error.mock.calls.some((call) =>
      String(call[0]).includes("same key")
    )
    expect(duplicateKey).toBe(false)
  })
})

describe("закреплённый столбец в настройке столбцов", () => {
  it("стрелка на соседней ручке не выдавливает locked-столбец с места", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TableColumnSettings
        columns={[
          { id: "a", label: "Договор", visible: true, locked: true },
          { id: "b", label: "Сумма", visible: true },
          { id: "c", label: "Дата", visible: true },
        ]}
        onColumnsChange={onChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    const handles = document.querySelectorAll<HTMLElement>(
      '[data-slot="sortable-handle"]'
    )
    fireEvent.keyDown(handles[1], { key: "ArrowUp" })
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.keyDown(handles[1], { key: "ArrowDown" })
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: "a" }),
      expect.objectContaining({ id: "c" }),
      expect.objectContaining({ id: "b" }),
    ])
  })
})

describe("подсветка новых строк", () => {
  it("загрузка после пустого первого кадра не подсвечивает строки", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useAddedRows(keys, true),
      { initialProps: { keys: [] as string[] } }
    )
    rerender({ keys: ["a", "b", "c"] })
    expect([...result.current]).toEqual([])
  })

  it("сужение окна не подсвечивает строки, подтянувшиеся с других страниц", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useAddedRows(keys, true),
      { initialProps: { keys: ["n1", "n2", "n3", "n4"] } }
    )
    rerender({ keys: ["n2", "n4", "n6", "n8"] })
    expect([...result.current]).toEqual([])
  })

  it("строка вдобавок ко всем прежним по-прежнему подсвечивается", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useAddedRows(keys, true),
      { initialProps: { keys: ["a", "b"] } }
    )
    rerender({ keys: ["new", "a", "b"] })
    expect([...result.current]).toEqual(["new"])
  })
})

describe("сортировка по умолчанию", () => {
  it("не пересортировывает строки на рендере, который её не меняет", async () => {
    const user = userEvent.setup()
    const compare = vi.fn((a: Plain, b: Plain) => a.name.localeCompare(b.name))
    const fields: TableField<Plain>[] = [
      { key: "name", title: "Название", sortable: true, compare },
    ]
    render(
      <DataTable
        fields={fields}
        rows={[{ name: "В" }, { name: "Б" }, { name: "А" }]}
        selectable
      />
    )
    const afterMount = compare.mock.calls.length
    await user.click(rowCheckboxes()[0])
    expect(compare.mock.calls.length).toBe(afterMount)
  })
})

describe("управляемое раскрытие", () => {
  it("не ищет ключи перебором массива на каждую строку", () => {
    const expandedKeys = ["g"]
    const includes = vi.spyOn(expandedKeys, "includes")
    const rows = [{ name: "Группа", id: "g", children: [{ name: "Дочь", id: "d" }] }]
    render(
      <DataTable
        fields={[{ key: "name", title: "Название", hierarchy: true }]}
        rows={rows}
        expandedKeys={expandedKeys}
      />
    )
    expect(screen.getByText("Дочь")).toBeInTheDocument()
    expect(includes).not.toHaveBeenCalled()
  })
})

describe("render и итоговая строка", () => {
  it("не зовёт render на синтетической строке итога без значения", () => {
    const fields: TableField<Plain>[] = [
      { key: "name", title: "Название" },
      { key: "client", title: "Клиент", render: (row) => row.client!.name },
      { key: "amount", title: "Сумма", type: "number" },
    ]
    render(
      <DataTable
        fields={fields}
        rows={[{ name: "Строка", client: { name: "ООО" }, amount: 5 }]}
        total={{ label: "Итого", span: 1, row: { name: "", amount: 5 } }}
      />
    )
    expect(screen.getByText("ООО")).toBeInTheDocument()
    expect(screen.getByText("Итого")).toBeInTheDocument()
  })

  it("пустой ответ render при непустом значении — пустая ячейка, не прочерк", () => {
    const fields: TableField<Plain>[] = [
      { key: "name", title: "Название", render: () => null },
    ]
    render(<DataTable fields={fields} rows={[{ name: "Есть" }]} />)
    const cell = document.querySelector('[data-slot="table-row"] td')
    expect(cell?.textContent).toBe("")
  })
})

describe("чекбокс шапки", () => {
  it("выключен, когда ни одну видимую строку выбрать нельзя", () => {
    render(
      <DataTable
        fields={NAME_FIELDS}
        rows={[{ name: "А" }, { name: "Б" }]}
        selectable
        isRowSelectable={() => false}
      />
    )
    expect(screen.getByRole("checkbox", { name: "Выбрать все строки" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })
})

describe("строка внутри кликабельного блока", () => {
  it("открывается кликом, хотя предок таблицы — role=button", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(
      <div role="button" tabIndex={0}>
        <DataTable fields={NAME_FIELDS} rows={[{ name: "Строка" }]} onRowClick={onRowClick} />
      </div>
    )
    await user.click(screen.getByText("Строка"))
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})

describe("стрелки ленты сводки", () => {
  it("фокус с исчезнувшей стрелки переходит на обратную, а не на body", () => {
    render(
      <TableTopDetails
        items={[
          { label: "Один", value: "1" },
          { label: "Два", value: "2" },
        ]}
      />
    )
    const track = document.querySelector<HTMLElement>(
      '[data-slot="table-top-details-track"]'
    )!
    Object.defineProperty(track, "scrollWidth", { configurable: true, value: 300 })
    Object.defineProperty(track, "clientWidth", { configurable: true, value: 100 })
    track.scrollLeft = 50
    fireEvent.scroll(track)

    const forward = screen.getByRole("button", { name: "Прокрутить сводку вперёд" })
    act(() => forward.focus())
    track.scrollLeft = 200
    fireEvent.scroll(track)

    expect(
      screen.queryByRole("button", { name: "Прокрутить сводку вперёд" })
    ).not.toBeInTheDocument()
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Прокрутить сводку назад" })
    )
  })

  it("без обратной стрелки фокус уходит на ленту, и она не остаётся вне Tab", () => {
    render(<TableTopDetails items={[{ label: "Один", value: "1" }]} />)
    const track = document.querySelector<HTMLElement>(
      '[data-slot="table-top-details-track"]'
    )!
    Object.defineProperty(track, "scrollWidth", { configurable: true, value: 300 })
    Object.defineProperty(track, "clientWidth", { configurable: true, value: 100 })
    fireEvent.scroll(track)
    act(() => screen.getByRole("button", { name: "Прокрутить сводку вперёд" }).focus())

    Object.defineProperty(track, "scrollWidth", { configurable: true, value: 100 })
    fireEvent.scroll(track)
    expect(document.activeElement).toBe(track)

    act(() => track.blur())
    expect(track.hasAttribute("tabindex")).toBe(false)
  })
})
