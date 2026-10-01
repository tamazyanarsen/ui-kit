import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Pagination } from "./pagination"

// Size=L / Mobile и M / Mobile макета: числа 40 × 32 (px 6, 12/16), «…» 32 × 32;
// десктопные 44 × 36 и 14/20 включаются вариантом `desktop:`.
describe("Pagination — мобильные размеры блока страниц", () => {
  it("числа, стрелки и «…» мобильные, десктопные — за desktop:", () => {
    const { container } = render(<Pagination page={5} totalPages={20} />)
    const page = container.querySelector("[data-slot=pagination-page]")!.className
    expect(page).toContain("min-w-10")
    expect(page).toContain("px-1.5")
    expect(page).toContain("text-p3-medium")
    expect(page).toContain("desktop:min-w-11")
    expect(page).toContain("desktop:text-p2-medium")
    const nav = container.querySelector("[data-slot=pagination-nav]")!.className
    expect(nav).toContain("size-8")
    expect(nav).toContain("desktop:size-9")
    const dots = container.querySelector("[data-slot=pagination-ellipsis]")!.className
    expect(dots).toContain("size-8")
    expect(dots).toContain("desktop:size-9")
  })
})
