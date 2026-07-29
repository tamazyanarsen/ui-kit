import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

const JAN_2024 = new Date(2024, 0, 15)

describe("Calendar", () => {
  it("fires onChange immediately when there is no footer", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Calendar
        mode="single"
        footer={false}
        defaultMonth={JAN_2024}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "10" }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].getDate()).toBe(10)
  })

  it("only commits the selection once Применить is clicked when a footer is shown", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Calendar
        mode="single"
        footer
        defaultMonth={JAN_2024}
        onChange={onChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "10" }))
    expect(onChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].getDate()).toBe(10)
  })

  it("clears the draft when Сбросить is clicked", async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    render(<Calendar mode="single" footer defaultMonth={JAN_2024} onReset={onReset} />)

    await user.click(screen.getByRole("button", { name: "10" }))
    await user.click(screen.getByRole("button", { name: "Сбросить" }))

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it("builds a range from two day clicks and commits it on Применить", async () => {
    const user = userEvent.setup()
    const onRangeChange = vi.fn()
    render(
      <Calendar
        mode="range"
        defaultMonth={JAN_2024}
        onRangeChange={onRangeChange}
      />
    )

    const tens = screen.getAllByRole("button", { name: "10" })
    const twenties = screen.getAllByRole("button", { name: "20" })
    await user.click(tens[0])
    await user.click(twenties[0])
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onRangeChange).toHaveBeenCalledTimes(1)
    const [start, end] = onRangeChange.mock.calls[0][0]
    expect(start.getDate()).toBe(10)
    expect(end.getDate()).toBe(20)
  })

  it("navigates to the next month", async () => {
    const user = userEvent.setup()
    render(<Calendar mode="single" defaultMonth={JAN_2024} />)

    expect(screen.getByText("Январь")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Вперёд" }))

    expect(screen.getByText("Февраль")).toBeInTheDocument()
  })
})
