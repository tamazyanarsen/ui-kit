import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate, FilterSelect } from "."

// Аудит 13: в низком окне (1280×400) окно FilterSelect на 40 вариантов было
// выше доступного места и уходило вниз: «Применить» стояла на 391…447 при
// высоте окна 400, а прокрутка не помогала — позиционер двигает окно
// вслед за ней. Раскладку jsdom не считает, поэтому проверяются
// ограничения; вживую сверено в Chrome на 400 и 500 по высоте.

const popup = () => document.querySelector('[data-slot="filter-content"]') as HTMLElement

async function open(label: string) {
  await userEvent.setup().click(screen.getByText(label))
}

const OPTIONS = Array.from({ length: 40 }, (_, i) => ({ value: `v${i}`, label: `Вариант ${i + 1}` }))

describe("Окна фильтров не выше доступного места", () => {
  it("высота окна ограничена, сжимается список FilterSelect", async () => {
    render(<FilterSelect label="Статус" options={OPTIONS} />)
    await open("Статус")
    expect(popup()).toHaveClass("max-h-(--available-height)", "flex", "flex-col")
    const list = screen.getAllByRole("checkbox")[0].closest(".overflow-y-auto") as HTMLElement
    expect(list).toHaveClass("min-h-0")
  })

  it("у FilterDate сжимается и прокручивается календарь", async () => {
    render(<FilterDate label="Период" />)
    await open("Период")
    expect(popup()).toHaveClass("max-h-(--available-height)")
    const calendar = popup().querySelector('[data-slot="filter-date-calendar"]') as HTMLElement
    expect(calendar).toHaveClass("min-h-0", "overflow-y-auto")
  })
})
