import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DropdownItem } from "./dropdown"

// Правки UI-Kit от 25.10: одно поведение у всех строк выпадающих списков.

const row = (container: HTMLElement) =>
  container.querySelector('[data-slot="dropdown-item"]') as HTMLElement

describe("DropdownItem: строка списка", () => {
  it("общая строка menu-row, сжатие к центру одной обёрткой", () => {
    const { container } = render(<DropdownItem text="Пункт" description="Описание" />)
    const el = row(container)
    expect(el).toHaveClass("menu-row", "press-scale-content")
    expect(el.className).not.toContain("--press-origin")
    expect(el.className).not.toContain("cursor-default")
    // Поля — на обёртке: её центр и есть центр строки.
    expect(el).not.toHaveClass("p-4")
    expect(el.children).toHaveLength(1)
    expect(el.firstElementChild).toHaveAttribute("data-slot", "dropdown-item-content")
    expect(el.firstElementChild).toHaveClass("p-4", "[overflow-wrap:anywhere]")
  })

  it("выключенная строка не гасит указатель — курсор not-allowed", () => {
    const { container } = render(<DropdownItem text="Пункт" data-disabled="" />)
    expect(row(container).className).not.toContain("pointer-events-none")
  })

  it("checked: undefined — без места под галку; false — место; true — галка", () => {
    const { container, rerender } = render(<DropdownItem text="Пункт" />)
    const content = () => row(container).firstElementChild as HTMLElement
    const check = () => container.querySelector('[data-slot="dropdown-item-check"]')
    expect(content()).not.toHaveClass("pr-12")
    expect(check()).toBeNull()

    rerender(<DropdownItem text="Пункт" checked={false} />)
    expect(content()).toHaveClass("pr-12")
    expect(check()).toBeNull()

    rerender(<DropdownItem text="Пункт" checked />)
    expect(content()).toHaveClass("pr-12")
    expect(content()).toContainElement(check() as HTMLElement)
  })
})
