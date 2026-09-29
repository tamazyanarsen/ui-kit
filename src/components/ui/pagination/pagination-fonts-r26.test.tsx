import { act, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Pagination } from "./pagination"

// Раунд 26: Object Sans грузится асинхронно и делает ряд номеров шире, а
// полоса пагинатора при этом не меняется — ResizeObserver молчит. Ряд,
// уместившийся по запасной гарнитуре, после загрузки шрифта вылезал за край.

let digit = 10

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
            (sum, cell) => sum + 30 + (cell.textContent?.length ?? 0) * digit,
            0
          )
        : 0
    return { width: w, height: 36, top: 0, left: 0, right: w, bottom: 36 } as DOMRect
  })
}

describe("Pagination: загрузка шрифта", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Reflect.deleteProperty(document, "fonts")
    digit = 10
  })

  it("после загрузки шрифта полный ряд перемеряется и сжимается", async () => {
    let loaded: () => void = () => {}
    const ready = new Promise<void>((resolve) => (loaded = resolve))
    Object.defineProperty(document, "fonts", { value: { ready }, configurable: true })
    // Полный ряд «1 … 5999 6000 6001 … 9999» = 440 при цифре 10 и 610 при 20.
    mockStrip(500)
    render(<Pagination page={6000} totalPages={9999} />)
    const root = document.querySelector('[data-slot="pagination"]')
    expect(root).not.toHaveAttribute("data-compact")

    digit = 20
    await act(async () => {
      loaded()
      await ready
    })
    expect(root).toHaveAttribute("data-compact")
  })
})
