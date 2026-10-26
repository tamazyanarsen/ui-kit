import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { DropdownFooter, DropdownFooterButton } from "./dropdown-footer"

// Правки UI-Kit от 25.10, «Button внутри выпадающих списков — своё
// поведение»: заливка на всю ячейку без скругления, при нажатии ячейка не
// ужимается — сжимается только содержимое; цвета — как у строк списка.

describe("DropdownFooterButton", () => {
  it("цвета наведения и нажатия — как у строк списка (menu-row)", () => {
    render(<DropdownFooterButton>Применить</DropdownFooterButton>)
    const button = screen.getByRole("button", { name: "Применить" })
    expect(button).toHaveClass("menu-row")
    // Свой hover-цвет и transition-colors снят: их даёт menu-row.
    expect(button.className).not.toContain("hover:bg-")
    expect(button).not.toHaveClass("transition-colors")
  })

  it("ячейка не ужимается: без press-scale и press-clip, без скругления", () => {
    render(<DropdownFooterButton>Применить</DropdownFooterButton>)
    const button = screen.getByRole("button", { name: "Применить" })
    expect(button).toHaveClass("press-scale-content", "rounded-none")
    expect(button).not.toHaveClass("press-scale")
    expect(button).not.toHaveClass("press-clip")
  })

  it("содержимое — одна обёртка, её и сжимает press-scale-content", () => {
    render(<DropdownFooterButton>Применить</DropdownFooterButton>)
    const button = screen.getByRole("button", { name: "Применить" })
    expect(button.children).toHaveLength(1)
    expect(button.firstElementChild).toHaveAttribute(
      "data-slot",
      "dropdown-footer-button-content"
    )
  })

  it("выключенная кнопка — приглушённая заливка кита", () => {
    render(
      <DropdownFooter>
        <DropdownFooterButton disabled>Применить</DropdownFooterButton>
      </DropdownFooter>
    )
    const button = screen.getByRole("button", { name: "Применить" })
    expect(button).toBeDisabled()
    expect(button.className).toContain("disabled:bg-[var(--btn-muted-bg)]")
  })
})
