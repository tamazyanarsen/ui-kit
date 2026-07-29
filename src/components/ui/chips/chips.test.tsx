import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Chips } from "./chips"

describe("Chips", () => {
  it("renders its content and optional subtitle", () => {
    render(<Chips subtitle="Подзаголовок">Значение</Chips>)
    expect(screen.getByText("Значение")).toBeInTheDocument()
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
  })

  it("renders a counter badge when count is given", () => {
    render(<Chips count={5}>Фильтры</Chips>)
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("renders a remove button when closable and calls onRemove", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <Chips closable onRemove={onRemove}>
        Значение
      </Chips>
    )

    await user.click(screen.getByRole("button", { name: "Удалить" }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it("omits the remove button when not closable", () => {
    render(<Chips>Значение</Chips>)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("disables the remove button when disabled", () => {
    render(
      <Chips closable disabled>
        Значение
      </Chips>
    )
    expect(screen.getByRole("button", { name: "Удалить" })).toBeDisabled()
  })
})
