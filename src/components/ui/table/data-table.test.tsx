import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TEST_FIELDS, TEST_ROWS, rowCells } from "@/test/table-fixtures"

import { DataTable } from "./data-table"

// Построение ячейки по типу поля. Поведение таблицы (сортировка, выбор,
// вложенность, столбцы) — в `data-table-behavior.test.tsx`.

describe("DataTable — построение ячеек по типу поля", () => {
  it("выбирает вариант ячейки и формат значения по типу", () => {
    render(<DataTable fields={TEST_FIELDS} rows={[TEST_ROWS[1]]} />)
    const cells = rowCells(0)

    expect(cells[0]).toHaveAttribute("data-type", "text")
    expect(cells[0]).toHaveTextContent("Альфа")

    // Деньги: разряды, две цифры после запятой, плюс у поступления и знак
    // валюты через НЕРАЗРЫВНЫЙ пробел — он подставлен «_», иначе разницы с
    // обычным пробелом в тексте теста не видно, а она принципиальная.
    expect(cells[1]).toHaveAttribute("data-type", "number")
    expect(cells[1].textContent?.replaceAll("\u00A0", "_")).toBe(
      "+31_922_980,05_₽"
    )

    expect(cells[2]).toHaveTextContent("01.03.2026")
    expect(cells[3]).toHaveAttribute("data-type", "tag")
    expect(cells[3]).toHaveTextContent("Черновик")
    expect(cells[4]).toHaveTextContent("Нет")
  })

  it("сворачивает несколько значений в «Несколько (N)», одно показывает как есть", () => {
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)

    expect(rowCells(0)[5]).toHaveTextContent("Несколько (3)")
    expect(rowCells(1)[5]).toHaveTextContent("Только один")
  })

  it("ставит прочерк вместо пустого значения и не рисует при нём знак валюты", () => {
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)

    // Примечания нет у первой строки…
    expect(rowCells(0)[6]).toHaveTextContent("—")
    // …а у последней пуст список плательщиков: прочерк, а не «Несколько (0)».
    expect(rowCells(2)[5]).toHaveTextContent("—")
    // Пустая сумма знак валюты не получает — проверено на числовой ячейке
    // строки без единицы измерения.
    render(
      <DataTable
        fields={[{ key: "amount", type: "money" }]}
        rows={[{ amount: null }]}
      />
    )
    const money = document.querySelectorAll('[data-slot="table-cell"]')
    expect(money[money.length - 1].textContent).toBe("—")
  })

  it("резервирует место под самый широкий знак, когда в колонке их несколько", () => {
    render(<DataTable fields={TEST_FIELDS} rows={TEST_ROWS} />)
    const units = rowCells(0)[1].querySelectorAll(
      '[data-slot="table-cell-unit"] > span'
    )

    // Видимый знак строки и невидимый двойник второго знака колонки.
    expect(units).toHaveLength(2)
  })

  it("строит чекбокс и отдаёт наверх переключение", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <DataTable
        fields={[
          { key: "ok", title: "Признак", type: "checkbox", onCheckedChange },
        ]}
        rows={[TEST_ROWS[1]]}
      />
    )

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(TEST_ROWS[1], true)
  })
})
