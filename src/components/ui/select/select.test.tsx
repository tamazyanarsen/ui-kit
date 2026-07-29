import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Select } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"
import { SelectValue } from "./root"

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
]

function Harness({ onValueChange }: { onValueChange?: (value: string | null) => void }) {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Select
      items={FRUIT_OPTIONS}
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
    >
      <SelectTrigger
        label="Фрукт"
        onClear={() => {
          setValue(null)
          onValueChange?.(null)
        }}
      >
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {FRUIT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

describe("Select", () => {
  it("renders the trigger", () => {
    render(<Harness />)
    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })

  it("opens the list of options on click", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.queryByRole("option")).not.toBeInTheDocument()

    await user.click(screen.getByRole("combobox"))

    expect(await screen.findByRole("option", { name: "Apple" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument()
  })

  it("selects an option and calls onValueChange", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Harness onValueChange={onValueChange} />)

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Banana" }))

    expect(onValueChange).toHaveBeenCalledWith("banana")
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana")
  })

  it("clears the selection via the clear button", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Harness onValueChange={onValueChange} />)

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Apple" }))

    await user.click(screen.getByRole("button", { name: "Очистить" }))

    expect(onValueChange).toHaveBeenLastCalledWith(null)
  })
})
