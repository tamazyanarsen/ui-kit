import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "./button"

// Этот файл — образцовый пример тестирования компонентов кита на Vitest
// вместе с React Testing Library. Придерживайтесь этой формы (отрисовать →
// найти по роли или тексту → проверить поведение, а не реализацию) и для
// остальных компонентов этого каталога.
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
