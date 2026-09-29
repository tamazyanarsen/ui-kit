import { describe, expect, it } from "vitest"
import { cleanup, render } from "@testing-library/react"

import { rowCells } from "@/test/table-fixtures"

import { DataTable } from "./data-table"
import { formatNumber } from "./field-format"
import type { TableField } from "./field-types"

// Раунд 25, вырожденные числа в ячейках, собираемых по конфигу полей.
// 1. `-0` и малое отрицательное, округлившееся до нуля, печатались как
//    «−0,00 ₽» (ICU оставляет знак).
// 2. `NaN` (0/0) и `Invalid Date` рисовались буквами вместо прочерка
//    («NaN ₽», «Invalid Date»).

type Row = { id: string; v: unknown }
const cell = (type: TableField<Row>["type"], v: unknown) => {
  cleanup()
  render(<DataTable fields={[{ key: "v", title: "V", type }]} rows={[{ id: "1", v }]} />)
  return rowCells(0)[0].textContent?.replaceAll(" ", " ")
}

describe("formatNumber: нуль без знака", () => {
  it("-0 и округлённое до нуля отрицательное", () => {
    expect(formatNumber(-0, 2)).toBe("0,00")
    expect(formatNumber(-0.001, 2)).toBe("0,00")
    expect(formatNumber(-0)).toBe("0")
  })

  it("настоящее отрицательное знак сохраняет", () => {
    expect(formatNumber(-0.5, 2).replace("−", "-")).toBe("-0,50")
    expect(formatNumber(-1234.5, 2).replace("−", "-").replaceAll(" ", " ")).toBe("-1 234,50")
  })
})

describe("DataTable: NaN и Invalid Date", () => {
  it("деньги: -0 без знака, NaN — прочерк", () => {
    expect(cell("money", -0)).toBe("0,00 ₽")
    expect(cell("money", Number.NaN)).toBe("—")
    expect(cell("money", Number.POSITIVE_INFINITY)).toBe("—")
  })

  it("дата: Invalid Date — прочерк", () => {
    expect(cell("date", new Date("не дата"))).toBe("—")
  })
})
