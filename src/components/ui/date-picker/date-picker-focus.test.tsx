import { useState } from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

function ControlledSingle() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 0, 1))
  return <DatePicker value={value} onChange={setValue} />
}

// Третий проход: всё поле было кнопкой-триггером поповера. Клик уводил
// фокус в календарь — набирать дату было некуда, а уход фокуса стирал
// недописанное.
describe("DatePicker field focus", () => {
  it("keeps focus in the field after a click, so the date can be typed", async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const field = screen.getByLabelText("Дата") as HTMLInputElement

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    await user.keyboard("15032026")

    expect(document.activeElement).toBe(field)
    expect(field.value).toBe("15.03.2026")
  })

  it("does not wipe a partial date when the field is clicked", async () => {
    const user = userEvent.setup()
    render(<ControlledSingle />)
    const field = screen.getByLabelText("Дата") as HTMLInputElement

    await user.tab()
    field.setSelectionRange(0, field.value.length)
    await user.keyboard("150")
    await user.click(field)

    expect(field.value).toBe("15.0")
  })

  it("is a single Tab stop and not nested inside a button", async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const field = screen.getByLabelText("Дата")

    await user.tab()

    expect(document.activeElement).toBe(field)
    expect(field.closest("[role=button]")).toBeNull()
  })

  it("moves focus into the calendar when opened with ArrowDown", async () => {
    const user = userEvent.setup()
    render(<DatePicker />)
    const field = screen.getByLabelText("Дата")

    await user.tab()
    await user.keyboard("{ArrowDown}")
    const popup = await screen.findByRole("button", { name: "Применить" })

    expect(field).toHaveAttribute("aria-expanded", "true")
    expect(popup.closest("[data-slot=date-picker-content]")?.contains(document.activeElement)).toBe(
      true
    )
  })
})

describe("DatePicker closing without a trigger", () => {
  it("closes the calendar when Tab leaves the field", async () => {
    const user = userEvent.setup()
    render(
      <>
        <DatePicker />
        <button type="button">Дальше</button>
      </>
    )

    await user.click(screen.getByLabelText("Дата"))
    await screen.findByRole("button", { name: "Применить" })
    await user.tab()

    expect(screen.getByLabelText("Дата")).toHaveAttribute("aria-expanded", "false")
  })
})
