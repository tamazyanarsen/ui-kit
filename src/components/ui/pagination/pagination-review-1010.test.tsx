import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Pagination } from "./pagination"
import { getMinimalPageList } from "./use-compact-pages"

// Ревью 10.10, п. 8: самый узкий ряд не отсекал номера вне `1…totalPages`.
describe("getMinimalPageList: границы (ревью 10.10, п. 8)", () => {
  it.each([
    [0, [1, "ellipsis", 20]],
    [-3, [1, "ellipsis", 20]],
    [2.5, [3, "ellipsis", 20]],
    [99, [1, "ellipsis", 20]],
    [10, [10, "ellipsis", 20]],
  ] as const)("page=%s → %j", (page, expected) => {
    expect(getMinimalPageList(page, 20)).toEqual(expected)
  })

  it("нет страниц — нет и номеров", () => {
    expect(getMinimalPageList(1, 0)).toEqual([])
  })
})

// Ревью 10.10, п. 18: `pageSize` из query приходит строкой, как и `page`, но
// сравнивался строго и не подсвечивал ни одной кнопки.
describe("Pagination: pageSize строкой (ревью 10.10, п. 18)", () => {
  it("«50» подсвечивает кнопку 50", () => {
    const { container } = render(
      <Pagination
        totalPages={5}
        page={1}
        onPageChange={() => {}}
        pageSize={"50" as unknown as number}
      />
    )
    const active = container.querySelector('[data-slot="pagination-size"][data-active]')
    expect(active).toHaveTextContent("50")
  })
})
