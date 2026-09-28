import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Card } from "./card"

describe("Card: вложенное меню", () => {
  it("выбор пункта меню «…» не вызывает onClick карточки", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSelect = vi.fn()
    render(
      <Card
        title="Основная карта"
        onClick={onClick}
        menuItems={[{ text: "Переименовать", onSelect }]}
      />
    )

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    await user.click(await screen.findByText("Переименовать"))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("Enter на «…» открывает меню, а не нажимает карточку", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Card
        title="Основная карта"
        onClick={onClick}
        menuItems={[{ text: "Переименовать" }]}
      />
    )

    screen.getByRole("button", { name: "Ещё" }).focus()
    await user.keyboard("{Enter}")

    expect(onClick).not.toHaveBeenCalled()
    expect(await screen.findByText("Переименовать")).toBeInTheDocument()
  })
})
