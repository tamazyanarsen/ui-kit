import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DataTable } from "./data-table"

// Раунд 27: поле типа `actions` по документации живёт в правом закрепе, но
// без явного `pin: "right"` оставалось обычным столбцом — а закреплённый
// левее него столбец получал отступ справа на его ширину.

const rows = [{ id: "1", name: "Строка", note: "Заметка" }]

describe("DataTable: закреп столбца действий по умолчанию", () => {
  it("поле actions без pin закреплено справа в шапке и в строке", () => {
    const { container } = render(
      <DataTable
        fields={[
          { key: "name", title: "Имя" },
          { key: "note", title: "Заметка", pin: "right" },
          { key: "act", type: "actions", actions: () => [{ text: "Открыть" }] },
        ]}
        rows={rows}
      />
    )
    // Последняя содержательная ячейка каждого ряда — действия — закреплена.
    const head = [...container.querySelectorAll("thead th")]
    const body = [...container.querySelectorAll("tbody tr:first-child td")]
    expect(head.filter((cell) => cell.getAttribute("data-pin") === "right")).toHaveLength(2)
    expect(body.filter((cell) => cell.getAttribute("data-pin") === "right")).toHaveLength(2)
  })

  it("явный pin поля actions не перебивается", () => {
    const { container } = render(
      <DataTable
        fields={[
          { key: "act", type: "actions", pin: "left", actions: () => [{ text: "Открыть" }] },
          { key: "name", title: "Имя" },
        ]}
        rows={rows}
      />
    )
    const first = container.querySelector("thead th")
    expect(first).toHaveAttribute("data-pin", "left")
  })
})
