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

  // ⚠️ Как и у Input: заблокированная область принимает Tab. Блокировка это
  // пара `readOnly` + `aria-disabled`, а не нативный `disabled`, который
  // убрал бы её из обхода клавиатурой целиком.
  it("blocks editing but stays reachable by Tab when disabled", async () => {
    const user = userEvent.setup()
    render(<Textarea label="Комментарий" disabled />)

    const field = screen.getByLabelText("Комментарий")
    expect(field).toHaveAttribute("aria-disabled", "true")
    expect(field).toHaveAttribute("readonly")
    expect(field).not.toBeDisabled()

    await user.tab()
    expect(field).toHaveFocus()

    await user.keyboard("текст")
    expect(field).toHaveValue("")
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
