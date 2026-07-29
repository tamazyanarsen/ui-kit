import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tabs } from "./tabs"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "open", label: "Открытые" },
  { value: "closed", label: "Закрытые", disabled: true },
]

describe("Tabs", () => {
  it("renders every item and activates the first by default", () => {
    render(<Tabs items={ITEMS} />)
    expect(screen.getAllByRole("button", { name: "Все" })[0]).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("switches the active tab on click (uncontrolled)", async () => {
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} />)

    await user.click(screen.getAllByRole("button", { name: "Открытые" })[0])

    expect(screen.getAllByRole("button", { name: "Открытые" })[0]).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("calls onValueChange and stays controlled by value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Tabs items={ITEMS} value="all" onValueChange={onValueChange} />)

    await user.click(screen.getAllByRole("button", { name: "Открытые" })[0])

    expect(onValueChange).toHaveBeenCalledWith("open")
    expect(screen.getAllByRole("button", { name: "Все" })[0]).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("does not activate a disabled tab", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Tabs items={ITEMS} onValueChange={onValueChange} />)

    await user.click(screen.getAllByRole("button", { name: "Закрытые" })[0])

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("renders a numeric badge on an item", () => {
    render(<Tabs items={[{ value: "a", label: "Входящие", badge: 3 }]} />)
    expect(screen.getAllByText("3").length).toBeGreaterThan(0)
  })

  it("renders a status dot on an item", () => {
    const { container } = render(
      <Tabs items={[{ value: "a", label: "Ошибки", status: true }]} />
    )
    expect(container.querySelector('[data-type="point"]')).toBeInTheDocument()
  })
})
