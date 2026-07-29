import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CountButton } from "./count-button"

describe("CountButton", () => {
  it("renders the button label and the count badge", () => {
    render(<CountButton count={3}>Уведомления</CountButton>)

    expect(screen.getByRole("button", { name: "Уведомления" })).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("caps the badge at 99+", () => {
    render(<CountButton count={250}>Уведомления</CountButton>)
    expect(screen.getByText("99+")).toBeInTheDocument()
  })

  it("forwards Button props like onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <CountButton count={1} onClick={onClick}>
        Уведомления
      </CountButton>
    )

    await user.click(screen.getByRole("button", { name: "Уведомления" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
