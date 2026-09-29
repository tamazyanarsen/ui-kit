import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { rowCells } from "@/test/table-fixtures"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"
import { fieldSortValue, fieldText } from "./field-value"

// Раунд 25, класс «.map по массиву без отбрасывания пустых». Список значений
// поля с пустыми элементами: `["Первый", null]` считался двумя плательщиками
// («Несколько (2)»), `[null]` — одним значением «null», а в тексте для
// поиска и сортировки появлялись слова «null» и «undefined». Строка из одних
// пробелов рисовалась пустой ячейкой вместо прочерка.

type Row = { id: string; payers: unknown }

const field: TableField<Row> = { key: "payers", title: "Плательщики" }
const cell = (payers: unknown) => {
  render(<DataTable fields={[field]} rows={[{ id: "1", payers }]} />)
  return rowCells(0)[0].textContent
}

describe("DataTable: списки с пустыми элементами", () => {
  it("один непустой элемент показывается сам, а не «Несколько (2)»", () => {
    expect(cell(["Первый", null])).toBe("Первый")
  })

  it("пустые элементы не считаются в «Несколько (N)»", () => {
    expect(cell(["Первый", "", "Второй", undefined, "  "])).toBe("Несколько (2)")
  })

  it("список из одних пустых — прочерк", () => {
    expect(cell([null, ""])).toBe("—")
  })

  it("строка из одних пробелов — прочерк", () => {
    expect(cell("   ")).toBe("—")
  })

  it("текст для поиска и сортировки без слов null/undefined", () => {
    const row: Row = { id: "1", payers: ["Первый", null, undefined, "Второй"] }
    expect(fieldText(field, row)).toBe("Первый, Второй")
    expect(fieldText(field, { id: "2", payers: [null] })).toBe("")
    expect(fieldSortValue(field, { id: "2", payers: [null] })).toBeNull()
  })
})
