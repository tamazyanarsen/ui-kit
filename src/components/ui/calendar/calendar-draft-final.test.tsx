import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "@/components/ui/date-picker"
import { Calendar } from "./calendar"

// Финальный аудит: черновик пересинхронизировался с `value` / `rangeValue`
// по ССЫЛКЕ. Родитель, собирающий значение в рендере
// (`value={iso ? new Date(iso) : null}` в Controller из react-hook-form,
// `rangeValue={[null, null]}` прямо в JSX), на любой перерисовке стирал
// выбранное, но ещё не подтверждённое.

const day = (date: string) =>
  document.querySelector<HTMLElement>(`[data-slot="calendar-day"][data-date="${date}"]`)!

function RangeHost({
  onRangeChange,
}: {
  onRangeChange: (range: [Date | null, Date | null]) => void
}) {
  const [, setTick] = React.useState(0)
  return (
    <>
      <button type="button" onClick={() => setTick((t) => t + 1)}>
        перерисовать
      </button>
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 2, 1)}
        rangeValue={[null, null]}
        onRangeChange={onRangeChange}
      />
    </>
  )
}

describe("Calendar: черновик переживает перерисовку родителя", () => {
  it("диапазон с rangeValue, собранным в рендере", async () => {
    const user = userEvent.setup()
    const onRangeChange = vi.fn()
    render(<RangeHost onRangeChange={onRangeChange} />)

    await user.click(day("2026-3-5"))
    await user.click(screen.getByRole("button", { name: "перерисовать" }))
    await user.click(day("2026-3-9"))
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onRangeChange).toHaveBeenLastCalledWith([new Date(2026, 2, 5), new Date(2026, 2, 9)])
  })

  it("DatePicker с value, собранным в рендере", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    // Каждый рендер — новый объект Date того же дня, как в Controller.
    const picker = () => <DatePicker value={new Date(2026, 4, 15)} onChange={onChange} />
    const { rerender } = render(picker())

    await user.click(screen.getByRole("button", { name: "Открыть календарь" }))
    await user.click(day("2026-5-20"))
    rerender(picker())
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 4, 20))
  })
})
