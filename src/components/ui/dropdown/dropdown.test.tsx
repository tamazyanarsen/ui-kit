import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Dropdown, DropdownItem } from "./dropdown"

// На Dropdown стоят Select, Combobox, Autocomplete, Button Menu, Header,
// Switcher, Employee Menu, Filter Table и Selection Button — это общая
// всплывающая поверхность кита, а не частность одного компонента.
describe("Dropdown", () => {
  it("рисует содержимое и помечает себя слотом", () => {
    render(<Dropdown data-testid="popup">список</Dropdown>)
    const popup = screen.getByTestId("popup")
    expect(popup).toHaveAttribute("data-slot", "dropdown")
    expect(popup).toHaveTextContent("список")
  })

  it("по умолчанию десктопная форма", () => {
    render(<Dropdown data-testid="popup" />)
    expect(screen.getByTestId("popup")).toHaveAttribute("data-size", "desktop")
  })

  // Мобильных форм в макете две, и они отличаются не только шириной: лист во
  // весь экран идёт без скруглений, нижняя шторка — со скруглением сверху.
  it("мобильные формы различаются между собой", () => {
    render(<Dropdown data-testid="sheet" size="mobile-bottom-sheet" />)
    expect(screen.getByTestId("sheet")).toHaveClass("rounded-t-[16px]")

    render(<Dropdown data-testid="full" size="mobile-full-screen" />)
    expect(screen.getByTestId("full")).toHaveClass("rounded-none")
  })

  // forwardRef здесь обязателен: примитивы Base UI подставляют Dropdown
  // через пропс `render` и пробрасывают в него ref для позиционирования.
  it("пробрасывает ref на элемент", () => {
    let node: HTMLDivElement | null = null
    render(<Dropdown ref={(el) => { node = el }} />)
    expect(node).toBeInstanceOf(HTMLDivElement)
  })

  it("принимает className, не теряя своих классов", () => {
    render(<Dropdown data-testid="popup" className="w-80" />)
    const popup = screen.getByTestId("popup")
    expect(popup).toHaveClass("w-80")
    expect(popup).toHaveClass("shadow-universal")
  })
})

describe("DropdownItem", () => {
  it("рисует основной текст и описание", () => {
    render(<DropdownItem text="Скачать" description="PDF или XLSX" />)
    expect(screen.getByText("Скачать")).toBeInTheDocument()
    expect(screen.getByText("PDF или XLSX")).toBeInTheDocument()
  })

  it("без описания рисует только основной текст", () => {
    render(<DropdownItem data-testid="item" text="Скачать" />)
    expect(screen.getByTestId("item")).toHaveTextContent("Скачать")
    expect(screen.queryByText("PDF или XLSX")).not.toBeInTheDocument()
  })

  it("пробрасывает ref на элемент", () => {
    let node: HTMLDivElement | null = null
    render(<DropdownItem text="Скачать" ref={(el) => { node = el }} />)
    expect(node).toBeInstanceOf(HTMLDivElement)
  })
})
