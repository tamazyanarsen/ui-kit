import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

// Аудит 8: правка r7 («выбор снаружи за пределами видимого — перейти к нему»)
// считала видимым только месяц `focus`, а лента шторки показывает сразу
// много месяцев. Тап по дню в любом месяце кроме `focus` возвращался в
// календарь через `value` и переставлял якорь ленты — под пальцем
// оказывались другие месяцы.

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
]

/** Заголовки месяцев ленты в порядке отрисовки. */
const ribbon = () =>
  screen
    .getAllByText((_, el) => !!el && el.children.length === 0 && MONTHS.includes(el.textContent ?? ""))
    .map((el) => el.textContent)

/** Кнопка дня в секции месяца `name`. */
function dayIn(name: string, day: string) {
  const heading = screen.getByText(name, { selector: "*" })
  const section = heading.closest("div:not(.contents)")?.parentElement ?? heading.parentElement!
  return within(section as HTMLElement).getByRole("button", { name: day })
}

const START = ["Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Январь"]

describe("Calendar layout=sheet: выбор в ленте не сдвигает ленту", () => {
  it("single без подвала: тап по дню в ноябре оставляет ленту на месте", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = React.useState<Date | null>(null)
      return (
        <Calendar
          layout="sheet"
          mode="single"
          footer={false}
          defaultMonth={new Date(2026, 8, 1)}
          value={value}
          onChange={setValue}
        />
      )
    }
    render(<Harness />)
    expect(ribbon()).toEqual(START)
    await user.click(dayIn("Ноябрь", "15"))
    expect(ribbon()).toEqual(START)
  })

  it("range без подвала: конец периода в декабре не сдвигает ленту", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [range, setRange] = React.useState<[Date | null, Date | null]>([null, null])
      return (
        <Calendar
          layout="sheet"
          mode="range"
          footer={false}
          defaultMonth={new Date(2026, 8, 1)}
          rangeValue={range}
          onRangeChange={setRange}
        />
      )
    }
    render(<Harness />)
    await user.click(dayIn("Ноябрь", "3"))
    expect(ribbon()).toEqual(START)
    await user.click(dayIn("Декабрь", "10"))
    expect(ribbon()).toEqual(START)
  })

  it("с подвалом: «Применить» даты в ноябре не сдвигает ленту", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = React.useState<Date | null>(null)
      return (
        <Calendar
          layout="sheet"
          mode="single"
          defaultMonth={new Date(2026, 8, 1)}
          value={value}
          onChange={setValue}
        />
      )
    }
    render(<Harness />)
    await user.click(dayIn("Ноябрь", "15"))
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(ribbon()).toEqual(START)
  })

  it("внешняя дата вне ленты по-прежнему переводит к себе", () => {
    const { rerender } = render(
      <Calendar
        layout="sheet"
        mode="single"
        footer={false}
        defaultMonth={new Date(2026, 8, 1)}
        value={null}
      />
    )
    rerender(
      <Calendar
        layout="sheet"
        mode="single"
        footer={false}
        defaultMonth={new Date(2026, 8, 1)}
        value={new Date(2024, 2, 5)}
      />
    )
    expect(ribbon()[1]).toBe("Март")
  })
})
