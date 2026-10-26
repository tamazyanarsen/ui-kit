import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"
import { Input } from "@/components/ui/input"

import {
  FilterBar,
  FilterBoolean,
  FilterRange,
  FilterSelect,
  FilterSingleSelect,
} from "."

// Правки UI-Kit от 25.10, «Ряд фильтров — нет мобильного режима „кнопка
// Фильтры + штора“».

const STATUS = [
  { value: "a", label: "Исполнен" },
  { value: "b", label: "Черновик" },
]

function Bar({
  onStatus = () => {},
  onAmount = () => {},
  onTerm = () => {},
  defaultStatus = [] as string[],
}: {
  onStatus?: (value: string[]) => void
  onAmount?: (value: { from: string; to: string }) => void
  onTerm?: (value: string | null) => void
  defaultStatus?: string[]
}) {
  return (
    <FilterBar search={<Input variant="filter-search" size="sm" placeholder="Поиск" />}>
      <FilterSelect
        label="Статус"
        options={STATUS}
        defaultValue={defaultStatus}
        onValueChange={onStatus}
      />
      <FilterRange label="Сумма" amount onValueChange={onAmount} />
      <FilterSingleSelect
        label="Срок"
        options={[
          { value: "7", label: "Неделя" },
          { value: "30", label: "Месяц" },
        ]}
        onValueChange={onTerm}
      />
      <FilterBoolean label="Ненулевой баланс" defaultValue />
    </FilterBar>
  )
}

const sheet = () =>
  document.querySelector('[data-slot="filter-bar-sheet"]') as HTMLElement | null

describe("FilterBar", () => {
  it("десктоп — поиск и фильтры в ряд, кнопки «Фильтры» нет", () => {
    render(
      <ViewportScope viewport="desktop">
        <Bar />
      </ViewportScope>
    )
    expect(document.querySelectorAll('[data-slot="filter"]')).toHaveLength(3)
    expect(screen.getByRole("button", { name: "Ненулевой баланс" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Фильтры" })).toBeNull()
    expect(screen.getByPlaceholderText("Поиск")).toBeInTheDocument()
  })

  it("мобильный вид — поиск над кнопкой «Фильтры», счётчик активных", () => {
    render(<Bar defaultStatus={["a"]} />)
    expect(document.querySelectorAll('[data-slot="filter"]')).toHaveLength(0)
    const button = screen.getByRole("button", { name: "Фильтры" })
    const search = screen.getByPlaceholderText("Поиск")
    expect(
      search.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    // Активны «Статус» и включённый флаг.
    const badge = button.parentElement!.querySelector('[data-slot="badge"]')
    expect(badge).toHaveTextContent("2")
  })

  it("нет активных — нет счётчика", () => {
    render(
      <FilterBar>
        <FilterSelect label="Статус" options={STATUS} />
      </FilterBar>
    )
    const button = screen.getByRole("button", { name: "Фильтры" })
    expect(button.parentElement!.querySelector('[data-slot="badge"]')).toBeNull()
  })

  it("штора: поля фильтров, черновик до «Применить»", async () => {
    const user = userEvent.setup()
    const onStatus = vi.fn()
    const onTerm = vi.fn()
    render(<Bar onStatus={onStatus} onTerm={onTerm} />)
    await user.click(screen.getByRole("button", { name: "Фильтры" }))
    const dialog = within(sheet()!)
    expect(dialog.getByRole("heading", { name: "Фильтры" })).toBeInTheDocument()
    expect(dialog.getByRole("group", { name: "Статус" })).toBeInTheDocument()
    expect(dialog.getByRole("group", { name: "Срок" })).toBeInTheDocument()
    expect(dialog.getByLabelText("Сумма от")).toBeInTheDocument()
    expect(dialog.getByLabelText("Сумма до")).toBeInTheDocument()
    expect(dialog.getByRole("checkbox", { name: "Ненулевой баланс" })).toBeChecked()

    await user.click(dialog.getByRole("button", { name: "Черновик" }))
    await user.click(dialog.getByRole("button", { name: "Месяц" }))
    expect(onStatus).not.toHaveBeenCalled()
    expect(onTerm).not.toHaveBeenCalled()

    await user.click(dialog.getByRole("button", { name: "Применить" }))
    expect(onStatus).toHaveBeenCalledWith(["b"])
    expect(onTerm).toHaveBeenCalledWith("30")
    await vi.waitFor(() => expect(sheet()).toBeNull())
    const badge = screen
      .getByRole("button", { name: "Фильтры" })
      .parentElement!.querySelector('[data-slot="badge"]')
    expect(badge).toHaveTextContent("3")
  })

  it("ошибка диапазона — «Применить» не применяет ни одного поля", async () => {
    const user = userEvent.setup()
    const onStatus = vi.fn()
    const onAmount = vi.fn()
    render(<Bar onStatus={onStatus} onAmount={onAmount} />)
    await user.click(screen.getByRole("button", { name: "Фильтры" }))
    const dialog = within(sheet()!)
    await user.click(dialog.getByRole("button", { name: "Черновик" }))
    await user.type(dialog.getByLabelText("Сумма от"), "20000")
    await user.type(dialog.getByLabelText("Сумма до"), "1000")
    await user.click(dialog.getByRole("button", { name: "Применить" }))
    expect(onStatus).not.toHaveBeenCalled()
    expect(onAmount).not.toHaveBeenCalled()
    expect(
      dialog.getByText("Значение «до» должно быть больше значения «от»")
    ).toBeInTheDocument()
    expect(sheet()).not.toBeNull()
  })

  it("«Сбросить» снимает все фильтры и закрывает", async () => {
    const user = userEvent.setup()
    const onStatus = vi.fn()
    render(<Bar defaultStatus={["a"]} onStatus={onStatus} />)
    await user.click(screen.getByRole("button", { name: "Фильтры" }))
    await user.click(within(sheet()!).getByRole("button", { name: "Сбросить" }))
    expect(onStatus).toHaveBeenCalledWith([])
    await vi.waitFor(() => expect(sheet()).toBeNull())
    expect(
      screen
        .getByRole("button", { name: "Фильтры" })
        .parentElement!.querySelector('[data-slot="badge"]')
    ).toBeNull()
  })

  it("смена формы не теряет выбранное у неуправляемых фильтров", () => {
    function Switcher() {
      const [viewport, setViewport] = React.useState<"desktop" | "mobile">("desktop")
      return (
        <>
          <button type="button" onClick={() => setViewport("mobile")}>
            mobile
          </button>
          <ViewportScope viewport={viewport}>
            <FilterBar>
              <FilterSelect label="Статус" options={STATUS} defaultValue={["b"]} />
            </FilterBar>
          </ViewportScope>
        </>
      )
    }
    render(<Switcher />)
    expect(screen.getByText("Черновик")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "mobile" }))
    expect(
      screen
        .getByRole("button", { name: "Фильтры" })
        .parentElement!.querySelector('[data-slot="badge"]')
    ).toHaveTextContent("1")
  })
})
