import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

const JAN_2024 = new Date(2024, 0, 15)

// DatePicker is controlled: it only renders the date a consumer feeds back
// through `value`. A wrapper with real state mirrors how a real page would
// wire it, matching this kit's own convention for testing controlled
// components (see feedback on Select/Calendar demos).
function ControlledSingle({ onChange }: { onChange: (date: Date) => void }) {
  const [value, setValue] = useState<Date | null>(JAN_2024)
  return (
    <DatePicker
      value={value}
      onChange={(date) => {
        if (date) setValue(date)
        onChange(date!)
      }}
    />
  )
}

describe("DatePicker", () => {
  it("uses a mode-appropriate default label", () => {
    render(<DatePicker mode="range" />)
    expect(screen.getByLabelText("Дата начала — Дата окончания")).toBeInTheDocument()
  })

  it("opens the calendar dropdown when the field is clicked", async () => {
    const user = userEvent.setup()
    render(<DatePicker value={JAN_2024} />)

    expect(screen.queryByRole("button", { name: "Применить" })).not.toBeInTheDocument()

    await user.click(screen.getByLabelText("Дата"))

    expect(await screen.findByRole("button", { name: "Применить" })).toBeInTheDocument()
  })

  it("commits the picked day into the field and calls onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledSingle onChange={onChange} />)

    await user.click(screen.getByLabelText("Дата"))
    await user.click(await screen.findByRole("button", { name: "20" }))
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].getDate()).toBe(20)
    expect(screen.getByLabelText("Дата")).toHaveValue("20.01.2024")
  })

  it("does not open when disabled", async () => {
    const user = userEvent.setup()
    render(<DatePicker disabled />)

    await user.click(screen.getByLabelText("Дата"))

    expect(screen.queryByRole("button", { name: "Применить" })).not.toBeInTheDocument()
  })

  it("renders the single-mode field as a masked date input", () => {
    render(<DatePicker />)
    // Manual typing goes through Input's own `mask="date"` (react-imask)
    // integration — covered by input.test.tsx, not re-tested here.
    expect(screen.getByLabelText("Дата")).toHaveAttribute("placeholder", "ДД.ММ.ГГГГ")
  })
})
