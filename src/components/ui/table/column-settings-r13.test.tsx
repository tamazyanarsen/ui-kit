import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings, type TableColumn } from "./column-settings"

// Аудит 12: поиск без совпадений оставлял окно пустым — под полем поиска
// ничего, и казалось, что столбцы пропали.

const COLUMNS: TableColumn[] = [
  { id: "date", label: "Дата", visible: true },
  { id: "sum", label: "Сумма", visible: true },
]

describe("TableColumnSettings: пустой результат поиска", () => {
  it("без совпадений — «Ничего не найдено»", async () => {
    const user = userEvent.setup()
    render(<TableColumnSettings columns={COLUMNS} onColumnsChange={vi.fn()} />)
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument()

    await user.type(screen.getByRole("searchbox"), "zzz")
    expect(screen.getByText("Ничего не найдено")).toBeInTheDocument()

    await user.clear(screen.getByRole("searchbox"))
    expect(screen.queryByText("Ничего не найдено")).not.toBeInTheDocument()
    expect(screen.getByText("Дата")).toBeInTheDocument()
  })
})
