import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

describe("Calendar regressions", () => {
  it("opens month mode on the selected month's year", () => {
    render(<Calendar mode="month" monthValue={{ year: 2020, month: 2 }} />)
    expect(screen.getByText("2020")).toBeInTheDocument()
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument()
  })

  it("opens year mode on a window that contains the selected year", () => {
    render(<Calendar mode="year" yearValue={1990} />)
    expect(screen.getByRole("button", { pressed: true })).toHaveTextContent("1990")
  })

  it("reports a confirmed reset as onChange(null)", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar mode="single" value={new Date(2024, 0, 15)} onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Сбросить" }))
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onChange).toHaveBeenCalledWith(null)
  })
})
