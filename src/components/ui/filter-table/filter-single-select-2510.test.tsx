import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { FilterSingleSelect } from "."

// Правки UI-Kit от 25.10, «Фильтр с одиночным выбором — нет готового
// компонента».

const OPTIONS = [
  { value: "3", label: "В ближайшие 3 дня" },
  { value: "7", label: "В ближайшие 7 дней" },
  { value: "30", label: "В ближайшие 30 дней" },
]

function renderDesktop(ui: React.ReactElement) {
  return render(<ViewportScope viewport="desktop">{ui}</ViewportScope>)
}

describe("FilterSingleSelect (десктоп)", () => {
  it("по умолчанию ничего не выбрано; строки — пункты без чекбоксов", async () => {
    renderDesktop(<FilterSingleSelect label="Истекает" options={OPTIONS} />)
    await userEvent.setup().click(screen.getByText("Истекает"))
    const rows = screen.getAllByRole("option")
    expect(rows).toHaveLength(3)
    for (const row of rows) {
      expect(row).toHaveAttribute("aria-selected", "false")
      expect(row.className.split(" ")).toContain("menu-row")
    }
    expect(screen.queryByRole("checkbox")).toBeNull()
    expect(document.querySelector("svg[data-slot='check']")).toBeNull()
    expect(screen.queryByRole("button", { name: /Применить/ })).toBeNull()
  })

  it("выбор сразу применяет и закрывает; крестик сбрасывает", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderDesktop(
      <FilterSingleSelect
        label="Истекает"
        options={OPTIONS}
        onValueChange={onValueChange}
      />
    )
    await user.click(screen.getByText("Истекает"))
    await user.click(screen.getByRole("option", { name: "В ближайшие 7 дней" }))
    expect(onValueChange).toHaveBeenLastCalledWith("7")
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
    const pill = document.querySelector('[data-slot="filter"]')!
    expect(pill).toHaveAttribute("data-checked")
    expect(pill).toHaveTextContent("В ближайшие 7 дней")

    await user.click(screen.getByRole("button", { name: "Сбросить фильтр" }))
    expect(onValueChange).toHaveBeenLastCalledWith(null)
    expect(pill).toHaveTextContent("Истекает")
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
  })

  it("клавиатура: стрелки ходят по строкам, Enter выбирает", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderDesktop(
      <FilterSingleSelect
        label="Истекает"
        options={OPTIONS}
        defaultValue="7"
        onValueChange={onValueChange}
      />
    )
    const pill = document.querySelector('[data-slot="filter"]') as HTMLElement
    pill.focus()
    await user.keyboard("{Enter}")
    const rows = await screen.findAllByRole("option")
    // Фокус открытия — на выбранной строке.
    await vi.waitFor(() => expect(rows[1]).toHaveFocus())
    await user.keyboard("{ArrowDown}")
    expect(rows[2]).toHaveFocus()
    await user.keyboard("{ArrowDown}")
    expect(rows[0]).toHaveFocus()
    await user.keyboard("{End}")
    expect(rows[2]).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("30")
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
  })
})

describe("FilterSingleSelect (мобильный вид)", () => {
  it("штора со строками; у выбранной галка; выбор закрывает", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <FilterSingleSelect
        label="Истекает"
        options={OPTIONS}
        defaultValue="3"
        onValueChange={onValueChange}
      />
    )
    await user.click(screen.getByText("В ближайшие 3 дня"))
    const sheet = document.querySelector('[data-slot="filter-sheet"]')!
    expect(sheet).not.toBeNull()
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
    const selected = screen.getByRole("option", { name: "В ближайшие 3 дня" })
    expect(selected.querySelector("svg")).not.toBeNull()
    await user.click(screen.getByRole("option", { name: "В ближайшие 30 дней" }))
    expect(onValueChange).toHaveBeenLastCalledWith("30")
    await vi.waitFor(() =>
      expect(document.querySelector('[data-slot="filter-sheet"]')).toBeNull()
    )
  })
})
