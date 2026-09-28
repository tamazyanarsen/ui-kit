import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Switcher } from "./switcher"

// Проверка правок r7: многоточие со спрятанным активным сегментом получало
// заливку бегунка, но цвет значка оставался серым — на чёрной заливке «…»
// почти не читалось. А счётчик спрятанного сегмента в «Ещё» рисовался как у
// вкладки Tabs (чёрный, «выключенный»), а не как в ряду (светло-серый).

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C", badge: 12 },
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

describe("Switcher: «Ещё» со спрятанным активным сегментом", () => {
  afterEach(() => vi.restoreAllMocks())

  it("чёрный вариант: многоточие получает цвет активного сегмента", () => {
    mockRow()
    render(<Switcher items={ITEMS} defaultValue="c" activeVariant="black" />)
    const trigger = screen.getByRole("button", { name: "Ещё" })
    expect(trigger.className).toContain("text-[var(--switcher-active-black-fg)]")
    expect(trigger.className).not.toContain("text-[var(--switcher-fg-inactive)]")
  })

  it("обычный вариант: многоточие получает цвет активного сегмента", () => {
    mockRow()
    render(<Switcher items={ITEMS} defaultValue="c" />)
    const trigger = screen.getByRole("button", { name: "Ещё" })
    expect(trigger.className).toContain("text-[var(--switcher-fg)]")
    expect(trigger.className).not.toContain("text-[var(--switcher-fg-inactive)]")
  })

  it("счётчик спрятанного сегмента — как в ряду: светло-серый и включённый", async () => {
    mockRow()
    render(<Switcher items={ITEMS} defaultValue="a" />)
    fireEvent.click(screen.getByRole("button", { name: "Ещё" }))
    const [c] = await screen.findAllByRole("menuitem")
    expect(c.querySelector('[data-slot="badge"][data-type="counter"]')).toHaveStyle({
      backgroundColor: "var(--badge-light-grey-bg)",
    })
  })
})
