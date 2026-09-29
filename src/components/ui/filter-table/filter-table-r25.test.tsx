import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate } from "./filter-date"
import { FilterSelect } from "./filter-select"
import { FilterTableSelect } from "./filter-table-select"

// r25: окно поиска не ограничивалось доступной высотой; значение из пробелов
// считалось выбранным и рисовало пустой чип; null в массивах роняли фильтры.

describe("FilterTableSelect", () => {
  it("окно ограничено доступной высотой и шириной", async () => {
    const user = userEvent.setup()
    render(<FilterTableSelect label="Поиск" />)
    await user.click(screen.getByText("Поиск"))
    const popup = document.querySelector('[data-slot="filter-content"]') as HTMLElement
    expect(popup.className).toContain("max-h-[min(504px,var(--available-height,504px))]")
    expect(popup.className).toContain("max-w-[calc(100vw-32px)]")
  })

  it("значение из одних пробелов — пустой фильтр, без кнопки сброса", () => {
    render(<FilterTableSelect label="Поиск" value="   " />)
    expect(screen.queryByRole("button", { name: "Сбросить фильтр" })).toBeNull()
    expect(document.querySelector('[data-slot="filter"]')).not.toHaveAttribute(
      "data-checked"
    )
  })

  it("в чипе значение показано обрезанным", () => {
    render(<FilterTableSelect label="Поиск" value="  ООО  " onValueChange={vi.fn()} />)
    expect(screen.getByText("ООО").textContent).toBe("ООО")
  })
})

describe("FilterSelect с пустыми элементами", () => {
  it("null среди групп и опций не роняет окно", async () => {
    const user = userEvent.setup()
    const groups = [
      null,
      { label: "Статус", options: [null, { value: "a", label: "Действующий" }] },
    ] as unknown as { label: string; options: { value: string; label: string }[] }[]
    render(<FilterSelect label="Статус" groups={groups} />)
    await user.click(screen.getByText("Статус"))
    expect(await screen.findByText("Действующий")).toBeInTheDocument()
  })
})

describe("FilterDate с пустыми заготовками", () => {
  it("null среди заготовок не роняет окно и не оставляет пустой ряд", async () => {
    const user = userEvent.setup()
    render(<FilterDate label="Дата" presets={[null] as never} />)
    await user.click(screen.getByText("Дата"))
    await screen.findByText("Применить")
    expect(document.querySelector('[data-slot="filter-date-presets"]')).toBeNull()
  })
})
