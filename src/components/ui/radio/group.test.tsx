import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { RadioGroup } from "./root"

const ITEMS = [
  { value: "a", label: "Первый" },
  { value: "b", label: "Второй" },
  { value: "c", label: "Третий", disabled: true },
]

function radio(name: string) {
  return screen.getByRole("radio", { name })
}

describe("RadioGroup joint behaviour", () => {
  it("renders every option from `items`", () => {
    render(<RadioGroup items={ITEMS} />)
    expect(screen.getAllByRole("radio")).toHaveLength(3)
  })

  // "включение одной означает отключение другой"
  it("selecting one option deselects the previous", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string | null>(null)
      return (
        <RadioGroup
          items={ITEMS}
          value={value}
          onValueChange={(next) => setValue(next as string)}
        />
      )
    }
    render(<Controlled />)

    await user.click(radio("Первый"))
    expect(radio("Первый")).toHaveAttribute("data-checked")

    await user.click(radio("Второй"))
    expect(radio("Второй")).toHaveAttribute("data-checked")
    expect(radio("Первый")).not.toHaveAttribute("data-checked")
  })

  it("never selects a disabled option", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<RadioGroup items={ITEMS} onValueChange={onValueChange} />)

    await user.click(radio("Третий"))

    expect(onValueChange).not.toHaveBeenCalled()
    expect(radio("Третий")).toHaveAttribute("data-disabled")
  })

  it("still accepts composed children instead of `items`", () => {
    render(
      <RadioGroup>
        <span data-testid="custom">свой layout</span>
      </RadioGroup>
    )
    expect(screen.getByTestId("custom")).toBeInTheDocument()
  })
})
