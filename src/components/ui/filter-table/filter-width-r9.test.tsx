import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate, FilterRange, FilterSelect, FilterTableSelect } from "."

// Аудит 8: окна фильтров задавали ширину из макета жёстко (384, у FilterDate
// 560) — на экране 375 они выходили за правый край, у FilterDate кнопка
// «Применить» была видна меньше чем наполовину. Раскладку jsdom не считает,
// поэтому проверяются ограничения; вживую сверено в Chrome на 375 и 1280.

const popup = () => document.querySelector('[data-slot="filter-content"]') as HTMLElement

async function open(label: string) {
  await userEvent.setup().click(screen.getByText(label))
}

describe("Окна фильтров не шире экрана", () => {
  it("FilterSelect и FilterRange: ширина ограничена видимой областью", async () => {
    const { unmount } = render(<FilterSelect label="Статус" options={[{ value: "a", label: "A" }]} />)
    await open("Статус")
    expect(popup().style.maxWidth).toBe("calc(100vw - 32px)")
    unmount()
    render(<FilterRange label="Сумма" />)
    await open("Сумма")
    expect(popup().style.maxWidth).toBe("calc(100vw - 32px)")
  })

  it("FilterTableSelect: ширина ограничена видимой областью", async () => {
    render(<FilterTableSelect label="Счёт" />)
    await open("Счёт")
    expect(popup().className).toContain("max-w-[calc(100vw-32px)]")
  })

  it("FilterDate: на узком окне второй месяц прячется, поля сжимаются", async () => {
    render(<FilterDate label="Дата" />)
    await open("Дата")
    const wrap = popup().querySelector('[data-slot="filter-date-calendar"]') as HTMLElement
    expect(wrap.className).toContain("@container/fdate")
    const months = wrap.querySelectorAll('[data-slot="calendar-range-month"]')
    expect(months).toHaveLength(2)
    expect(months[1]).toHaveAttribute("data-index", "1")
    for (const input of screen.getAllByRole("textbox")) {
      expect(input.closest(".min-w-0")).not.toBeNull()
    }
  })
})
