import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "./button"

// This file is the reference example for testing UI-kit components with
// Vitest + React Testing Library. Follow this shape (render -> query by
// role/text -> assert behavior, not implementation) for the rest of the
// components in this directory.
describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Submit</Button>)

    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Submit
      </Button>
    )

    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it("disables the button and marks it busy while isLoading", () => {
    render(<Button isLoading aria-label="Submit" />)

    const button = screen.getByRole("button", { name: "Submit" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
  })
})
