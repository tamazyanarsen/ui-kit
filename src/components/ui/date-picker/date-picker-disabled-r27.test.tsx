import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

// Круг 27: `disabled` на лету закрывал календарь только на экране, а
// внутреннее `open` оставалось true — после снятия блокировки календарь
// открывался сам, без действий человека.

const popup = () => document.querySelector('[data-slot="date-picker-content"]')

describe("DatePicker: disabled на лету", () => {
  it("календарь, закрытый блокировкой, не открывается сам при её снятии", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<DatePicker label="Дата" />)
    await user.click(screen.getByLabelText("Дата"))
    expect(popup()).not.toBeNull()
    rerender(<DatePicker label="Дата" disabled />)
    await new Promise((r) => setTimeout(r, 50))
    expect(popup()).toBeNull()
    rerender(<DatePicker label="Дата" />)
    await new Promise((r) => setTimeout(r, 50))
    expect(popup()).toBeNull()
  })
})
