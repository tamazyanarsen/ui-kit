import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings } from "./column-settings"
import { columnsFromFields } from "./table-columns"
import { DataTable, type TableField } from "./index"

// Итоговая проверка №3, таблица.

describe("итоговая строка не зовёт построчные функции поля", () => {
  type Row = { id: string; name: string; amount: number; meta?: { note: string } }
  const rows: Row[] = [{ id: "1", name: "Первая", amount: 5, meta: { note: "н" } }]

  // Запись итога синтетическая: `meta` у неё нет. Раньше `description`
  // звалась и на ней — `r.meta.note` роняла всю таблицу.
  it("description, читающая запись, не роняет таблицу", () => {
    const fields: TableField<Row>[] = [
      { key: "name", title: "Имя" },
      { key: "amount", title: "Сумма", type: "money", description: (r) => r.meta!.note },
    ]
    render(
      <DataTable
        fields={fields}
        rows={rows}
        total={{ label: "Итого", span: 1, row: { id: "t", name: "", amount: 5 } }}
      />
    )
    expect(document.querySelector('[data-slot="table-total-row"]')).not.toBeNull()
  })

  // Ячейка действий итога получала живое меню над несуществующей записью.
  it("в строке «Итого» нет меню действий и флажка", () => {
    const actions = vi.fn((_row: Row) => [{ text: "Удалить", onSelect: () => {} }])
    const fields: TableField<Row>[] = [
      { key: "name", title: "Имя" },
      { key: "amount", title: "Сумма", type: "money" },
      { key: "pick", title: "Выбор", type: "checkbox" },
      { key: "act", type: "actions", actions },
    ]
    render(
      <DataTable
        fields={fields}
        rows={rows}
        total={{ label: "Итого", span: 1, row: { id: "t", name: "", amount: 5 } }}
      />
    )
    const total = document.querySelector('[data-slot="table-total-row"]')!
    expect(total.querySelector("button")).toBeNull()
    expect(total.querySelector('[role="checkbox"]')).toBeNull()
    expect(actions).not.toHaveBeenCalledWith(expect.objectContaining({ id: "t" }))
  })
})

describe("поле-флажок получает служебную ширину", () => {
  // Шапка у него `subtitle-left` без своей ширины: при `table-layout: fixed`
  // столбец делил остаток блока с хвостовым spacer.
  it("шапка столбца `checkbox` без width — 48px", () => {
    type Row = { id: string; name: string; pick: boolean }
    render(
      <DataTable<Row>
        fields={[
          { key: "name", title: "Имя" },
          { key: "pick", title: "Выбор", type: "checkbox" },
        ]}
        rows={[{ id: "1", name: "А", pick: false }]}
      />
    )
    const th = Array.from(document.querySelectorAll<HTMLElement>("thead th")).find(
      (cell) => cell.textContent === "Выбор"
    )!
    expect(th.style.width).toBe("48px")
  })
})

describe("управляемые columnWidths: отклонённая ширина не протекает", () => {
  type Row = { id: string; a: string; b: string }
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")
  afterEach(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, "offsetWidth", original)
  })

  function drag(title: string, by: number) {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return (this as HTMLElement).tagName === "TH" ? 200 : 0
      },
    })
    HTMLElement.prototype.setPointerCapture ??= () => {}
    HTMLElement.prototype.hasPointerCapture ??= () => false
    const th = Array.from(document.querySelectorAll<HTMLElement>("thead th")).find(
      (cell) => cell.textContent === title
    )!
    const handle = th.querySelector<HTMLElement>('[data-slot="table-resize-handle"]')!
    fireEvent.pointerDown(handle, { clientX: 0, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: by, pointerId: 1 })
    fireEvent.pointerUp(handle, { pointerId: 1 })
  }

  it("родитель отклонил A — следующее изменение B приходит без A", () => {
    const onColumnWidthsChange = vi.fn()
    render(
      <DataTable<Row>
        fields={[
          { key: "a", title: "A", width: 200 },
          { key: "b", title: "B", width: 200 },
        ]}
        rows={[{ id: "1", a: "a", b: "b" }]}
        columnWidths={{}}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    )
    drag("A", 300)
    drag("B", 150)
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ b: 350 })
  })
})

describe("закреплённый столбец в «Настроить столбцы»", () => {
  it("columnsFromFields помечает поле с pin", () => {
    const columns = columnsFromFields([
      { key: "name", title: "Имя", pin: "left" },
      { key: "a", title: "A" },
    ])
    expect(columns[0]).toMatchObject({ id: "name", pinned: true })
    expect(columns[1]?.pinned).toBe(false)
  })

  // Обычный столбец вставал перед закреплённым: отступ закрепа считался и
  // по нему, и на прокрутке закреплённая колонка висела со сдвигом.
  it("обычный столбец нельзя поставить перед закреплённым", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TableColumnSettings
        columns={[
          { id: "name", label: "Имя", pinned: true },
          { id: "a", label: "Колонка A" },
          { id: "b", label: "Колонка B" },
        ]}
        onColumnsChange={onChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    const handle = screen.getByRole("button", { name: "Переместить столбец «Колонка A»" })
    fireEvent.keyDown(handle, { key: "ArrowUp" })
    expect(onChange).not.toHaveBeenCalled()
  })
})
