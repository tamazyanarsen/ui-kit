import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

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

describe("Header: активный раздел в «Ещё»", () => {
  afterEach(() => vi.restoreAllMocks())

  // Аудит r6: текущий раздел, ушедший в «Ещё», в списке никак не отмечался —
  // ни галочкой (как в меню сотрудника), ни `aria-current`. Пользователь не
  // видел, где находится.
  it("строка текущего раздела отмечена галочкой и aria-current", async () => {
    // Видны 2 пункта (см. nav-row-r3.test), «d» уходит в «Ещё».
    mockNavRow(500)
    const user = userEvent.setup()
    render(
      <Header type="client" navItems={ITEMS} activeSection="d" organizations={ORG_ONE} />
    )
    await user.click(screen.getByRole("button", { name: /Ещё/ }))
    const active = await screen.findByRole("menuitem", { name: /Раздел d/ })
    expect(active.getAttribute("aria-current")).toBe("page")
    expect(active.querySelector('[data-slot="header-nav-overflow-check"]')).not.toBeNull()

    const other = screen.getByRole("menuitem", { name: /Раздел e/ })
    expect(other.getAttribute("aria-current")).toBeNull()
    expect(other.querySelector('[data-slot="header-nav-overflow-check"]')).toBeNull()
  })
})

describe("Header: подсказка пустого избранного", () => {
  // Аудит r6: подсказка стояла `whitespace-nowrap` без обрезки и на узкой
  // шапке вылезала за ряд — под колокольчик и в горизонтальную прокрутку
  // страницы. Раскладку jsdom не считает, поэтому проверяется контракт
  // классов; вживую сверено в Chrome на 1024 и 1280.
  it("обрезает себя, а не вылезает за ряд", () => {
    render(
      <Header
        type="client"
        menuGroups={[]}
        favourites={[]}
        onFavouritesChange={() => {}}
        organizations={ORG_ONE}
      />
    )
    const hint = document.querySelector('[data-slot="header-nav-empty-hint"]')
    expect(hint).not.toBeNull()
    // Строка режется ОДНИМ блоком: у двух сжимаемых кусков многоточие
    // появлялось и посреди фразы («…и нажмит… ☆ справа, чтобы доб…»).
    expect(hint!.className).toMatch(/\btruncate\b/)
    expect(hint!.className).toMatch(/\bmin-w-0\b/)
    expect(hint!.className.split(/\s+/)).not.toContain("flex")
    expect(hint!.querySelector('[class*="truncate"]')).toBeNull()
    // Звезда — строчный элемент в потоке текста, а не флекс-обёртка.
    const star = hint!.querySelector("svg")
    expect(star?.parentElement).toBe(hint)
    expect(star!.getAttribute("class")).toMatch(/\binline-block\b/)
  })
})
