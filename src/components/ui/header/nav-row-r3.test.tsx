import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Итоговая проверка №2: место под «Ещё» в нижнем ряду шапки было занижено
// (72 вместо 56 на пункт + 32 интервала), и впритык «Ещё» вылезал за ряд.

const ITEMS = ["a", "b", "c", "d", "e"].map((value) => ({ value, label: `Раздел ${value}` }))

/** Мерная зона ряда — `width`, каждый пункт копии — 120. */
function mockNavRow(width: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.querySelector(':scope > [aria-hidden="true"] > [data-slot="header-nav-measure"]')
      ? width
      : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.value && this.closest('[data-slot="header-nav-measure"]') ? 120 : 0
    return { width: w, height: 24, top: 0, left: 0, right: w, bottom: 24 } as DOMRect
  })
}

const visibleNavItems = () =>
  document.querySelectorAll('[data-slot="header-nav-item"]').length

describe("Header: место под «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("резерв включает сам пункт и интервал до него", () => {
    // 3 пункта: 3 × 120 + 2 × 32 = 424, с «Ещё» (88) — 512 > 500.
    mockNavRow(500)
    render(<Header type="client" navItems={ITEMS} organizations={ORG_ONE} />)
    expect(visibleNavItems()).toBe(2)
  })
})
