import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Аудит 21: у строк без `id` и без `getRowKey` ключ — позиция. Строка,
// вставленная в начало, сдвигала остальные, «новым» оказывался ключ
// последней позиции — подсвечивалась старая строка, а новая нет.

type Row = { id?: string; name: string }
const FIELDS: TableField<Row>[] = [{ key: "name", title: "Название", type: "text" }]

const added = () =>
  [...document.querySelectorAll("tr[data-added]")].map((row) => row.textContent)

describe("DataTable: автоподсветка при позиционных ключах", () => {
  it("вставка в начало без id не подсвечивает сдвинутую старую строку", () => {
    const { rerender } = render(
      <DataTable fields={FIELDS} rows={[{ name: "Б" }, { name: "В" }]} />
    )
    rerender(
      <DataTable fields={FIELDS} rows={[{ name: "А" }, { name: "Б" }, { name: "В" }]} />
    )
    expect(added()).toEqual([])
  })

  it("со своими id подсветка по-прежнему находит новую строку", () => {
    const { rerender } = render(
      <DataTable
        fields={FIELDS}
        rows={[
          { id: "b", name: "Б" },
          { id: "c", name: "В" },
        ]}
      />
    )
    rerender(
      <DataTable
        fields={FIELDS}
        rows={[
          { id: "a", name: "А" },
          { id: "b", name: "Б" },
          { id: "c", name: "В" },
        ]}
      />
    )
    expect(added()).toEqual([expect.stringContaining("А")])
  })
})
