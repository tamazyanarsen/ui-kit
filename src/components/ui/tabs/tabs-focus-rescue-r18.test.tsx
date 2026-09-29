import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Аудит 17: если ряд расширялся, пока фокус стоял в открытом «…», меню
// закрывалось, а триггер выключался (`showMore`) или снимался — фокус падал
// на body. «Сторож» фокуса из r17 был подключён только у Switcher.

const ITEMS = ["a", "b", "c", "d", "e"].map((v) => ({ value: v, label: v.toUpperCase() }))

let rowWidth = 300

function mockRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "tabs" ? rowWidth : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.slot === "tabs-item" ? 100 : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
}

async function openAndFocusItem() {
  fireEvent.click(screen.getByRole("button", { name: "Ещё" }))
  const [item] = await screen.findAllByRole("menuitem")
  act(() => item.focus())
  expect(item).toHaveFocus()
}

function widen() {
  rowWidth = 2000
  act(() => void window.dispatchEvent(new Event("resize")))
}

describe("Tabs: ряд расширился, пока фокус в «…»", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    rowWidth = 300
  })

  it("showMore — фокус на активной вкладке, а не на body", async () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="b" />)
    await openAndFocusItem()
    widen()
    expect(document.activeElement).not.toBe(document.body)
    expect(screen.getByRole("tab", { name: "B" })).toHaveFocus()
  })

  it("без showMore — «…» снимается, фокус на активной вкладке", async () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="b" showMore={false} />)
    await openAndFocusItem()
    widen()
    expect(screen.queryByRole("button", { name: "Ещё" })).toBeNull()
    expect(screen.getByRole("tab", { name: "B" })).toHaveFocus()
  })

  it("фокус вне «…» не перехватывается", () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="b" />)
    const a = screen.getByRole("tab", { name: "A" })
    act(() => a.focus())
    widen()
    expect(a).toHaveFocus()
  })
})
