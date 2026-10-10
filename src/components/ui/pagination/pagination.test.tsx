import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Pagination } from "./pagination"

describe("Pagination", () => {
  it("renders every page when there are 7 or fewer", () => {
    render(<Pagination page={1} totalPages={5} />)
    for (const n of [1, 2, 3, 4, 5]) {
      expect(screen.getByRole("button", { name: String(n) })).toBeInTheDocument()
    }
  })

  it("calls onPageChange when a page number is clicked", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole("button", { name: "3" }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  // Дизайн-чек от 08.10, №17: стрелок «Предыдущая/Следующая» больше нет.
  it("has no previous/next arrows", () => {
    render(<Pagination page={3} totalPages={5} />)
    expect(screen.queryByRole("button", { name: /Предыдущая|Следующая/ })).toBeNull()
    expect(document.querySelector("[data-slot=pagination-nav]")).toBeNull()
  })

  it("collapses far-apart pages behind an ellipsis", () => {
    render(<Pagination page={5} totalPages={20} />)
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "10" })).not.toBeInTheDocument()
  })

  it("renders page size options and calls onPageSizeChange", async () => {
    const user = userEvent.setup()
    const onPageSizeChange = vi.fn()
    render(
      <Pagination
        page={1}
        totalPages={5}
        pageSize={25}
        onPageSizeChange={onPageSizeChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "50" }))

    expect(onPageSizeChange).toHaveBeenCalledWith(50)
  })

  // Дизайн-чек №4 №7: блок Page Count отключать нечем — он есть всегда,
  // даже когда блок страниц скрыт.
  it("keeps the Page Count block when the pages block is hidden", () => {
    render(<Pagination page={1} totalPages={5} pageSize={25} showPages={false} />)
    expect(screen.getByText("На странице")).toBeInTheDocument()
    expect(document.querySelector("[data-slot=pagination-pages]")).toBeNull()
  })

  // Дизайн-чек №4 №7: два набора Page Count — «100 (Without 75)» и «100».
  it("renders the page-size options selected by pageCount", () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} pageSize={25} />)
    expect(screen.queryByRole("button", { name: "75" })).not.toBeInTheDocument()

    rerender(<Pagination page={1} totalPages={5} pageSize={25} pageCount="100" />)
    expect(screen.getByRole("button", { name: "75" })).toBeInTheDocument()
  })
})

describe("Pagination — номер страницы за концом списка", () => {
  // Отбор сузил выдачу до 5 страниц, а родитель оставил `page={7}`:
  // номер последней страницы обязан что-то делать.
  it("номер последней страницы ведёт на неё", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={7} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole("button", { name: "5" }))
    expect(onPageChange).toHaveBeenCalledWith(5)
  })
})
