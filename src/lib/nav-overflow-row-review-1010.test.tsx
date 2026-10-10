import "@/test/desktop-viewport"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { EmployeeMenuNav } from "@/components/ui/employee-menu/employee-menu-nav"
import { NavRow } from "@/components/ui/header/nav-row"

// Ревью 10.10, КК-2: два ряда навигации с «Ещё» были копиями и разошлись.
// Перехват фокуса при исчезновении «Ещё» был только у шапки клиента, пол
// ширины — только у шапки сотрудника. Теперь оба ряда на общем модуле.

let rowWidth = 500

/** Мерная зона — `rowWidth`, каждый пункт мерной копии — 120. */
function mockRow(measureSlot: string) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.querySelector(`:scope > [aria-hidden="true"] > [data-slot="${measureSlot}"]`)
      ? rowWidth
      : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.value && this.closest(`[data-slot="${measureSlot}"]`) ? 120 : 0
    return { width: w, height: 24, top: 0, left: 0, right: w, bottom: 24 } as DOMRect
  })
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    () => [{}] as unknown as DOMRectList
  )
}

const LINKS = ["a", "b", "c", "d", "e"].map((value) => ({ value, label: `Раздел ${value}` }))

beforeEach(() => {
  rowWidth = 500
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe("EmployeeMenuNav: фокус не теряется, когда «Ещё» исчезает (ревью 10.10, КК-2)", () => {
  it("фокус переходит на активный раздел, а не на body", async () => {
    mockRow("employee-menu-nav-measure")
    const user = userEvent.setup()
    render(<EmployeeMenuNav links={LINKS} activeLink="b" />)
    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    const item = await screen.findByRole("menuitem", { name: /Раздел d/ })
    act(() => item.focus())
    expect(item).toHaveFocus()

    rowWidth = 2400
    act(() => void window.dispatchEvent(new Event("resize")))

    expect(screen.queryByRole("button", { name: /Ещё/ })).toBeNull()
    expect(screen.getByRole("button", { name: "Раздел b" })).toHaveFocus()
  })
})

describe("NavRow (шапка клиента): пол ширины при переполнении (ревью 10.10, КК-2)", () => {
  const props = {
    items: LINKS,
    menuOpen: false,
    onMenuOpenChange: () => {},
    createOpen: false,
    onCreateOpenChange: () => {},
    showCreate: false,
    favouritesEnabled: true,
  }

  it("пока есть «Ещё», ряду гарантирован пункт и «Ещё»", () => {
    mockRow("header-nav-measure")
    rowWidth = 15
    const { container } = render(<NavRow {...props} />)
    const row = container.querySelector<HTMLElement>(
      ':scope [data-slot="header-nav-row"] [style*="--nav-min-width"]'
    )
    expect(row?.style.getPropertyValue("--nav-min-width")).toBe("208px")
  })

  it("когда всё помещается, пола нет", () => {
    mockRow("header-nav-measure")
    rowWidth = 2400
    const { container } = render(<NavRow {...props} />)
    expect(container.querySelector('[style*="--nav-min-width"]')).toBeNull()
  })
})
