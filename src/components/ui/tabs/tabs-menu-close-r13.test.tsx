import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Аудит 12: при `showMore` триггер «…» не размонтируется, когда прятать
// стало нечего, — он только выключается. Открытое меню от этого не
// закрывалось и висело пустым попапом под выключенной кнопкой.

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

describe("Tabs: меню «…» закрывается, когда прятать стало нечего", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    rowWidth = 300
  })

  it("открыть «…», расширить ряд — меню закрыто", async () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="a" />)
    fireEvent.click(screen.getByRole("button", { name: "Ещё" }))
    expect(await screen.findAllByRole("menuitem")).not.toHaveLength(0)

    rowWidth = 2000
    act(() => void window.dispatchEvent(new Event("resize")))

    expect(screen.getAllByRole("tab")).toHaveLength(5)
    expect(screen.queryByRole("menu")).toBeNull()
  })
})
