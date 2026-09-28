import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

// Итоговая проверка №3: неуправляемый календарь в режимах month и year, а
// в single без подвала, выбранное не отмечал — подсветка читала только
// пропсы, а своего состояния у этих режимов не было.

describe("Calendar без управляемого значения показывает выбор", () => {
  it("month: выбранный месяц отмечен", async () => {
    const user = userEvent.setup()
    const onMonthChange = vi.fn()
    render(<Calendar mode="month" onMonthChange={onMonthChange} />)
    expect(screen.queryByRole("button", { pressed: true })).toBeNull()

    await user.click(screen.getAllByRole("button", { pressed: false }).find(
      (button) => button.textContent?.trim() === "мар" || button.textContent?.trim() === "Мар"
    )!)

    expect(onMonthChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument()
  })

  it("year: выбранный год отмечен", async () => {
    const user = userEvent.setup()
    render(<Calendar mode="year" />)
    const year = String(new Date().getFullYear() - 1)
    await user.click(screen.getByRole("button", { name: year }))
    expect(screen.getByRole("button", { pressed: true })).toHaveTextContent(year)
  })

  it("single без подвала: выбранный день отмечен", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Calendar footer={false} defaultMonth={new Date(2026, 2, 1)} onChange={onChange} />)
    await user.click(screen.getByRole("button", { name: "15" }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(document.querySelectorAll('[data-slot="calendar-day"][data-selected]')).toHaveLength(1)
  })

  it("управляемый режим по-прежнему показывает только значение родителя", async () => {
    const user = userEvent.setup()
    render(<Calendar mode="month" monthValue={null} onMonthChange={() => {}} />)
    await user.click(screen.getAllByRole("button", { pressed: false })[5])
    expect(screen.queryByRole("button", { pressed: true })).toBeNull()
  })
})
