import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { rowCells } from "@/test/table-fixtures"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Аудит 16, таблицы.
// 1. У чисел (правая выключка, `items-end`) строки значения и пояснения
//    брали ширину по содержимому: `truncate` не срабатывал, и длинная сумма
//    или пояснение выезжали влево на соседние столбцы.
// 2. Сумма или процент, пришедшие готовой строкой со своим знаком, получали
//    знак второй раз («… ₽ ₽», «−5,5 %%»), а плюс в строке не красился.

type Row = { id: string; amount: unknown; rate?: unknown }

const moneyField: TableField<Row> = {
  key: "amount",
  title: "Сумма",
  type: "money",
  signed: true,
  description: () => "Очень длинное пояснение к сумме договора за отчётный период",
}
const percentField: TableField<Row> = { key: "rate", title: "Ставка", type: "percent" }

const text = (el: Element) => el.textContent?.replaceAll(" ", " ")

describe("DataTable: числовая ячейка", () => {
  it("строки значения и пояснения не шире ячейки", () => {
    render(<DataTable fields={[moneyField]} rows={[{ id: "1", amount: 31922980133515.05 }]} />)
    const lines = rowCells(0)[0].querySelectorAll(".truncate")
    expect(lines.length).toBe(2)
    for (const line of lines) expect(line).toHaveClass("max-w-full")
  })

  it("готовая строка со знаком валюты не получает его второй раз", () => {
    render(
      <DataTable
        fields={[moneyField, percentField]}
        rows={[{ id: "1", amount: "+31 922 980 133 515,05 ₽", rate: "−5,5 %" }]}
      />
    )
    const [amount, rate] = rowCells(0)
    expect(text(amount)).toContain("+31 922 980 133 515,05 ₽")
    expect(text(amount)).not.toContain("₽ ₽")
    expect(text(rate)).toBe("−5,5 %")
  })

  it("готовая строка без знака валюты получает его от колонки", () => {
    render(<DataTable fields={[percentField]} rows={[{ id: "1", amount: 0, rate: "12,5" }]} />)
    expect(text(rowCells(0)[0])).toBe("12,5%")
  })

  it("signed красит готовую строку с плюсом, но не строку без плюса", () => {
    render(
      <DataTable
        fields={[{ ...moneyField, description: undefined }]}
        rows={[
          { id: "1", amount: "+5 000,00 ₽" },
          { id: "2", amount: "5 000,00 ₽" },
        ]}
      />
    )
    const value = (index: number) => rowCells(index)[0].querySelector(".truncate")!
    expect(value(0).className).toContain("--table-number-positive-fg")
    expect(value(1).className).not.toContain("--table-number-positive-fg")
  })
})
