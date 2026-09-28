import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Покрытие правки «стрелки считаются от вкладки в фокусе». Раньше отсчёт
// шёл от активной вкладки: если фокус стоял на другой (её сфокусировали
// кликом с отменённым выбором, программно или вспомогательной технологией),
// стрелка прыгала к соседке активной, а не к соседке той, что в фокусе.

const FOUR = ["a", "b", "c", "d"].map((value) => ({ value, label: `Tab ${value}` }))

describe("Tabs: стрелки от вкладки в фокусе", () => {
  it("→ с неактивной вкладки ведёт к её соседке, а не к соседке активной", () => {
    const onValueChange = vi.fn()
    render(<Tabs items={FOUR} value="a" onValueChange={onValueChange} showMore={false} />)

    const focused = screen.getByRole("tab", { name: "Tab c" })
    focused.focus()
    fireEvent.keyDown(focused, { key: "ArrowRight" })

    expect(onValueChange).toHaveBeenLastCalledWith("d")
    expect(screen.getByRole("tab", { name: "Tab d" })).toHaveFocus()
  })

  it("← с неактивной вкладки ведёт к её соседке слева", () => {
    const onValueChange = vi.fn()
    render(<Tabs items={FOUR} value="a" onValueChange={onValueChange} showMore={false} />)

    const focused = screen.getByRole("tab", { name: "Tab d" })
    focused.focus()
    fireEvent.keyDown(focused, { key: "ArrowLeft" })

    expect(onValueChange).toHaveBeenLastCalledWith("c")
    expect(screen.getByRole("tab", { name: "Tab c" })).toHaveFocus()
  })
})
