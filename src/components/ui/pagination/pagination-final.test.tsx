import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Pagination } from "./pagination"

// Финальный аудит: листая Enter'ом по «Следующей», пользователь доходил до
// последней страницы — стрелка выключалась, и фокус падал на <body>. Так же
// при сокращении до одной страницы, когда стрелки исчезают вовсе.

function Controlled({ total = 3, start = 1 }: { total?: number; start?: number }) {
  const [page, setPage] = React.useState(start)
  return <Pagination page={page} totalPages={total} onPageChange={setPage} />
}

const currentPage = () =>
  document.querySelector<HTMLElement>('[data-slot="pagination-page"][data-active]')

describe("Pagination: фокус со стрелок", () => {
  it("на последней странице фокус переходит на кнопку текущей страницы", async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const next = screen.getByRole("button", { name: "Следующая страница" })
    next.focus()
    await user.keyboard("{Enter}{Enter}")
    expect(next).toBeDisabled()
    expect(currentPage()).toHaveTextContent("3")
    expect(currentPage()).toHaveFocus()
  })

  it("на первой странице так же с «Предыдущей»", async () => {
    const user = userEvent.setup()
    render(<Controlled start={2} />)
    const prev = screen.getByRole("button", { name: "Предыдущая страница" })
    prev.focus()
    await user.keyboard("{Enter}")
    expect(prev).toBeDisabled()
    expect(currentPage()).toHaveFocus()
  })

  it("стрелки исчезли (осталась одна страница) — фокус не на body", () => {
    const { rerender } = render(<Pagination page={2} totalPages={3} />)
    screen.getByRole("button", { name: "Следующая страница" }).focus()
    rerender(<Pagination page={1} totalPages={1} />)
    expect(document.activeElement).not.toBe(document.body)
    expect(currentPage()).toHaveFocus()
  })

  it("ушедший со стрелки фокус не перехватывается", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <>
        <Pagination page={1} totalPages={3} />
        <button type="button">снаружи</button>
      </>
    )
    screen.getByRole("button", { name: "Следующая страница" }).focus()
    await user.click(screen.getByRole("button", { name: "снаружи" }))
    rerender(
      <>
        <Pagination page={3} totalPages={3} />
        <button type="button">снаружи</button>
      </>
    )
    expect(screen.getByRole("button", { name: "снаружи" })).toHaveFocus()
  })
})
