import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Pagination } from "./pagination"

// Раунд 25. `totalPages = Math.ceil(count / size)` до прихода данных —
// NaN (или Infinity при нулевом размере), а `page` — NaN. Ряд номеров
// рисовал кнопки «NaN» и «Infinity».

const labels = (container: HTMLElement) =>
  [...container.querySelectorAll("[data-slot=pagination-pages] button")].map((b) => b.textContent)

describe("Pagination: нечисловые значения", () => {
  it("NaN и Infinity вместо числа страниц — одна страница, без «NaN»", () => {
    for (const totalPages of [Number.NaN, Number.POSITIVE_INFINITY, -3]) {
      const { container, unmount } = render(<Pagination page={1} totalPages={totalPages} />)
      expect(container.textContent).not.toMatch(/NaN|Infinity/)
      expect(labels(container)).toEqual(["1"])
      unmount()
    }
  })

  it("page NaN трактуется как первая страница", () => {
    const { container } = render(<Pagination page={Number.NaN} totalPages={3} />)
    expect(container.textContent).not.toMatch(/NaN/)
    expect(container.querySelector("[aria-current=page]")?.textContent).toBe("1")
  })

  it("дробное число страниц округляется вверх", () => {
    const { container } = render(<Pagination page={1} totalPages={2.4} />)
    expect(labels(container).filter((text) => /^\d+$/.test(text ?? ""))).toEqual(["1", "2", "3"])
  })
})
