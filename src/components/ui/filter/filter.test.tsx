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
    await user.click(screen.getByRole("button", { name: "Применить" }))

    expect(onValueChange).toHaveBeenCalledWith("Оплачен")
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
