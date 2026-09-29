import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// r26: `items={[cond && {...}]}` кладёт в массив `false`, и лента падала на
// `item.value` (так же роняло и переключатель): пустые элементы отбрасываются.

describe("Tabs: пустые элементы в items", () => {
  it("false и null между вкладками пропускаются, а не роняют ленту", () => {
    const items = [
      { value: "a", label: "Платежи" },
      false,
      null,
      { value: "b", label: "Выписки" },
    ] as never
    render(<Tabs items={items} defaultValue="b" />)
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Платежи",
      "Выписки",
    ])
    expect(screen.getByRole("tab", { name: "Выписки" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("одни пустые элементы — пустая лента без ошибки", () => {
    render(<Tabs items={[null, false] as never} />)
    expect(screen.queryAllByRole("tab")).toHaveLength(0)
  })
})
