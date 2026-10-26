import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterDate, FilterRange, FilterSelect } from "."

// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“»: в мобильном виде (jsdom по умолчанию — «телефон») фильтр
// открывает штору Modal, а не поповер.

const OPTIONS = [
  { value: "a", label: "Исполнен" },
  { value: "b", label: "Черновик" },
]

const sheet = () =>
  document.querySelector('[data-slot="filter-sheet"]') as HTMLElement | null

describe("Фильтры в мобильном виде — штора", () => {
  it("FilterSelect: заголовок — название, чекбоксы, «Применить: N» / «Сбросить»", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <FilterSelect label="Статус" options={OPTIONS} onValueChange={onValueChange} />
    )
    await user.click(screen.getByText("Статус"))
    expect(sheet()).not.toBeNull()
    expect(document.querySelector('[data-slot="filter-content"]')).toBeNull()
    const dialog = within(sheet()!)
    expect(dialog.getByRole("heading", { name: "Статус" })).toBeInTheDocument()
    expect(dialog.getByRole("button", { name: "Сбросить" })).toBeInTheDocument()

    await user.click(dialog.getByText("Черновик"))
    // Черновик: до «Применить» ничего не применено.
    expect(onValueChange).not.toHaveBeenCalled()
    await user.click(dialog.getByRole("button", { name: "Применить: 1" }))
    expect(onValueChange).toHaveBeenCalledWith(["b"])
    await vi.waitFor(() => expect(sheet()).toBeNull())
  })

  it("крестик на триггере сбрасывает, не открывая шторы", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <FilterSelect
        label="Статус"
        options={OPTIONS}
        defaultValue={["a"]}
        onValueChange={onValueChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Сбросить фильтр" }))
    expect(onValueChange).toHaveBeenCalledWith([])
    expect(sheet()).toBeNull()
  })

  it("FilterRange: поля и «Применить: N»; ошибка диапазона не даёт применить", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterRange label="Сумма" amount onValueChange={onValueChange} />)
    await user.click(screen.getByText("Сумма"))
    const dialog = within(sheet()!)
    await user.type(dialog.getByLabelText("От"), "500")
    await user.type(dialog.getByLabelText("До"), "100")
    await user.click(dialog.getByRole("button", { name: "Применить: 2" }))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(
      dialog.getByText("Значение «до» должно быть больше значения «от»")
    ).toBeInTheDocument()
  })

  it("FilterDate: штора с календарём и кнопками", async () => {
    const user = userEvent.setup()
    render(<FilterDate label="Период" />)
    await user.click(screen.getByText("Период"))
    const dialog = within(sheet()!)
    expect(
      sheet()!.querySelector('[data-slot="filter-date-calendar"]')
    ).not.toBeNull()
    expect(dialog.getByRole("button", { name: "Применить" })).toBeInTheDocument()
  })
})
