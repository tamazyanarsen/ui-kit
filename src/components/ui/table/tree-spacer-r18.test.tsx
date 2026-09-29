import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DataTable } from "./data-table"

// Аудит 17: в таблице-дереве у строки без вложенных на месте шеврона не
// было ничего — лист уезжал левее соседа с шевроном (на 24px), а
// вложенный уровень оказывался левее собственного родителя. Пакет
// дизайнера (05-geometry-and-colors: «ур. 4 — кнопки нет, текст x 80»)
// оставляет место: пустая коробка той же ширины.

interface Row {
  id: string
  name: string
  children?: Row[]
}

const ROWS: Row[] = [
  { id: "1", name: "Родитель", children: [{ id: "1.1", name: "Лист" }] },
  { id: "2", name: "Сосед без детей" },
]

const cellOf = (container: HTMLElement, text: string) =>
  [...container.querySelectorAll<HTMLElement>('[data-slot="table-cell"]')].find(
    (cell) => cell.textContent === text
  )!

describe("DataTable-дерево: место под шеврон у строки без вложенных", () => {
  it("лист и сосед без детей держат пустую коробку, родитель — шеврон", () => {
    const { container } = render(
      <DataTable<Row>
        fields={[{ key: "name", title: "Название", hierarchy: true }]}
        rows={ROWS}
        getRowKey={(row) => row.id}
        getChildren={(row) => row.children}
      />
    )
    const parent = cellOf(container, "Родитель")
    expect(parent.querySelector('[data-slot="table-collapse-toggle"]')).not.toBeNull()
    for (const text of ["Лист", "Сосед без детей"]) {
      const cell = cellOf(container, text)
      expect(cell.querySelector('[data-slot="table-collapse-toggle"]')).toBeNull()
      expect(cell.querySelector('[data-slot="table-collapse-spacer"]')).not.toBeNull()
    }
  })

  it("в плоской таблице пустой коробки нет", () => {
    const { container } = render(
      <DataTable<Row>
        fields={[{ key: "name", title: "Название" }]}
        rows={[{ id: "1", name: "Один" }, { id: "2", name: "Два" }]}
        getRowKey={(row) => row.id}
      />
    )
    expect(container.querySelector('[data-slot="table-collapse-spacer"]')).toBeNull()
  })
})
