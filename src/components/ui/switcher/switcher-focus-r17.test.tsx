import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Switcher } from "./switcher"

// Аудит 16: если при сфокусированном «…» прятать становилось нечего, триггер
// снимался вместе с меню, и фокус падал на body.

const ABCD = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
]

const inCopy = (el: Element) => el.closest('[aria-hidden="true"]') !== null

/** Корень 300, сегмент 100 — с резервом «…» видны два. */
function mockRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "switcher" ? 300 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.slot === "switcher-item" && inCopy(this) ? 100 : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
}

describe("Switcher: «Ещё» снялось с фокусом внутри", () => {
  afterEach(() => vi.restoreAllMocks())

  it("фокус переходит на активный сегмент, а не на body", () => {
    mockRow()
    const { rerender } = render(<Switcher items={ABCD} defaultValue="b" />)
    const trigger = screen.getByRole("button", { name: "Ещё" })
    trigger.focus()
    expect(trigger).toHaveFocus()

    rerender(<Switcher items={ABCD.slice(0, 2)} defaultValue="b" />)
    expect(screen.queryByRole("button", { name: "Ещё" })).toBeNull()
    expect(document.activeElement).not.toBe(document.body)
    expect(screen.getByRole("button", { name: "B" })).toHaveFocus()
  })

  it("фокус вне «Ещё» не перехватывается", () => {
    mockRow()
    const { rerender } = render(<Switcher items={ABCD} defaultValue="b" />)
    const a = screen.getByRole("button", { name: "A" })
    a.focus()
    rerender(<Switcher items={ABCD.slice(0, 2)} defaultValue="b" />)
    expect(a).toHaveFocus()
  })
})
