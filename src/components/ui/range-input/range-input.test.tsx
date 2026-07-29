import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { RangeInput } from "./range-input"

describe("RangeInput", () => {
  it("renders the label and formatted value", () => {
    render(<RangeInput label="Сумма" defaultValue={50} min={0} max={100} />)
    expect(screen.getByText("Сумма")).toBeInTheDocument()
    expect(screen.getByText("50")).toBeInTheDocument()
  })

  it("moves the thumb with the arrow keys and calls onValueChange", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RangeInput
        label="Сумма"
        defaultValue={50}
        min={0}
        max={100}
        step={1}
        onValueChange={onValueChange}
      />
    )

    const thumb = screen.getByRole("slider")
    thumb.focus()
    await user.keyboard("{ArrowRight}")

    expect(onValueChange).toHaveBeenCalledWith(51, expect.anything())
  })

  it("clamps to min/max", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RangeInput
        label="Сумма"
        defaultValue={100}
        min={0}
        max={100}
        onValueChange={onValueChange}
      />
    )

    const thumb = screen.getByRole("slider")
    thumb.focus()
    await user.keyboard("{ArrowRight}")

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("renders scale labels", () => {
    render(
      <RangeInput
        label="Сумма"
        defaultValue={50}
        min={0}
        max={100}
        scaleLabels={["0", "100"]}
      />
    )
    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
  })

  it("shows the error message instead of the comment", () => {
    render(
      <RangeInput
        label="Сумма"
        defaultValue={50}
        min={0}
        max={100}
        comment="Подсказка"
        error="Ошибка"
      />
    )
    expect(screen.getByText("Ошибка")).toBeInTheDocument()
    expect(screen.queryByText("Подсказка")).not.toBeInTheDocument()
  })

  it("marks the slider disabled", () => {
    render(<RangeInput label="Сумма" defaultValue={50} min={0} max={100} disabled />)
    expect(screen.getByRole("slider")).toBeDisabled()
  })
})
