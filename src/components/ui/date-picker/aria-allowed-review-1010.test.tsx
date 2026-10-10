import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Chips } from "@/components/ui/chips"

import { DatePicker } from "./date-picker"

// Ревью 10.10, п. 26: `aria-expanded` стоял на узлах, роль которых его не
// поддерживает, — на поле даты (`textbox`) и на чипсе (`<span>` без роли).
// Скринридер его игнорировал, axe отмечал `aria-allowed-attr`.
describe("aria-expanded только на ролях, которые его поддерживают (ревью 10.10, п. 26)", () => {
  it("поле DatePicker — combobox с всплывающим диалогом", () => {
    render(<DatePicker label="Дата" />)
    const field = screen.getByRole("combobox", { name: "Дата" })
    expect(field).toHaveAttribute("aria-haspopup", "dialog")
    expect(field).toHaveAttribute("aria-expanded", "false")
  })

  it("чипса с выпадающим списком не ставит aria-expanded на span", () => {
    const { container } = render(
      <Chips type="filter-white" showSelect open>
        Статус
      </Chips>
    )
    const chip = container.querySelector('[data-slot="chips"]')!
    expect(chip).not.toHaveAttribute("aria-expanded")
    // Шеврон по-прежнему знает о раскрытии.
    expect(chip).toHaveAttribute("data-open")
  })
})
