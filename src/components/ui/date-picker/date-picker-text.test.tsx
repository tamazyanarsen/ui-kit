import { useState } from "react"
import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

function ControlledSingle() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 0, 1))
  return <DatePicker value={value} onChange={setValue} />
}

// Недописанный текст поля должен возвращаться к выбранной дате, даже если
// сама дата не сменилась.
describe("DatePicker field text", () => {
  async function typePartial() {
    const user = userEvent.setup()
    render(<ControlledSingle />)
    const field = screen.getByLabelText("Дата") as HTMLInputElement
    field.focus()
    field.setSelectionRange(0, field.value.length)
    await user.keyboard("150")
    expect(field.value).toBe("15.0")
    return { user, field }
  }

  it("restores the date text when the same day is re-applied", async () => {
    const { user, field } = await typePartial()

    await user.click(field)
    await user.click((await screen.findAllByRole("button", { name: "1" }))[0])
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(field).toHaveValue("01.01.2026")
  })

  it("restores the date text when the field loses focus", async () => {
    const { field } = await typePartial()

    fireEvent.blur(field)

    expect(field).toHaveValue("01.01.2026")
  })
})
