import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Switcher } from "./switcher"

// Аудит 8: `disabled` на всём переключателе гасил только сегменты — «…»
// оставалась живой: подсвечивалась, открывала список из одних выключенных
// пунктов и при спрятанном активном горела заливкой бегунка.

const ITEMS = [
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

const trigger = () =>
  document.querySelector('[data-slot="switcher-overflow-trigger"]') as HTMLElement

describe("Switcher disabled: «Ещё» тоже выключена", () => {
  afterEach(() => vi.restoreAllMocks())

  it("многоточие выключено и не открывает список", () => {
    mockRow()
    render(<Switcher items={ITEMS} disabled />)
    const el = trigger()
    expect(el).toBeDisabled()
    expect(el.className).toContain("text-[var(--switcher-disabled-fg)]")
    expect(el.className).not.toContain("hover:bg-")
    expect(el.className).not.toContain("cursor-pointer")
    fireEvent.click(el)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("спрятанный активный не зажигает заливку на выключенном", () => {
    mockRow()
    render(<Switcher items={ITEMS} defaultValue="c" disabled />)
    const el = trigger()
    expect(el).not.toHaveAttribute("data-active")
    expect(el.className).toContain("text-[var(--switcher-disabled-fg)]")
  })
})
