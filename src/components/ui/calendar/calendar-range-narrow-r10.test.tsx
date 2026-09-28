import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MONTHS_RU_FULL, addMonths } from "@/lib/calendar"
import { DatePicker } from "@/components/ui/date-picker"
import { FilterDate } from "@/components/ui/filter-table"

// Аудит 9: на узком экране FilterDate прятал второй месяц диапазона одним
// CSS, а календарь продолжал считать его видимым — заготовка, выбравшая
// период в спрятанном месяце, заполняла поля, но не переводила сетку.
// DatePicker range на телефоне и вовсе раскрывал оба месяца (560px) за край
// экрана. Теперь число месяцев решает сам Calendar по ширине экрана.

const original = window.matchMedia

/** Узкий экран: совпадает только запрос «уже двух месяцев». */
function narrowScreen() {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes("max-width: 591.98px"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

const rangeMonths = () => document.querySelectorAll('[data-slot="calendar-range-month"]')

describe("Calendar range на узком экране: один месяц", () => {
  beforeEach(narrowScreen)
  afterEach(() => {
    window.matchMedia = original
  })

  it("DatePicker range показывает один месяц", async () => {
    const user = userEvent.setup()
    render(<DatePicker mode="range" rangeValue={[new Date(2026, 4, 10), new Date(2026, 4, 20)]} />)
    await user.click(screen.getByRole("textbox"))
    await screen.findByRole("button", { name: "Применить" })
    expect(rangeMonths()).toHaveLength(1)
    expect(screen.getByText("Май")).toBeInTheDocument()
  })

  it("FilterDate: заготовка в следующем месяце переводит сетку к себе", async () => {
    const user = userEvent.setup()
    const today = new Date()
    const current = { year: today.getFullYear(), month: today.getMonth() }
    const previous = addMonths(current.year, current.month, -1)
    render(
      <FilterDate
        label="Дата"
        presets={[
          {
            label: "Неделя",
            range: () => [
              new Date(current.year, current.month, 1),
              new Date(current.year, current.month, 7),
            ],
          },
        ]}
      />
    )
    await user.click(screen.getByText("Дата"))
    expect(rangeMonths()).toHaveLength(1)
    await user.click(screen.getByRole("button", { name: "Назад" }))
    expect(screen.getByText(MONTHS_RU_FULL[previous.month])).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Неделя" }))
    expect(screen.getByText(MONTHS_RU_FULL[current.month])).toBeInTheDocument()
    expect(screen.queryByText(MONTHS_RU_FULL[previous.month])).not.toBeInTheDocument()
  })
})
