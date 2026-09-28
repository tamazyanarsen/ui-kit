import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

// Аудит 6: календарь запоминал вид и месяц только при монтировании —
// смена `mode` на лету не меняла сетку, диапазон открывался на текущем
// месяце, а выбор, пришедший снаружи в другой месяц, оставался невидимым.

const shownMonths = () =>
  ["Январь", "Февраль", "Март", "Апрель"].filter((name) => screen.queryByText(name))

describe("Calendar: вид и месяц следуют за пропсами", () => {
  it("смена mode на лету переключает сетку", () => {
    const { rerender } = render(<Calendar mode="single" footer={false} />)
    expect(screen.getAllByRole("button", { name: "15" }).length).toBeGreaterThan(0)
    rerender(<Calendar mode="month" footer={false} />)
    expect(screen.queryAllByRole("button", { name: "15" })).toHaveLength(0)
    expect(screen.getByText("Янв")).toBeInTheDocument()
  })

  it("диапазон открывается на месяце своего начала", () => {
    render(
      <Calendar
        mode="range"
        footer={false}
        rangeValue={[new Date(2025, 0, 10), new Date(2025, 0, 20)]}
      />
    )
    expect(shownMonths()).toEqual(["Январь", "Февраль"])
    expect(screen.getAllByText("2025")).toHaveLength(2)
  })

  it("внешний диапазон в другом месяце переводит на него календарь", () => {
    const { rerender } = render(
      <Calendar
        mode="range"
        footer={false}
        rangeValue={[new Date(2025, 0, 10), new Date(2025, 0, 20)]}
      />
    )
    rerender(
      <Calendar
        mode="range"
        footer={false}
        rangeValue={[new Date(2024, 2, 1), new Date(2024, 2, 7)]}
      />
    )
    expect(shownMonths()).toEqual(["Март", "Апрель"])
    expect(screen.getAllByText("2024")).toHaveLength(2)
  })

  it("пролистанный к концу периода календарь не возвращается к началу", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [range, setRange] = React.useState<[Date | null, Date | null]>([null, null])
      return (
        <Calendar
          mode="range"
          footer={false}
          defaultMonth={new Date(2025, 0, 1)}
          rangeValue={range}
          onRangeChange={setRange}
        />
      )
    }
    render(<Harness />)
    await user.click(screen.getAllByRole("button", { name: "10" })[0])
    await user.click(screen.getAllByRole("button", { name: "Вперёд" })[0])
    await user.click(screen.getAllByRole("button", { name: "Вперёд" })[0])
    expect(shownMonths()).toEqual(["Март", "Апрель"])
    await user.click(screen.getAllByRole("button", { name: "5" })[0])
    expect(shownMonths()).toEqual(["Март", "Апрель"])
  })
})
