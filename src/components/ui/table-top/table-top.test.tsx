import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
  TableTopSummary,
  TableTopDetails,
} from "./table-top"

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

// «Сводка» — строка Details в нижней части верхней панели блока.
describe("TableTopDetails", () => {
  it("renders the label and every label: value pair", () => {
    render(
      <TableTopDetails
        items={[
          { label: "Кешбэк", value: "17 шт" },
          { label: "Сумма операций", value: "40 500 000,00 ₽" },
        ]}
      />
    )
    expect(screen.getByText("Сводка")).toBeInTheDocument()
    expect(screen.getByText("Кешбэк:")).toBeInTheDocument()
    expect(screen.getByText("17 шт")).toBeInTheDocument()
    expect(screen.getByText("Сумма операций:")).toBeInTheDocument()
    expect(screen.getByText("40 500 000,00 ₽")).toBeInTheDocument()
  })

  it("renders a separator between items but not before the first", () => {
    const { container } = render(
      <TableTopDetails
        items={[
          { label: "A", value: "1" },
          { label: "B", value: "2" },
          { label: "C", value: "3" },
        ]}
      />
    )
    // Отфильтровано по имени класса, а не выбрано селектором: класс
    // Tailwind у разделителя содержит квадратные и круглые скобки, которые
    // движок селекторов DOM отвергает даже в экранированном виде.
    const separators = [
      ...container.querySelectorAll("[aria-hidden='true']"),
    ].filter((node) => node.className.includes("--table-summary-divider"))
    expect(separators).toHaveLength(2)
  })
})
