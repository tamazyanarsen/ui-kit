import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Аудит 9: при `showMore` многоточие видно и тогда, когда прятать нечего, —
// кнопка выключена, но курсор-рука и подсветка подчёркивания при наведении
// оставались, как у живой.

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
]

describe("Tabs: выключенное «…» не выглядит живым", () => {
  it("без спрятанных вкладок у «…» нет руки и подсветки", () => {
    render(<Tabs items={ITEMS} defaultValue="a" />)
    const trigger = screen.getByRole("button", { name: "Ещё" })
    expect(trigger).toBeDisabled()
    const classes = trigger.className.split(/\s+/)
    expect(classes).not.toContain("cursor-pointer")
    expect(classes).toContain("cursor-default")
    expect(trigger.innerHTML).not.toContain("group-hover:")
  })
})
