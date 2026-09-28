import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

// Клавиатура сетки дней (APG «Date Picker Dialog»): в порядке Tab ровно один
// день, остальное — стрелками. Раньше каждый день был своей остановкой Tab.

const days = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLButtonElement>('[data-slot="calendar-day"]')]

const tabbable = (container: HTMLElement) =>
  days(container).filter((day) => day.tabIndex === 0)

const focused = () => (document.activeElement as HTMLElement).dataset.date

describe("Calendar: остановка Tab в сетке дней", () => {
  it("одна на всю сетку — выбранный день; следующий Tab уходит из сетки", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <>
        <button type="button">До</button>
        <Calendar value={new Date(2026, 2, 15)} />
      </>
    )
    expect(tabbable(container).map((d) => d.dataset.date)).toEqual(["2026-3-15"])

    await user.click(screen.getByRole("button", { name: "До" }))
    // До: «назад», «месяц», «год», «вперёд» шапки — затем сетка.
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(focused()).toBe("2026-3-15")
    await user.tab()
    expect(document.activeElement).toHaveTextContent("Сбросить")
  })

  it("без выбора — первый доступный день показанного месяца", () => {
    const { container } = render(
      <Calendar
        defaultMonth={new Date(2020, 1, 1)}
        disabledDate={(d) => d.getDate() < 3}
      />
    )
    expect(tabbable(container).map((d) => d.dataset.date)).toEqual(["2020-2-3"])
  })

  it("у Range одна остановка на обе сетки", () => {
    const { container } = render(
      <Calendar mode="range" defaultMonth={new Date(2026, 0, 1)} rangeValue={[null, null]} />
    )
    expect(tabbable(container)).toHaveLength(1)
  })
})

describe("Calendar: клавиши сетки дней", () => {
  async function focusDay(date: Date, extra: Partial<Parameters<typeof Calendar>[0]> = {}) {
    const user = userEvent.setup()
    const utils = render(<Calendar value={date} {...extra} />)
    tabbable(utils.container)[0].focus()
    return { user, ...utils }
  }

  it("←/→ — день, ↑/↓ — неделя", async () => {
    const { user } = await focusDay(new Date(2026, 2, 15))
    await user.keyboard("{ArrowRight}")
    expect(focused()).toBe("2026-3-16")
    await user.keyboard("{ArrowDown}")
    expect(focused()).toBe("2026-3-23")
    await user.keyboard("{ArrowLeft}")
    expect(focused()).toBe("2026-3-22")
    await user.keyboard("{ArrowUp}")
    expect(focused()).toBe("2026-3-15")
  })

  it("Home/End — понедельник и воскресенье той же недели", async () => {
    // 18.03.2026 — среда.
    const { user } = await focusDay(new Date(2026, 2, 18))
    await user.keyboard("{Home}")
    expect(focused()).toBe("2026-3-16")
    await user.keyboard("{End}")
    expect(focused()).toBe("2026-3-22")
  })

  it("End с выключенными выходными — пятница той же недели, а не следующий понедельник", async () => {
    // 11.03.2026 — среда; суббота и воскресенье выключены.
    const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6
    const { user } = await focusDay(new Date(2026, 2, 11), { disabledDate: weekend })
    await user.keyboard("{End}")
    expect(focused()).toBe("2026-3-13")
  })

  it("Home с выключенным понедельником — вторник той же недели", async () => {
    const monday = (d: Date) => d.getDay() === 1
    const { user } = await focusDay(new Date(2026, 2, 11), { disabledDate: monday })
    await user.keyboard("{Home}")
    expect(focused()).toBe("2026-3-10")
  })

  it("PageUp/PageDown — месяц со сменой показанного, Shift — год", async () => {
    const { user } = await focusDay(new Date(2026, 0, 31))
    await user.keyboard("{PageDown}")
    // 31 января → 28 февраля: число прижимается к длине месяца.
    expect(focused()).toBe("2026-2-28")
    expect(screen.getByRole("button", { name: "Февраль" })).toBeInTheDocument()
    await user.keyboard("{PageUp}")
    expect(focused()).toBe("2026-1-28")
    await user.keyboard("{Shift>}{PageDown}{/Shift}")
    expect(focused()).toBe("2027-1-28")
    expect(screen.getByRole("button", { name: "2027" })).toBeInTheDocument()
  })

  it("стрелка за край месяца листает месяц", async () => {
    const { user } = await focusDay(new Date(2026, 2, 31))
    await user.keyboard("{ArrowRight}")
    expect(focused()).toBe("2026-4-1")
    expect(screen.getByRole("button", { name: "Апрель" })).toBeInTheDocument()
  })

  it("выключенные дни пропускаются в сторону движения", async () => {
    const { user } = await focusDay(new Date(2026, 2, 15), {
      disabledDate: (d) => d.getMonth() === 2 && d.getDate() >= 16 && d.getDate() <= 18,
    })
    await user.keyboard("{ArrowRight}")
    expect(focused()).toBe("2026-3-19")
    await user.keyboard("{ArrowLeft}")
    expect(focused()).toBe("2026-3-15")
  })

  it("Enter выбирает день, как и раньше", async () => {
    const { user } = await focusDay(new Date(2026, 2, 15))
    await user.keyboard("{ArrowRight}{Enter}")
    expect(document.activeElement).toHaveAttribute("data-selected")
  })

  it("Range: стрелка с конца первого месяца переходит во второй", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 0, 1)}
        rangeValue={[new Date(2026, 0, 31), null]}
      />
    )
    tabbable(container)[0].focus()
    await user.keyboard("{ArrowRight}")
    expect(focused()).toBe("2026-2-1")
    // Дальше второго месяца — окно сдвигается на месяц.
    await user.keyboard("{PageDown}")
    expect(focused()).toBe("2026-3-1")
    expect(tabbable(container)).toHaveLength(1)
  })
})

describe("Calendar: мобильный лист", () => {
  it("одна остановка Tab на всю ленту месяцев", () => {
    const { container } = render(
      <Calendar layout="sheet" value={new Date(2026, 2, 15)} />
    )
    expect(days(container).length).toBeGreaterThan(31)
    expect(tabbable(container).map((d) => d.dataset.date)).toEqual(["2026-3-15"])
  })
})
