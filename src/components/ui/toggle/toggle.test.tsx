import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Toggle } from "./toggle"

describe("Toggle", () => {
  it("renders the bare switch without a label", () => {
    render(<Toggle aria-label="Уведомления" />)
    expect(screen.getByRole("switch", { name: "Уведомления" })).toBeInTheDocument()
  })

  it("toggles on click and calls onCheckedChange", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Toggle label="Уведомления" onCheckedChange={onCheckedChange} />)

    const track = screen.getByRole("switch", { name: "Уведомления" })
    expect(track).not.toBeChecked()

    await user.click(track)

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Toggle label="Уведомления" disabled onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole("switch", { name: "Уведомления" }))

    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("renders both the comment and the error together, unlike Checkbox/Radio", () => {
    render(<Toggle label="Уведомления" comment="Подсказка" error="Ошибка" />)
    expect(screen.getByText("Подсказка")).toBeInTheDocument()
    expect(screen.getByText("Ошибка")).toBeInTheDocument()
  })
})
