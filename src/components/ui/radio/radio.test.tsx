import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Radio } from "./radio"
import { RadioGroup } from "./root"

describe("Radio", () => {
  it("renders the bare circle without a label", () => {
    render(<Radio value="a" aria-label="Опция" />)
    expect(screen.getByRole("radio", { name: "Опция" })).toBeInTheDocument()
  })

  it("shows the comment caption", () => {
    render(<Radio value="a" label="Опция" comment="Подсказка" />)
    expect(screen.getByText("Подсказка")).toBeInTheDocument()
  })
})

describe("RadioGroup", () => {
  it("selects one option and deselects the rest", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RadioGroup onValueChange={onValueChange}>
        <Radio value="a" label="Вариант A" />
        <Radio value="b" label="Вариант B" />
      </RadioGroup>
    )

    await user.click(screen.getByRole("radio", { name: "Вариант A" }))
    expect(onValueChange).toHaveBeenCalledWith("a", expect.anything())
    expect(screen.getByRole("radio", { name: "Вариант A" })).toHaveAttribute(
      "aria-checked",
      "true"
    )

    await user.click(screen.getByRole("radio", { name: "Вариант B" }))
    expect(onValueChange).toHaveBeenCalledWith("b", expect.anything())
    expect(screen.getByRole("radio", { name: "Вариант A" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
    expect(screen.getByRole("radio", { name: "Вариант B" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("does not toggle a disabled option", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RadioGroup onValueChange={onValueChange}>
        <Radio value="a" label="Вариант A" disabled />
        <Radio value="b" label="Вариант B" />
      </RadioGroup>
    )

    await user.click(screen.getByRole("radio", { name: "Вариант A" }))

    expect(onValueChange).not.toHaveBeenCalled()
  })
})
