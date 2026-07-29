import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Card } from "./card"

describe("Card", () => {
  it("renders title, subtitle, and value", () => {
    render(<Card title="Основная карта" subtitle="**** 1234" value="12 500 ₽" />)

    expect(screen.getByText("Основная карта")).toBeInTheDocument()
    expect(screen.getByText("**** 1234")).toBeInTheDocument()
    expect(screen.getByText("12 500 ₽")).toBeInTheDocument()
  })

  it("is not a button when there is no onClick", () => {
    render(<Card title="Основная карта" />)
    expect(screen.queryByRole("button", { name: "Основная карта" })).not.toBeInTheDocument()
  })

  it("becomes a clickable button when onClick is provided", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card title="Основная карта" onClick={onClick} />)

    await user.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("activates via keyboard (Enter) when clickable", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card title="Основная карта" onClick={onClick} />)

    const card = screen.getByRole("button")
    card.focus()
    await user.keyboard("{Enter}")

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders the menu when menuItems are given and calls onSelect", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Card
        title="Основная карта"
        menuItems={[{ text: "Удалить", onSelect }]}
      />
    )

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    await user.click(await screen.findByText("Удалить"))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
