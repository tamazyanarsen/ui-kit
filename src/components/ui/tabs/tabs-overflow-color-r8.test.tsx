import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Аудит 7: активная вкладка ушла в «Ещё» — подчёркивание переезжало на
// многоточие, а сам значок оставался серым `--tabs-fg`, хотя подпись
// активной вкладки в ряду рисуется `--tabs-fg-active` (у Switcher это
// исправили в r7b, у Tabs — нет).

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
]

/** Лента 300: вкладка 100, зазор 24, резерв «…» 40 — видны две. */
function mockRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "tabs" ? 300 : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.slot === "tabs-item" ? 100 : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
}

const trigger = () => screen.getByRole("button", { name: "Ещё" })

describe("Tabs: цвет «…» при спрятанной активной вкладке", () => {
  afterEach(() => vi.restoreAllMocks())

  it("многоточие берёт цвет активной подписи", () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="c" showMore={false} />)
    expect(trigger()).toHaveClass("text-[var(--tabs-fg-active)]")
    expect(trigger()).not.toHaveClass("text-[var(--tabs-fg)]")
  })

  it("пока активная вкладка в ряду, многоточие серое", () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="a" showMore={false} />)
    expect(trigger()).toHaveClass("text-[var(--tabs-fg)]")
    expect(trigger()).not.toHaveClass("text-[var(--tabs-fg-active)]")
  })
})
