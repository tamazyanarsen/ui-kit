import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TEST_FIELDS, TEST_ROWS, flatRow } from "@/test/table-fixtures"

import { DataTable } from "./data-table"

// Добор покрытия к исправлениям таблиц (раунд 1): находки, у которых не
// было теста, падающего на коде до исправления.

const FLAT = TEST_ROWS.map(flatRow)

describe("клик из портала не открывает строку", () => {
  it("нажатие по самому меню действий (не по пункту) не зовёт onRowClick", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(
      <DataTable
        fields={TEST_FIELDS}
        rows={[FLAT[1]]}
        onRowClick={onRowClick}
        rowActions={() => [{ text: "Удалить" }]}
      />
    )

    await user.click(screen.getByRole("button", { name: "Действия со строкой" }))
    const menu = await screen.findByRole("menu")
    // Меню отрисовано в портале: в DOM оно не внутри строки, но
    // синтетический клик React всплывает по дереву компонентов до `tr`.
    expect(menu.closest('[data-slot="table-row"]')).toBeNull()
    await user.click(menu)

    expect(onRowClick).not.toHaveBeenCalled()
  })
})
