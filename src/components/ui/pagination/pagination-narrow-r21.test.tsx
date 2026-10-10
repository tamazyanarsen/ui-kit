import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Pagination } from "./pagination"

// Аудит 20:
// 1) на телефоне 320 (полоса 256) не помещался даже сжатый ряд
//    «‹ 1 … т … N ›» — «Следующая страница» уходила за край;
// 2) ширина полного ряда запоминалась без текущей страницы: после визита на
//    6000-ю страница 5 оставалась сжатой, хотя полный ряд помещался.

/**
 * Полоса шириной `width`. Ширина ряда — сумма ячеек: 30 на многоточие и
 * номер, плюс по 10 на каждую цифру номера. Стрелок с v1.0.1 нет
 * (дизайн-чек от 08.10, №17).
 */
function mockStrip(width: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "pagination" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w =
      this.dataset.slot === "pagination-pages"
        ? Array.from(this.children).reduce(
            (sum, cell) => sum + 30 + (cell.textContent?.length ?? 0) * 10,
            0
          )
        : 0
    return { width: w, height: 36, top: 0, left: 0, right: w, bottom: 36 } as DOMRect
  })
}

const pageNumbers = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.dataset.slot === "pagination-page")
    .map((button) => button.textContent)

const root = () => document.querySelector('[data-slot="pagination"]')

describe("Pagination: самый узкий ряд и память ширины", () => {
  afterEach(() => vi.restoreAllMocks())

  it("не помещается и сжатый — остаются текущая и последняя страница", () => {
    // Сжатый «1 … 10 … 20» = 40+30+50+30+50 = 200 > 190.
    mockStrip(190)
    render(<Pagination page={10} totalPages={20} />)
    expect(pageNumbers()).toEqual(["10", "20"])
    expect(root()).toHaveAttribute("data-compact", "minimal")
  })

  it("на последней странице самый узкий ряд — первая и последняя", () => {
    // Сжатый «1 … 19 20» = 170 > 150.
    mockStrip(150)
    render(<Pagination page={20} totalPages={20} />)
    expect(pageNumbers()).toEqual(["1", "20"])
  })

  it("после дальней страницы ближняя снова показывает полный ряд", () => {
    // Страница 6000: полный ряд 380 > 340 — сжатый.
    // Страница 5: полный ряд «1 … 4 5 6 … 9999» = 290 ≤ 340 — целиком.
    mockStrip(340)
    const { rerender } = render(<Pagination page={6000} totalPages={9999} />)
    expect(root()).toHaveAttribute("data-compact")
    rerender(<Pagination page={5} totalPages={9999} />)
    expect(pageNumbers()).toEqual(["1", "4", "5", "6", "9999"])
    expect(root()).not.toHaveAttribute("data-compact")
  })
})
