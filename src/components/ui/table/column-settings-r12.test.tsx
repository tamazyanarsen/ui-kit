import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings, type TableColumn } from "./column-settings"
import { TableRowMenu } from "./row-menu"

// Аудит 11: поиск в «Настроить столбцы» жил дольше окна — после закрытия с
// «Сум» в поле окно открывалось с одной строкой, и остальные столбцы
// выглядели пропавшими.

const COLUMNS: TableColumn[] = [
  { id: "date", label: "Дата", visible: true },
  { id: "sum", label: "Сумма", visible: true },
  { id: "status", label: "Статус", visible: true },
]

describe("TableColumnSettings: поиск сбрасывается на открытие", () => {
  it("повторное открытие показывает все столбцы и пустое поле", async () => {
    const user = userEvent.setup()
    render(<TableColumnSettings columns={COLUMNS} onColumnsChange={vi.fn()} />)
    const trigger = screen.getByRole("button", { name: "Настроить столбцы" })

    await user.click(trigger)
    await user.type(screen.getByRole("searchbox"), "Сум")
    expect(screen.queryByText("Дата")).not.toBeInTheDocument()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("searchbox")).not.toBeInTheDocument())

    await user.click(trigger)
    expect(screen.getByRole("searchbox")).toHaveValue("")
    expect(screen.getByText("Дата")).toBeInTheDocument()
    expect(screen.getByText("Статус")).toBeInTheDocument()
  })
})

// Аудит 11: у меню строки не было предела высоты — длинный список уходил
// за край окна без прокрутки внутри.
describe("TableRowMenu: высота не больше места до края окна", () => {
  it("список ограничен --available-height и прокручивается", async () => {
    const user = userEvent.setup()
    render(<TableRowMenu menu={<div>Пункт</div>} />)
    await user.click(screen.getByRole("button", { name: "Открыть меню строки" }))
    const list = await screen.findByRole("menu")
    // Предел `min(504, --available-height)` живёт в базе Dropdown.
    expect(list).toHaveClass("max-h-[min(504px,var(--available-height,504px))]", "overflow-y-auto", "themed-scrollbar")
    expect(list).not.toHaveClass("overflow-hidden")
  })
})
