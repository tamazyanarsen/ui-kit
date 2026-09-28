import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Pagination } from "./pagination"

// Круг проверки после финальных исправлений: передача фокуса со стрелок
// считала «потерянным» любой фокус вне пагинации. Метка оставалась после
// ухода фокуса в пустоту, и смена страницы, вызванная вводом в поиск,
// выдёргивала пользователя из поля на кнопку «1».

function SearchScreen() {
  const [page, setPage] = React.useState(1)
  const [query, setQuery] = React.useState("")
  return (
    <div>
      <input
        aria-label="Поиск"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setPage(1)
        }}
      />
      <p>пустое место</p>
      <Pagination page={page} totalPages={10} onPageChange={setPage} />
    </div>
  )
}

describe("Pagination: фокус вне пагинации не перехватывается", () => {
  it("ввод в поиск после «Следующей» и клика по пустому месту остаётся в поле", async () => {
    const user = userEvent.setup()
    render(<SearchScreen />)

    await user.click(screen.getByRole("button", { name: "Следующая страница" }))
    await user.click(screen.getByText("пустое место"))
    await user.click(screen.getByLabelText("Поиск"))
    await user.keyboard("а")

    expect(screen.getByLabelText("Поиск")).toHaveFocus()
  })
})
