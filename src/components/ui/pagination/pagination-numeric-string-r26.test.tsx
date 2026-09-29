import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Pagination } from "./pagination"

// Проверка r26: правка r25 (защита от NaN) перестала понимать числовые строки
// из query-параметров и JSON: `totalPages="5"` рисовало одну страницу без стрелок.

describe("Pagination: числовые строки", () => {
  it.each(["5", "12"])("totalPages=%s даёт номера страниц и стрелки", (total) => {
    render(
      <Pagination
        totalPages={total as unknown as number}
        page={"2" as unknown as number}
        onPageChange={() => {}}
      />
    )
    expect(screen.getByRole("button", { name: /Следующая/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Предыдущая/ })).toBeInTheDocument()
  })

  it("нечисловая строка по-прежнему не рисует «NaN»", () => {
    render(
      <Pagination totalPages={"abc" as unknown as number} page={1} onPageChange={() => {}} />
    )
    expect(screen.queryByText("NaN")).toBeNull()
  })
})

describe("Pagination: пустые значения page", () => {
  it.each([null, "", " "])("page=%j откатывается на первую страницу", (page) => {
    render(
      <Pagination totalPages={5} page={page as unknown as number} onPageChange={() => {}} />
    )
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page")
  })
})
