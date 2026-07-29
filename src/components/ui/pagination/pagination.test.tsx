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

  it("disables the previous button on the first page and next on the last", () => {
    const { rerender } = render(<Pagination page={1} totalPages={5} />)
    expect(screen.getByRole("button", { name: "Предыдущая страница" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Следующая страница" })).toBeEnabled()

    rerender(<Pagination page={5} totalPages={5} />)
    expect(screen.getByRole("button", { name: "Следующая страница" })).toBeDisabled()
  })

  it("navigates via the next/previous buttons", async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole("button", { name: "Следующая страница" }))
    expect(onPageChange).toHaveBeenLastCalledWith(4)

    await user.click(screen.getByRole("button", { name: "Предыдущая страница" }))
    expect(onPageChange).toHaveBeenLastCalledWith(2)
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

  it("hides the page-size controls when showPageSize is false", () => {
    render(<Pagination page={1} totalPages={5} pageSize={25} showPageSize={false} />)
    expect(screen.queryByText("Показать на странице")).not.toBeInTheDocument()
  })
})
