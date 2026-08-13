import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterSelect } from "./filter-select"
import { FilterRange } from "./filter-range"
import { FilterBoolean } from "./filter-boolean"
import { datePresetWeek } from "./filter-date"

const OPTIONS = [
  { value: "a", label: "Исполнен" },
  { value: "b", label: "Черновик" },
  { value: "c", label: "Отклонён" },
]

describe("FilterSelect — вид «Множественный выбор»", () => {
  it("opens a 384px popup", async () => {
    const user = userEvent.setup()
    render(<FilterSelect label="Статус" options={OPTIONS} />)
    await user.click(screen.getByText("Статус"))
    const popup = document.querySelector('[data-slot="filter-content"]')!
    expect(popup).toHaveStyle({ width: "384px" })
  })

  it("counts the draft in the Apply label and applies the selection", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <FilterSelect label="Статус" options={OPTIONS} onValueChange={onValueChange} />
    )

    await user.click(screen.getByText("Статус"))
    const boxes = screen.getAllByRole("checkbox")
    await user.click(boxes[0])
    await user.click(boxes[1])
    await user.click(screen.getByRole("button", { name: "Применить: 2" }))

    expect(onValueChange).toHaveBeenCalledWith(["a", "b"])
  })

  // "Показываем как множественное значение, соответствующее текущему максимуму"
  it("shows one value by name and several as a count", async () => {
    const { rerender } = render(
      <FilterSelect label="Статус" options={OPTIONS} value={["a"]} chip />
    )
    expect(screen.getByText("Исполнен")).toBeInTheDocument()

    rerender(
      <FilterSelect label="Статус" options={OPTIONS} value={["a", "b"]} chip />
    )
    expect(screen.getByText("Несколько (2)")).toBeInTheDocument()
  })

  // "Поиск срабатывает по всем уровням вложенности списка — как выбираемым,
  // так и заголовкам групп."
  it("filters options and keeps a group whose heading matches", async () => {
    const user = userEvent.setup()
    render(
      <FilterSelect
        label="Статус"
        groups={[
          { label: "Активные", options: [{ value: "a", label: "Исполнен" }] },
          { label: "Прочие", options: [{ value: "b", label: "Черновик" }] },
        ]}
      />
    )
    await user.click(screen.getByText("Статус"))
    await user.type(screen.getByRole("textbox"), "актив")

    expect(screen.getByText("Исполнен")).toBeInTheDocument()
    expect(screen.queryByText("Черновик")).not.toBeInTheDocument()
  })

  it("closes on Сбросить and clears the value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <FilterSelect
        label="Статус"
        options={OPTIONS}
        value={["a"]}
        onValueChange={onValueChange}
      />
    )
    await user.click(screen.getByText("Статус"))
    await user.click(screen.getByRole("button", { name: "Сбросить" }))

    expect(onValueChange).toHaveBeenCalledWith([])
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
  })
})

describe("FilterRange — фильтр сумм и количеств", () => {
  it("shows the validation message on the second field only", async () => {
    const user = userEvent.setup()
    render(<FilterRange label="Сумма" error="Проверьте диапазон" />)
    await user.click(screen.getByText("Сумма"))

    expect(screen.getByText("Проверьте диапазон")).toBeInTheDocument()
    const popup = document.querySelector('[data-slot="filter-content"]')!
    expect(popup).toHaveStyle({ width: "384px" })
  })

  it("reports which half is filled", () => {
    render(<FilterRange label="Сумма" value={{ from: "100", to: "" }} chip />)
    expect(screen.getByText("От 100")).toBeInTheDocument()
  })
})

describe("FilterBoolean — булев фильтр", () => {
  it("toggles without any dropdown", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterBoolean label="Ненулевой баланс" onValueChange={onValueChange} />)

    const pill = screen.getByRole("button", { name: "Ненулевой баланс" })
    expect(pill).toHaveAttribute("aria-pressed", "false")

    await user.click(pill)
    expect(onValueChange).toHaveBeenCalledWith(true)
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
  })
})

describe("datePresetWeek", () => {
  // "Выбор варианта «Неделя» ... выделяет диапазон «Текущая дата + 6 дней»
  // (то есть совокупно диапзон равен семи дням)"
  it("spans seven days inclusive", () => {
    const from = new Date(2026, 4, 12)
    const [start, end] = datePresetWeek(from)
    expect(start).toEqual(from)
    expect(end.getDate()).toBe(18)
  })
})
