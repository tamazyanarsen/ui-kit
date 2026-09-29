import { render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Pagination } from "./pagination"

// Раунд 27: полоса, сжатая соседями до нуля, коробку имеет — ряд обязан
// сжаться. Старая проверка `clientWidth === 0` принимала её за скрытую и
// оставляла полный ряд торчать за краем.

describe("Pagination: полоса нулевой ширины с коробкой", () => {
  afterEach(() => vi.restoreAllMocks())

  it("сжимает ряд, когда коробка есть, а ширина 0", () => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(0)
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function (
      this: HTMLElement
    ) {
      return (this.dataset.slot === "pagination"
        ? [{ width: 0 }]
        : []) as unknown as DOMRectList
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      const w = this.dataset.slot === "pagination-pages" ? this.children.length * 40 : 0
      return { width: w, height: 36, top: 0, left: 0, right: w, bottom: 36 } as DOMRect
    })
    render(<Pagination page={6} totalPages={20} />)
    const root = document.querySelector('[data-slot="pagination"]')
    expect(root).toHaveAttribute("data-compact")
  })
})
