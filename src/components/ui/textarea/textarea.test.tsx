import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("renders a label associated with the field", () => {
    render(<Textarea label="Комментарий" />)
    expect(screen.getByLabelText("Комментарий")).toBeInTheDocument()
  })

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Комментарий" onChange={onChange} />)

    await user.type(screen.getByLabelText("Комментарий"), "Привет")

    expect(screen.getByLabelText("Комментарий")).toHaveValue("Привет")
    expect(onChange).toHaveBeenCalled()
  })

  it("shows the error message instead of the comment", () => {
    render(<Textarea label="Комментарий" comment="Подсказка" error="Обязательное поле" />)
    expect(screen.getByText("Обязательное поле")).toBeInTheDocument()
    expect(screen.queryByText("Подсказка")).not.toBeInTheDocument()
  })

  it("is disabled when disabled is set", () => {
    render(<Textarea label="Комментарий" disabled />)
    expect(screen.getByLabelText("Комментарий")).toBeDisabled()
  })

  it("marks itself read-only and shows the lock icon when locked", () => {
    const { container } = render(<Textarea label="Комментарий" locked />)
    expect(screen.getByLabelText("Комментарий")).toHaveAttribute("readonly")
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("defaults to 3 rows", () => {
    render(<Textarea label="Комментарий" />)
    expect(screen.getByLabelText("Комментарий")).toHaveAttribute("rows", "3")
  })
})
