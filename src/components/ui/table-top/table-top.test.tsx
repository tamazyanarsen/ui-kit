import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { TableTop, TableTopTitle, TableTopToolbar, TableTopSummary } from "./table-top"

describe("TableTop", () => {
  it("renders its children", () => {
    render(<TableTop>Содержимое</TableTop>)
    expect(screen.getByText("Содержимое")).toBeInTheDocument()
  })
})

describe("TableTopTitle", () => {
  it("renders the title and an optional action", () => {
    render(<TableTopTitle title="Заголовок таблицы" action={<button>Button</button>} />)
    expect(screen.getByRole("heading", { name: "Заголовок таблицы" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Button" })).toBeInTheDocument()
  })

  it("omits the action slot when none is given", () => {
    render(<TableTopTitle title="Заголовок" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

describe("TableTopToolbar", () => {
  it("renders its children", () => {
    render(
      <TableTopToolbar>
        <input placeholder="Поиск" />
      </TableTopToolbar>
    )
    expect(screen.getByPlaceholderText("Поиск")).toBeInTheDocument()
  })
})

describe("TableTopSummary", () => {
  it("renders the info and actions slots", () => {
    render(
      <TableTopSummary
        info={<span>Результатов: 8</span>}
        actions={<button>Настроить столбцы</button>}
      />
    )
    expect(screen.getByText("Результатов: 8")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Настроить столбцы" })).toBeInTheDocument()
  })

  it("omits the actions slot when none are given", () => {
    render(<TableTopSummary info={<span>Результатов: 8</span>} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
