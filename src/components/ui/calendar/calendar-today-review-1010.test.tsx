import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render } from "@testing-library/react"

import { Calendar } from "./calendar"

const tabbable = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLButtonElement>('[data-slot="calendar-day"]')]
    .filter((day) => day.tabIndex === 0)
    .map((day) => day.dataset.date)

afterEach(() => {
  vi.useRealTimers()
})

// Ревью 10.10, п. 14: «сегодня» уходило в `disabledDate` с временем суток, и
// сегодняшний день считался выключенным только на пути выбора остановки Tab.
describe("Calendar: «сегодня» — полночь (ревью 10.10, п. 14)", () => {
  it("остановка Tab — сегодняшний день, а не 1-е число", () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 9, 10, 15, 30))
    const maxDate = new Date(2026, 9, 10)
    const { container } = render(<Calendar disabledDate={(d) => d > maxDate} />)
    expect(tabbable(container)).toEqual(["2026-10-10"])
  })

  it("после полуночи остановка переезжает на новый день", () => {
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] })
    vi.setSystemTime(new Date(2026, 9, 10, 23, 59, 30))
    const { container } = render(<Calendar />)
    expect(tabbable(container)).toEqual(["2026-10-10"])

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(tabbable(container)).toEqual(["2026-10-11"])
  })
})
