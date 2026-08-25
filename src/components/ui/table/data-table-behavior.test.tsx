import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  TEST_FIELDS,
  TEST_ROWS,
  flatRow,
  rowCells,
  rowNames,
} from "@/test/table-fixtures"

import { DataTable } from "./data-table"
import { columnsFromFields } from "./table-columns"

// Поведение таблицы: сортировка, вложенность, выбор строк, столбцы.
// Построение ячеек по типу поля — в `data-table.test.tsx`.

describe("DataTable — сортировка", () => {
  it("по умолчанию сортирует по первому столбцу с sortable", () => {
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS.map(flatRow)} />)

    expect(rowNames()).toEqual(["Альфа", "Бета"])
  })

  it("нажатием переключает направление и не сбрасывает сортировку", async () => {
    const user = userEvent.setup()
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS.map(flatRow)} />)

    const sortButton = screen.getByRole("button", { name: /Название/ })
    await user.click(sortButton)
    expect(rowNames()).toEqual(["Бета", "Альфа"])
    await user.click(sortButton)
    expect(rowNames()).toEqual(["Альфа", "Бета"])
  })

  it("сортирует числа числами, а не строками", async () => {
    const user = userEvent.setup()
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS.map(flatRow)} />)

    await user.click(screen.getByRole("button", { name: /Сумма/ }))
    expect(rowNames()).toEqual(["Бета", "Альфа"])
  })

  it("выключает сортировку целиком, когда в таблице есть вложенность", () => {
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)

    expect(
      screen.queryByRole("button", { name: /Название/ })
    ).not.toBeInTheDocument()
  })
})

describe("DataTable — вложенность", () => {
  it("разворачивает строки по умолчанию и сворачивает по шеврону", async () => {
    const user = userEvent.setup()
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)

    expect(rowNames()).toEqual(["Бета", "Бета вложенная", "Альфа"])

    await user.click(screen.getByRole("button", { name: "Свернуть строку" }))
    expect(rowNames()).toEqual(["Бета", "Альфа"])
  })

  it("сворачивает и разворачивает всё из шапки", async () => {
    const user = userEvent.setup()
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)

    await user.click(screen.getByRole("button", { name: "Свернуть все строки" }))
    expect(rowNames()).toEqual(["Бета", "Альфа"])

    await user.click(
      screen.getByRole("button", { name: "Развернуть все строки" })
    )
    expect(rowNames()).toEqual(["Бета", "Бета вложенная", "Альфа"])
  })

  it("сдвигает вложенную строку на 16px за уровень", () => {
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)

    expect(rowCells(1)[0].querySelector("span")).toHaveStyle({
      paddingLeft: "16px",
    })
  })
})

describe("DataTable — выбор строк", () => {
  it("выбирает все ВИДИМЫЕ строки и сбрасывает только из полного выбора", async () => {
    const user = userEvent.setup()
    const onSelectedKeysChange = vi.fn()
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={TEST_ROWS}
        selectable
        onSelectedKeysChange={onSelectedKeysChange}
      />
    )

    await user.click(
      screen.getByRole("checkbox", { name: "Выбрать все строки" })
    )
    expect(onSelectedKeysChange).toHaveBeenLastCalledWith(["1", "1.1", "2"])

    await user.click(
      screen.getByRole("checkbox", { name: "Выбрать все строки" })
    )
    expect(onSelectedKeysChange).toHaveBeenLastCalledWith([])
  })

  it("не считает нажатие по чекбоксу переходом на карточку", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={[TEST_ROWS[1]]}
        selectable
        onRowClick={onRowClick}
      />
    )

    await user.click(screen.getByRole("checkbox", { name: "Выбрать строку" }))
    expect(onRowClick).not.toHaveBeenCalled()

    await user.click(screen.getByText("Альфа"))
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})

describe("DataTable — столбцы", () => {
  it("скрывает столбец по настройке видимости", () => {
    const columns = columnsFromFields(TEST_FIELDS).map((column) =>
      column.id === "date" ? { ...column, visible: false } : column
    )
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={[TEST_ROWS[1]]}
        columnSettings={columns}
      />
    )

    expect(screen.queryByText("Дата")).not.toBeInTheDocument()
    expect(screen.getByText("Статус")).toBeInTheDocument()
  })

  it("переставляет столбцы в порядке настройки", () => {
    const columns = columnsFromFields(TEST_FIELDS)
    const reordered = [columns[1], columns[0], ...columns.slice(2)]
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={[TEST_ROWS[1]]}
        columnSettings={reordered}
      />
    )

    expect(rowCells(0)[0]).toHaveAttribute("data-type", "number")
    expect(rowCells(0)[1]).toHaveTextContent("Альфа")
  })

  it("показывает пустой результат вместо строк и прячет его, когда строки есть", () => {
    const { rerender } = render(
      <DataTable fields={TEST_FIELDS} rows={[]} empty={<span>Ничего нет</span>} />
    )
    expect(screen.getByText("Ничего нет")).toBeInTheDocument()
    // Шапка остаётся: «конструкция таблицы остаётся без изменений».
    expect(screen.getByText("Название")).toBeInTheDocument()

    rerender(
      <DataTable
        fields={TEST_FIELDS}
        rows={[TEST_ROWS[1]]}
        empty={<span>Ничего нет</span>}
      />
    )
    expect(screen.queryByText("Ничего нет")).not.toBeInTheDocument()
  })

  it("добавляет закреплённый столбец действий по rowActions", () => {
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={[TEST_ROWS[1]]}
        rowActions={() => [{ text: "Удалить" }]}
      />
    )
    const cells = rowCells(0)
    const last = cells[cells.length - 1]

    expect(last).toHaveAttribute("data-type", "button")
    expect(last).toHaveAttribute("data-pin", "right")
  })
})
