import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

afterEach(() => {
  vi.useRealTimers()
})

// Ревью 10.10, КК-5: управляемость диапазона решалась двумя разными
// условиями — чтение через `??`, запись через `=== undefined`. Пришедший из
// JS `rangeValue={null}` показывал внутреннее значение, но менять его не
// давал: выбранный диапазон пропадал из поля.
describe("DatePicker range: rangeValue={null} — неуправляемый (ревью 10.10, КК-5)", () => {
  it("выбранный в календаре диапазон остаётся в поле", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 9, 1, 12))
    const user = userEvent.setup()
    const onRangeChange = vi.fn()
    render(
      <DatePicker
        mode="range"
        rangeValue={null as unknown as [Date | null, Date | null]}
        onRangeChange={onRangeChange}
      />
    )
    const field = screen.getByLabelText("Дата начала — Дата окончания") as HTMLInputElement
    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    const day = (date: string) =>
      document.querySelector<HTMLElement>(`[data-slot="calendar-day"][data-date="${date}"]`)!
    await user.click(day("2026-10-5"))
    await user.click(day("2026-10-9"))
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onRangeChange).toHaveBeenCalled()
    expect(field.value.replace(/\s/g, "")).toBe("05.10.2026\u201409.10.2026")
  })
})
