import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Filter } from "./filter"

describe("Filter", () => {
  it("renders the label", () => {
    render(<Filter label="Статус" />)
    expect(screen.getByText("Статус")).toBeInTheDocument()
  })

  it("opens the popup on click, showing the value input", async () => {
    const user = userEvent.setup()
    render(<Filter label="Статус" placeholder="Введите статус" />)

    expect(screen.queryByPlaceholderText("Введите статус")).not.toBeInTheDocument()

    await user.click(screen.getByText("Статус"))

    expect(await screen.findByPlaceholderText("Введите статус")).toBeInTheDocument()
  })

  it("applies a typed value and calls onValueChange", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Filter label="Статус" onValueChange={onValueChange} />)

    await user.click(screen.getByText("Статус"))
    await user.type(await screen.findByRole("textbox"), "Оплачен")
    // "Если выбранно несколько значений, то пишем количество в кнопке –
    // «Применить: 1»" (Фильтрация (ЕЛК), node 70295:22605).
    await user.click(screen.getByRole("button", { name: "Применить: 1" }))

    expect(onValueChange).toHaveBeenCalledWith("Оплачен")
  })

  it("labels Apply without a count while nothing is entered", async () => {
    const user = userEvent.setup()
    render(<Filter label="Статус" />)

    await user.click(screen.getByText("Статус"))

    // "Кнопки в фильтрах не блокируются. Если нет выбранных значений —
    // кнопки сброса и применения фильтра в любом случае доступны."
    const apply = await screen.findByRole("button", { name: "Применить" })
    expect(apply).toBeEnabled()
    expect(screen.getByRole("button", { name: "Сбросить" })).toBeEnabled()
  })

  it("closes on Сбросить and returns the value to its initial state", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Filter label="Статус" defaultValue="Оплачен" onValueChange={onValueChange} />
    )

    // A plain (non-chip) filter keeps showing its label, not the value.
    await user.click(screen.getByText("Статус"))
    await user.click(await screen.findByRole("button", { name: "Сбросить" }))

    // "При нажатии на кнопку «Сбросить» фильтр закрывается."
    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("shows a clear (X) button once it has a value, and clears without reopening", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Filter label="Статус" defaultValue="Оплачен" onValueChange={onValueChange} />)

    await user.click(screen.getByRole("button", { name: "Сбросить фильтр" }))

    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
  })

  it("renders the applied value as a dark chip when chip is set", () => {
    render(<Filter label="Статус" defaultValue="Оплачен" chip />)
    expect(screen.getByText("Оплачен")).toBeInTheDocument()
    expect(screen.queryByText("Статус")).not.toBeInTheDocument()
  })

  it("shows a count badge when count is given", () => {
    render(<Filter label="Статус" count={3} />)
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("does not open when disabled", async () => {
    const user = userEvent.setup()
    render(<Filter label="Статус" disabled placeholder="Введите статус" />)

    await user.click(screen.getByText("Статус"))

    expect(screen.queryByPlaceholderText("Введите статус")).not.toBeInTheDocument()
  })
})
