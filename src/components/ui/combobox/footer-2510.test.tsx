import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ComboboxFooter } from "./footer"

// Правки UI-Kit от 25.10, «Button внутри выпадающих списков — своё
// поведение»: подвал комбобокса рисует ту же кнопку, что и подвал Dropdown,
// а не пилюлю Button со скруглённой заливкой.

describe("ComboboxFooter: кнопки подвала выпадающего списка", () => {
  it("обе кнопки — общая кнопка подвала, а не Button", () => {
    render(<ComboboxFooter applyLabel="Применить" onReset={() => {}} onApply={() => {}} />)
    for (const name of ["Сбросить", "Применить"]) {
      const button = screen.getByRole("button", { name })
      expect(button).toHaveAttribute("data-slot", "dropdown-footer-button")
      expect(button).toHaveClass("menu-row", "press-scale-content", "rounded-none")
      expect(button).not.toHaveClass("press-clip")
      expect(button).not.toHaveClass("press-scale")
    }
  })

  it("размер — L кита: 48 в мобильной форме, 56 на десктопе", () => {
    render(<ComboboxFooter applyLabel="Применить" onReset={() => {}} onApply={() => {}} />)
    const button = screen.getByRole("button", { name: "Применить" })
    expect(button).toHaveClass("min-h-12", "desktop:min-h-14", "text-p1-medium-adaptive")
  })

  it("нажатия доходят до обработчиков, выключенная кнопка молчит", async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    const onApply = vi.fn()
    render(
      <ComboboxFooter applyLabel="Применить" onReset={onReset} onApply={onApply} applyDisabled />
    )
    await user.click(screen.getByRole("button", { name: "Сбросить" }))
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(onApply).not.toHaveBeenCalled()
  })
})
