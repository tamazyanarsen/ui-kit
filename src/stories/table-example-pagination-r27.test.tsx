import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { TableExample } from "./table-example"
import { TableFieldsExample } from "./table-fields-example"

// Раунд 27: пагинатор в витринах таблицы стоял со статичным `page={1}` и
// пустым обработчиком — нажатие на «2» и на размер страницы ничего не меняло.

async function pageTwo(node: React.ReactElement) {
  const user = userEvent.setup()
  render(node)
  const pagination = document.querySelector('[data-slot="pagination"]') as HTMLElement
  await user.click(screen.getByRole("button", { name: "2" }))
  expect(pagination.querySelector('[data-slot="pagination-page"][data-active]')).toHaveTextContent("2")
  await user.click(screen.getByRole("button", { name: "50" }))
  expect(pagination.querySelector('[data-slot="pagination-size"][data-active]')).toHaveTextContent("50")
}

describe("Витрины таблиц: живой пагинатор", () => {
  it("TableExample", async () => {
    await pageTwo(<TableExample showPagination />)
  })
  it("TableFieldsExample", async () => {
    await pageTwo(<TableFieldsExample showPagination />)
  })
})
