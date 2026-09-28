import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Pagination } from "./pagination"

// Аудит 7, сжатый режим пагинатора:
// 1) ширина полного ряда запоминалась для 20 страниц, и после отбора до 5
//    страниц режим не выключался — «1 2 … 5» вместо помещающегося ряда;
// 2) многоточие заменяло ровно одну страницу («1 … 3» без второй).

/** Полоса шириной `width`; ширина ряда — по 40 на ячейку (стрелки тоже). */
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

const ellipses = () => document.querySelectorAll('[data-slot="pagination-ellipsis"]').length

describe("Pagination: сжатый режим, круг r8", () => {
  afterEach(() => vi.restoreAllMocks())

  it("страниц стало меньше — ряд перемеряется и показывается целиком", () => {
    // 20 страниц: 2 стрелки + 7 ячеек = 360 > 300 — сжатый.
    // 5 страниц: 2 стрелки + 5 ячеек = 280 ≤ 300 — помещается.
    mockStrip(300)
    const { rerender } = render(<Pagination page={3} totalPages={20} />)
    expect(document.querySelector('[data-slot="pagination"]')).toHaveAttribute("data-compact")
    rerender(<Pagination page={3} totalPages={5} />)
    expect(pageNumbers()).toEqual(["1", "2", "3", "4", "5"])
    expect(ellipses()).toBe(0)
    expect(document.querySelector('[data-slot="pagination"]')).not.toHaveAttribute("data-compact")
  })

  it("одна пропущенная страница показывается номером, а не многоточием", () => {
    mockStrip(300)
    const { rerender } = render(<Pagination page={3} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "2", "3", "20"])
    expect(ellipses()).toBe(1)
    rerender(<Pagination page={18} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "18", "19", "20"])
    expect(ellipses()).toBe(1)
  })
})
