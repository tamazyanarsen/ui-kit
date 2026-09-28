import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Pagination } from "./pagination"

// Аудит r7: ряд номеров не переносится и не сжимается — при totalPages=20
// на ширине 375 «Следующая страница» уходила за правый край на 45px.
// Узкая полоса теперь получает сжатый список «1 … текущая … последняя».

/** Полоса шириной `width`; ширина полного ряда — по 40 на каждую ячейку. */
function mockStrip(width: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "pagination" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const cells = this.dataset.slot === "pagination-pages" ? this.children.length : 0
    const w = cells * 40
    return { width: w, height: 36, top: 0, left: 0, right: w, bottom: 36 } as DOMRect
  })
}

const pageNumbers = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.dataset.slot === "pagination-page")
    .map((button) => button.textContent)

describe("Pagination: узкая полоса", () => {
  afterEach(() => vi.restoreAllMocks())

  it("полный ряд шире полосы — показывается «1 … текущая … последняя»", () => {
    // Полный ряд: 2 стрелки + 7 ячеек = 9 × 40 = 360 > 300.
    mockStrip(300)
    render(<Pagination page={10} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "10", "20"])
    expect(document.querySelectorAll('[data-slot="pagination-ellipsis"]')).toHaveLength(2)
    expect(screen.getByRole("button", { name: "10" })).toHaveAttribute("aria-current", "page")
  })

  it("на широкой полосе раскладка прежняя", () => {
    mockStrip(1200)
    render(<Pagination page={10} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "9", "10", "11", "20"])
  })

  it("у края — соседняя страница, без дублей", () => {
    mockStrip(300)
    const { rerender } = render(<Pagination page={1} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "2", "20"])
    rerender(<Pagination page={20} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "19", "20"])
  })
})
