import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Pagination } from "./pagination"

// Дизайн-чек от 08.10, замечание 17 («ELK / paginator» v1.0.1): «Удалили
// стрелки, удалили разделитель, компонент вычищен». Ни рамки, ни заливки,
// ни своих полей — их даёт место применения (TableBlockPagination).
describe("Pagination: вычищенный компонент", () => {
  it("без рамки, заливки и полей", () => {
    const { container } = render(<Pagination page={5} totalPages={20} />)
    const root = container.querySelector("[data-slot=pagination]")!
    expect(root.className).not.toMatch(/\bborder-t\b|\bbg-white\b|\bpx-4\b|\bpt-\[3px\]|\bpb-1\b/)
    expect(container.querySelector("[data-slot=pagination-nav]")).toBeNull()
  })
})
