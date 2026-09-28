import { useState } from "react"
import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

function ControlledSingle() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 2, 15))
  return <DatePicker value={value} onChange={setValue} />
}

// Четвёртый проход: календарь, открытый КЛИКОМ, оставляет фокус в поле
// (в нём печатают). Оттуда клавиатура должна работать так же, как после
// открытия с клавиатуры.
describe("DatePicker keyboard after a click-open", () => {
  it("Tab closes the calendar and moves on in one press", async () => {
    const user = userEvent.setup()
    render(
      <>
        <DatePicker />
        <button type="button">Дальше</button>
      </>
    )
    const field = screen.getByLabelText("Дата")

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    await user.tab()

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Дальше" }))
    await waitFor(() => expect(field).toHaveAttribute("aria-expanded", "false"))
    // Возврат фокуса Base UI не должен отменить этот Tab.
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Дальше" }))
  })

  it("ArrowDown moves focus onto the selected day of an open calendar", async () => {
    const user = userEvent.setup()
    render(<ControlledSingle />)
    const field = screen.getByLabelText("Дата")

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    expect(document.activeElement).toBe(field)
    await user.keyboard("{ArrowDown}")

    expect(document.activeElement).toHaveAttribute("data-slot", "calendar-day")
    expect(document.activeElement).toHaveTextContent("15")
  })
})
