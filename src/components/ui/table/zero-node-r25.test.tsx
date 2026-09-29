import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { rowCells } from "@/test/table-fixtures"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Раунд 25, класс «{x && …} с числом 0». Пояснение ячейки `description`,
// пришедшее числом 0 («0 вложений»), выводилось голым «0» мимо своей
// обёртки, а не строкой пояснения под значением.

type Row = { id: string; name: string; count: number }

const field: TableField<Row> = {
  key: "name",
  title: "Название",
  description: (row) => row.count,
}

describe("DataTable: пояснение-число", () => {
  it("ноль в пояснении рисуется строкой пояснения, а не голым текстом", () => {
    render(<DataTable fields={[field]} rows={[{ id: "1", name: "Договор", count: 0 }]} />)
    const lines = rowCells(0)[0].querySelectorAll(".truncate")
    expect(lines.length).toBe(2)
    expect(lines[0].textContent).toBe("Договор")
    expect(lines[1].textContent).toBe("0")
  })

  it("пустое пояснение по-прежнему не рисует строку", () => {
    const empty: TableField<Row> = { ...field, description: () => undefined }
    render(<DataTable fields={[empty]} rows={[{ id: "1", name: "Договор", count: 0 }]} />)
    expect(rowCells(0)[0].querySelectorAll(".truncate").length).toBe(1)
  })
})
