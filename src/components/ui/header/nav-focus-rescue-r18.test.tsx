import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Аудит 17: если ряд разделов расширялся, пока фокус стоял в открытом «Ещё»,
// «Ещё» размонтировалось вместе с фокусом, и он падал на body.

const ITEMS = ["a", "b", "c", "d", "e"].map((value) => ({ value, label: `Раздел ${value}` }))

let rowWidth = 500

/** Мерная зона ряда — `rowWidth`, каждый пункт копии — 120. */
function mockNavRow() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.querySelector(':scope > [aria-hidden="true"] > [data-slot="header-nav-measure"]')
      ? rowWidth
      : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.value && this.closest('[data-slot="header-nav-measure"]') ? 120 : 0
    return { width: w, height: 24, top: 0, left: 0, right: w, bottom: 24 } as DOMRect
  })
}

describe("Header: ряд разделов расширился, пока фокус в «Ещё»", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    rowWidth = 500
  })

  it("фокус переходит на активный раздел, а не на body", async () => {
    mockNavRow()
    const user = userEvent.setup()
    render(<Header type="client" navItems={ITEMS} activeSection="b" organizations={ORG_ONE} />)
    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    const item = await screen.findByRole("menuitem", { name: /Раздел d/ })
    act(() => item.focus())
    expect(item).toHaveFocus()

    rowWidth = 2400
    act(() => void window.dispatchEvent(new Event("resize")))

    expect(screen.queryByRole("button", { name: /Ещё/ })).toBeNull()
    expect(document.activeElement).not.toBe(document.body)
    expect(screen.getByRole("button", { name: "Раздел b" })).toHaveFocus()
  })
})
