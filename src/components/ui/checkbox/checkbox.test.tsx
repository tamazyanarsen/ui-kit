import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("renders the bare box without a label", () => {
    render(<Checkbox aria-label="Согласие" />)
    expect(screen.getByRole("checkbox", { name: "Согласие" })).toBeInTheDocument()
  })

  it("renders a label and toggles when clicked", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Согласен с условиями" onCheckedChange={onCheckedChange} />)

    const box = screen.getByRole("checkbox", { name: "Согласен с условиями" })
    expect(box).not.toBeChecked()

    await user.click(box)

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("supports being controlled via `checked`", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Опция" checked={false} onCheckedChange={onCheckedChange} />)

    const box = screen.getByRole("checkbox", { name: "Опция" })
    await user.click(box)

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    // Controlled: stays unchecked because the consumer hasn't fed the new value back.
    expect(box).not.toBeChecked()
  })

  it("shows the indeterminate state", () => {
    render(<Checkbox label="Выбрать всё" indeterminate />)
    const box = screen.getByRole("checkbox", { name: "Выбрать всё" })
    expect(box).toHaveAttribute("aria-checked", "mixed")
  })

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Заблокировано" disabled onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole("checkbox", { name: "Заблокировано" }))

    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("shows the error message instead of the comment", () => {
    render(<Checkbox label="Поле" comment="Подсказка" error="Ошибка" />)
    expect(screen.getByText("Ошибка")).toBeInTheDocument()
    expect(screen.queryByText("Подсказка")).not.toBeInTheDocument()
  })
})
