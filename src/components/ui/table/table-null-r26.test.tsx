import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DataTable } from "./data-table"
import { TableColumnSettings } from "./column-settings"
import { columnsFromFields, treeRequiredColumnIds } from "./table-columns"
import { selectableRowKeys } from "./selectable-keys"
import { sortTableRows } from "./table-rows"
import type { TableField } from "./field-types"

// Раунд 26, класс «пустые элементы массива». `[cond && field]`, `[cond && row]`
// и `[cond && column]` дают в массиве `false`/`null`, и таблица падала на
// `field.hidden`, `row.id`, `column.id`. Так же в списках меню (r25).

type Row = { id: string; name: string; children?: (Row | null)[] }
const NAME: TableField<Row> = { key: "name", title: "Название", sortable: true }
const off = false as unknown as TableField<Row>

describe("Table: пустые элементы массивов", () => {
  it("DataTable переживает false среди полей, null среди строк и детей", () => {
    render(
      <DataTable
        fields={[off, NAME, null as unknown as TableField<Row>]}
        rows={[
          null as unknown as Row,
          { id: "1", name: "Первая", children: [null, { id: "1.1", name: "Вложенная" }] },
        ]}
        columnSettings={[null as never, { id: "name", label: "Название", visible: true }]}
      />
    )
    expect(screen.getByText("Первая")).toBeInTheDocument()
    expect(screen.getByText("Вложенная")).toBeInTheDocument()
    expect(screen.getAllByRole("row")).toHaveLength(3)
  })

  it("TableColumnSettings рисует только настоящие столбцы", () => {
    render(
      <TableColumnSettings
        columns={[false as never, { id: "a", label: "Колонка А" }, null as never]}
        onColumnsChange={() => {}}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /Настроить столбцы/ }))
    expect(screen.getAllByText("Колонка А")).toHaveLength(1)
    expect(screen.getAllByRole("checkbox")).toHaveLength(1)
  })

  it("помощники списка столбцов не падают на пустых элементах", () => {
    expect(columnsFromFields([off, NAME]).map((column) => column.id)).toEqual(["name"])
    expect(
      treeRequiredColumnIds([off, NAME], [null as unknown as Row, { id: "1", name: "a", children: [{ id: "2", name: "b" }] }])
    ).toEqual(["name"])
  })

  it("действия строки из одних пустых элементов не рисуют кнопку «…»", () => {
    const actions: TableField<Row> = {
      key: "act",
      type: "actions",
      actions: () => [false as never, null as never],
    }
    render(<DataTable fields={[NAME, actions]} rows={[{ id: "1", name: "Первая" }]} />)
    expect(screen.queryByRole("button", { name: "Действия со строкой" })).toBeNull()
  })

  it("selectableRowKeys и sortTableRows не падают на пустых элементах", () => {
    const rows = [null, { id: "b", name: "Б", children: [null, { id: "b1", name: "Б1" }] }, { id: "a", name: "А" }] as unknown as Row[]
    expect(selectableRowKeys(rows)).toEqual(["b", "b1", "a"])
    expect(sortTableRows(rows, [off, NAME], { key: "name", direction: "asc" }).map((row) => row.id)).toEqual(["a", "b"])
    expect(sortTableRows(rows, [NAME], null).map((row) => row.id)).toEqual(["b", "a"])
  })

  it("итоговая строка: span-нечисло не дублирует все колонки", () => {
    const money: TableField<Row> = { key: "name", title: "Итог" }
    render(
      <DataTable
        fields={[NAME, money]}
        rows={[{ id: "1", name: "Первая" }]}
        total={{ label: "Итого", span: NaN, row: { id: "t", name: "x" } }}
      />
    )
    const totalRow = document.querySelector('[data-slot="table-total-row"]')!
    expect(totalRow.querySelector("td")).toHaveAttribute("colspan", "1")
    // Ведущая ячейка + одна колонка хвоста + spacer, а не все колонки заново.
    expect(totalRow.querySelectorAll("td")).toHaveLength(3)
  })
})
