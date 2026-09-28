import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

function ControlledSingle({ onChange }: { onChange: (date: Date | null) => void }) {
  const [value, setValue] = useState<Date | null>(new Date(2026, 8, 15))
  return (
    <DatePicker
      value={value}
      onChange={(date) => {
        setValue(date)
        onChange(date)
      }}
    />
  )
}

describe("DatePicker regressions", () => {
  it("clears the single-date field on Сбросить", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledSingle onChange={onChange} />)
    expect(screen.getByLabelText("Дата")).toHaveValue("15.09.2026")

    await user.click(screen.getByLabelText("Дата"))
    await user.click(await screen.findByRole("button", { name: "Сбросить" }))

    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.getByLabelText("Дата")).toHaveValue("")
  })

  it("reports null when the date is erased from the keyboard", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ControlledSingle onChange={onChange} />)

    await user.clear(screen.getByLabelText("Дата"))

    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it("resets a controlled month through onMonthChange(null)", async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    render(
      <DatePicker
        mode="month"
        monthValue={{ year: 2026, month: 2 }}
        onMonthChange={onMonthChange}
      />
    )

    await user.click(screen.getByLabelText("Месяц"))
    await user.click(await screen.findByRole("button", { name: "Сбросить" }))

    expect(onMonthChange).toHaveBeenCalledWith(null)
  })

  it("resets a controlled year through onYearChange(null)", async () => {
    const user = userEvent.setup()
    const onYearChange = vi.fn()
    render(<DatePicker mode="year" yearValue={2024} onYearChange={onYearChange} />)

    await user.click(screen.getByLabelText("Год"))
    await user.click(await screen.findByRole("button", { name: "Сбросить" }))

    expect(onYearChange).toHaveBeenCalledWith(null)
  })
})
