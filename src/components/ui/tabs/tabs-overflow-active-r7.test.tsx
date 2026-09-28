import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Аудит r7: строка «Ещё» получала только подпись вкладки. Активная вкладка,
// ушедшая за многоточие, ничем не отмечалась ни в ряду (бегунок гаснет), ни
// в списке, а счётчик и точка статуса спрятанных вкладок пропадали.

const ITEMS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C", badge: 12 },
  { value: "d", label: "D", status: true },
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

describe("Tabs: спрятанная вкладка несёт своё состояние в «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("активная отмечена галочкой и aria-current, счётчик и статус на месте", async () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="c" showMore={false} />)
    expect(screen.getAllByRole("tab")).toHaveLength(2)

    const trigger = screen.getByRole("button", { name: "Ещё" })
    expect(trigger).toHaveAttribute("data-active")
    fireEvent.click(trigger)

    const items = await screen.findAllByRole("menuitem")
    const c = items.find((item) => item.textContent?.startsWith("C"))!
    const d = items.find((item) => item.textContent?.startsWith("D"))!
    expect(c).toHaveAttribute("aria-current", "true")
    expect(c.querySelector('[data-slot="overflow-item-check"]')).not.toBeNull()
    expect(c.querySelector('[data-slot="badge"][data-type="counter"]')).toHaveTextContent("12")
    expect(d).not.toHaveAttribute("aria-current")
    expect(d.querySelector('[data-slot="badge"][data-type="point"]')).not.toBeNull()
  })

  it("пока активная вкладка в ряду, многоточие не выделено", () => {
    mockRow()
    render(<Tabs items={ITEMS} defaultValue="a" showMore={false} />)
    expect(screen.getByRole("button", { name: "Ещё" })).not.toHaveAttribute("data-active")
  })
})
