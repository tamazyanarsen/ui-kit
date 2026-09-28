import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Регрессии третьего круга аудита таблиц.

interface Item {
  id: string
  name: string
}

const FIELDS: TableField<Item>[] = [{ key: "name", title: "Название" }]

const ALL: Item[] = Array.from({ length: 50 }, (_, index) => ({
  id: `n${index}`,
  name: `Строка ${index}`,
}))

function addedRows(container: HTMLElement) {
  return container.querySelectorAll("tr[data-added]")
}

describe("автоподсветка при окне, которое режет сам экран", () => {
  it("по умолчанию надмножество прошлого набора подсвечивается — это «добавили строки»", () => {
    const { container, rerender } = render(
      <DataTable fields={FIELDS} rows={ALL.slice(0, 25)} />
    )
    rerender(<DataTable fields={FIELDS} rows={ALL.slice(0, 50)} />)
    expect(addedRows(container)).toHaveLength(25)
  })

  it("highlightAddedRows={false}: расширение страницы 25 → 50 ничего не подсвечивает", () => {
    const { container, rerender } = render(
      <DataTable fields={FIELDS} rows={ALL.slice(0, 25)} highlightAddedRows={false} />
    )
    rerender(
      <DataTable fields={FIELDS} rows={ALL.slice(0, 50)} highlightAddedRows={false} />
    )
    expect(addedRows(container)).toHaveLength(0)
  })

  it("highlightAddedRows={false} не мешает ручному isRowAdded", () => {
    const { container } = render(
      <DataTable
        fields={FIELDS}
        rows={ALL.slice(0, 5)}
        highlightAddedRows={false}
        isRowAdded={(row) => row.id === "n2"}
      />
    )
    expect(addedRows(container)).toHaveLength(1)
  })
})
