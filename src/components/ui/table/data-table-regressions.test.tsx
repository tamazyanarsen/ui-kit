import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  TEST_FIELDS,
  TEST_ROWS,
  flatRow,
  rowNames,
  type TestRow,
} from "@/test/table-fixtures"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"
import { columnsFromFields } from "./table-columns"
import { sortTableRows } from "./table-rows"

// Регрессии аудита таблиц: каждый блок — одна исправленная находка.

const FLAT = TEST_ROWS.map(flatRow)

function rowTexts() {
  return [...document.querySelectorAll('[data-slot="table-row"]')].map(
    (row) => row.textContent ?? ""
  )
}

describe("render у поля с пустым значением", () => {
  it("вызывается для вычисляемого столбца без значения по ключу", () => {
    const fields: TableField<TestRow>[] = [
      { key: "calc", type: "custom", render: (row) => `#${row.id}` },
    ]
    render(<DataTable fields={fields} rows={FLAT} />)

    expect(rowNames()).toEqual(["#1", "#2"])
  })

  it("прочерк остаётся, если render сам ничего не вернул", () => {
    const fields: TableField<TestRow>[] = [
      { key: "note", render: (row) => row.note },
    ]
    render(<DataTable fields={fields} rows={FLAT} />)

    expect(rowNames()).toEqual(["—", "Есть"])
  })
})

describe("чекбокс шапки не трогает выбор вне видимых строк", () => {
  it("добавляет видимые строки к уже выбранным на другой странице", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={FLAT}
        selectable
        selectedKeys={["other-page"]}
        onSelectedKeysChange={onChange}
      />
    )

    await user.click(screen.getByRole("checkbox", { name: "Выбрать все строки" }))
    expect(onChange).toHaveBeenLastCalledWith(["other-page", "2", "1"])
  })

  it("снимает только видимые строки, а не выбор всех страниц", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={FLAT}
        selectable
        selectedKeys={["other-page", "1", "2"]}
        onSelectedKeysChange={onChange}
      />
    )

    await user.click(screen.getByRole("checkbox", { name: "Выбрать все строки" }))
    expect(onChange).toHaveBeenLastCalledWith(["other-page"])
  })
})

describe("строка, которую выбрать нельзя", () => {
  it("не получает чекбокс вовсе", () => {
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={FLAT}
        selectable
        isRowSelectable={(row) => row.id !== "1"}
      />
    )

    expect(screen.getAllByRole("checkbox", { name: "Выбрать строку" })).toHaveLength(1)
  })
})

describe("ключ строки без id не съезжает при сортировке", () => {
  it("выбор остаётся на той же строке после смены направления", async () => {
    const user = userEvent.setup()
    const fields: TableField<{ name: string }>[] = [
      { key: "name", title: "Название", sortable: true },
    ]
    render(
      <DataTable fields={fields} rows={[{ name: "Б" }, { name: "А" }]} selectable />
    )

    // По возрастанию первой стоит «А» — она вторая в исходных данных.
    await user.click(screen.getAllByRole("checkbox", { name: "Выбрать строку" })[0])
    await user.click(screen.getByRole("button", { name: /Название/ }))

    const selected = document.querySelector('[data-slot="table-row"][data-selected]')
    expect(selected).toHaveTextContent("А")
  })
})

describe("defaultCollapsed при асинхронной загрузке", () => {
  it("сворачивает группы, пришедшие после первого рендера", () => {
    const { rerender } = render(
      <DataTable fields={TEST_FIELDS} rows={[]} defaultCollapsed />
    )
    rerender(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} defaultCollapsed />)

    expect(rowNames()).toEqual(["Бета", "Альфа"])
  })
})

describe("сортировка по умолчанию и настройка столбцов", () => {
  it("перестановка столбцов не меняет сортировку по умолчанию", () => {
    const settings = columnsFromFields(TEST_FIELDS)
    const reordered = [settings[1], settings[0], ...settings.slice(2)]
    render(<DataTable fields={TEST_FIELDS} rows={FLAT} columnSettings={reordered} />)

    // По названию: «Альфа» раньше «Беты». По сумме было бы наоборот.
    expect(rowTexts()[0]).toContain("Альфа")
  })

  it("скрытый столбец сортировки уступает умолчанию с индикатором", async () => {
    const user = userEvent.setup()
    const settings = columnsFromFields(TEST_FIELDS)
    const { rerender } = render(
      <DataTable fields={TEST_FIELDS} rows={FLAT} columnSettings={settings} />
    )
    await user.click(screen.getByRole("button", { name: /Сумма/ }))
    expect(rowTexts()[0]).toContain("Бета")

    const hidden = settings.map((column) =>
      column.id === "amount" ? { ...column, visible: false } : column
    )
    rerender(<DataTable fields={TEST_FIELDS} rows={FLAT} columnSettings={hidden} />)

    expect(rowTexts()[0]).toContain("Альфа")
    expect(screen.getByRole("columnheader", { name: /Название/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    )
  })
})

describe("доступность таблицы", () => {
  it("кликабельная строка открывается с клавиатуры", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<DataTable fields={TEST_FIELDS} rows={FLAT} onRowClick={onRowClick} />)

    const [first] = document.querySelectorAll<HTMLElement>('[data-slot="table-row"]')
    expect(first).toHaveAttribute("tabindex", "0")
    first.focus()
    await user.keyboard("{Enter}")
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })

  it("Enter на контроле внутри строки не открывает строку", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(
      <DataTable fields={TEST_FIELDS} rows={FLAT} selectable onRowClick={onRowClick} />
    )

    screen.getAllByRole("checkbox", { name: "Выбрать строку" })[0].focus()
    await user.keyboard("{Enter}")
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("шапка сообщает состояние сортировки через aria-sort", () => {
    render(<DataTable fields={TEST_FIELDS} rows={FLAT} />)

    expect(screen.getByRole("columnheader", { name: /Название/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    )
    expect(screen.getByRole("columnheader", { name: /Сумма/ })).toHaveAttribute(
      "aria-sort",
      "none"
    )
    expect(screen.getByRole("columnheader", { name: /Статус/ })).not.toHaveAttribute(
      "aria-sort"
    )
  })

  it("ссылка без href рисуется кнопкой и нажимается с клавиатуры", async () => {
    const user = userEvent.setup()
    const onLinkClick = vi.fn()
    const fields: TableField<TestRow>[] = [
      { key: "name", type: "link", onLinkClick },
    ]
    render(<DataTable fields={fields} rows={FLAT} />)

    screen.getByRole("button", { name: "Бета" }).focus()
    await user.keyboard("{Enter}")
    expect(onLinkClick).toHaveBeenCalledWith(FLAT[0])
  })
})

describe("sortTableRows", () => {
  it("сортирует весь набор так же, как таблица", () => {
    const sorted = sortTableRows(FLAT, TEST_FIELDS, { key: "amount", direction: "desc" })
    expect(sorted.map((row) => row.name)).toEqual(["Альфа", "Бета"])
  })

  it("без сортировки возвращает порядок как есть", () => {
    expect(sortTableRows(FLAT, TEST_FIELDS, null)).toBe(FLAT)
  })
})
