import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Switcher } from "./switcher"

const ITEMS = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "done", label: "Завершённые" },
]

describe("Switcher", () => {
  it("defaults to the first item as active", () => {
    render(<Switcher items={ITEMS} />)
    expect(screen.getByRole("button", { name: "Все" })).toHaveAttribute("data-active", "true")
  })

  it("selects an item on click and calls onValueChange", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Switcher items={ITEMS} onValueChange={onValueChange} />)

    await user.click(screen.getByRole("button", { name: "Активные" }))

    expect(onValueChange).toHaveBeenCalledWith("active")
    expect(screen.getByRole("button", { name: "Активные" })).toHaveAttribute(
      "data-active",
      "true"
    )
  })

  it("stays controlled by the value prop", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Switcher items={ITEMS} value="all" onValueChange={onValueChange} />)

    await user.click(screen.getByRole("button", { name: "Завершённые" }))

    expect(onValueChange).toHaveBeenCalledWith("done")
    expect(screen.getByRole("button", { name: "Все" })).toHaveAttribute("data-active", "true")
  })

  it("renders a badge count on an item", () => {
    render(
      <Switcher items={[{ value: "all", label: "Все", badge: 4 }]} />
    )
    // Всегда отрисованная закадровая копия для замеров (см.
    // useOverflowCount) дублирует каждый пункт вместе со значком, поэтому
    // здесь законно отрисовывается дважды.
    expect(screen.getAllByText("4").length).toBeGreaterThan(0)
  })

  it("disables every segment when the whole switcher is disabled", () => {
    render(<Switcher items={ITEMS} disabled />)
    for (const item of ITEMS) {
      expect(screen.getByRole("button", { name: item.label })).toBeDisabled()
    }
  })

  it("does not select a disabled item", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Switcher
        items={[
          { value: "all", label: "Все" },
          { value: "active", label: "Активные", disabled: true },
        ]}
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Активные" }))

    expect(onValueChange).not.toHaveBeenCalled()
  })

  // Регрессия: при `disabled` и ненайденном активном сегменте бегунок
  // перерисовывал ряд без конца («Maximum update depth exceeded»).
  it("renders disabled with an unknown value without a render loop", () => {
    expect(() => render(<Switcher disabled value="zzz" items={ITEMS} />)).not.toThrow()
    expect(() => render(<Switcher disabled items={[]} />)).not.toThrow()
  })
})
