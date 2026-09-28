import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Switcher } from "./switcher"

// Аудит r7: сегмент, ушедший в «Ещё», терял признак активности, счётчик и
// точку статуса: в ряду ни один сегмент не был нажат, бегунок гас, а в
// списке стояла голая подпись.

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C", badge: 12 },
  { value: "d", label: "D", status: true },
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

describe("Switcher: спрятанный сегмент несёт своё состояние в «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("активный отмечен галочкой и aria-current, многоточие выделено", async () => {
    mockRow()
    render(<Switcher items={ITEMS} defaultValue="c" />)
    const trigger = screen.getByRole("button", { name: "Ещё" })
    expect(trigger).toHaveAttribute("data-active")
    fireEvent.click(trigger)

    const items = await screen.findAllByRole("menuitem")
    expect(items.map((item) => item.textContent?.[0])).toEqual(["C", "D"])
    const [c, d] = items
    expect(c).toHaveAttribute("aria-current", "true")
    expect(c.querySelector('[data-slot="overflow-item-check"]')).not.toBeNull()
    expect(c.querySelector('[data-slot="badge"][data-type="counter"]')).toHaveTextContent("12")
    expect(d.querySelector('[data-slot="badge"][data-type="point"]')).not.toBeNull()
  })

  it("пока активный сегмент в ряду, многоточие не выделено", () => {
    mockRow()
    render(<Switcher items={ITEMS} defaultValue="a" />)
    expect(screen.getByRole("button", { name: "Ещё" })).not.toHaveAttribute("data-active")
  })
})
