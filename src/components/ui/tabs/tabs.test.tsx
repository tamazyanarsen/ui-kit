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
    expect(screen.getByRole("tab", { name: "Все" })).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("switches the active tab on click (uncontrolled)", async () => {
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} />)

    await user.click(screen.getByRole("tab", { name: "Открытые" }))

    expect(screen.getByRole("tab", { name: "Открытые" })).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("calls onValueChange and stays controlled by value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Tabs items={ITEMS} value="all" onValueChange={onValueChange} />)

    await user.click(screen.getByRole("tab", { name: "Открытые" }))

    expect(onValueChange).toHaveBeenCalledWith("open")
    expect(screen.getByRole("tab", { name: "Все" })).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("does not activate a disabled tab", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Tabs items={ITEMS} onValueChange={onValueChange} />)

    await user.click(screen.getByRole("tab", { name: "Закрытые" }))

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

  it("объявляет ленту как tablist и выбранную вкладку через aria-selected", () => {
    render(<Tabs items={ITEMS} defaultValue="open" />)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Открытые" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByRole("tab", { name: "Все" })).toHaveAttribute(
      "aria-selected",
      "false"
    )
  })

  it("переключается стрелками, пропуская выключенные, и держит в Tab одну вкладку", async () => {
    const user = userEvent.setup()
    render(<Tabs items={ITEMS} />)
    await user.tab()
    expect(screen.getByRole("tab", { name: "Все" })).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    const open = screen.getByRole("tab", { name: "Открытые" })
    expect(open).toHaveFocus()
    expect(open).toHaveAttribute("aria-selected", "true")

    // «Закрытые» выключена — стрелка вправо уходит по кругу на первую.
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Все" })).toHaveFocus()

    await user.keyboard("{End}")
    expect(open).toHaveFocus()
  })

  it("выбирает первую вкладку, когда пункты приходят после пустого списка", () => {
    const { rerender } = render(<Tabs items={[]} />)
    rerender(<Tabs items={ITEMS} />)
    expect(screen.getByRole("tab", { name: "Все" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("откатывается на доступную вкладку, когда активную удалили", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Tabs items={ITEMS} />)
    await user.click(screen.getByRole("tab", { name: "Открытые" }))
    rerender(<Tabs items={ITEMS.filter((item) => item.value !== "open")} />)
    expect(screen.getByRole("tab", { name: "Все" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })
})
