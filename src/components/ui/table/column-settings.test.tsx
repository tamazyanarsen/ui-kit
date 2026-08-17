import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings, type TableColumn } from "./column-settings"

const COLUMNS: TableColumn[] = [
  { id: "status", label: "Статус", visible: true, locked: true },
  { id: "number", label: "Номер платежа", visible: true },
  { id: "sum", label: "Сумма", visible: false },
]

describe("TableColumnSettings", () => {
  it("opens from the trigger and lists every column", async () => {
    const user = userEvent.setup()
    render(
      <TableColumnSettings columns={COLUMNS} onColumnsChange={vi.fn()} />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))

    expect(screen.getByText("Статус")).toBeInTheDocument()
    expect(screen.getByText("Номер платежа")).toBeInTheDocument()
    expect(screen.getByText("Сумма")).toBeInTheDocument()
  })

  it("toggles a column's visibility", async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(
      <TableColumnSettings
        columns={COLUMNS}
        onColumnsChange={onColumnsChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.click(
      screen.getByRole("checkbox", {
        name: "Показывать столбец «Номер платежа»",
      })
    )

    expect(onColumnsChange).toHaveBeenCalledWith([
      COLUMNS[0],
      { ...COLUMNS[1], visible: false },
      COLUMNS[2],
    ])
    // ⚠️ РОВНО один раз. Строка и галочка переключают одно и то же, и без
    // остановки всплытия клик по самой галочке срабатывал бы дважды —
    // сначала её `onCheckedChange`, затем `onClick` строки, — а столбец
    // возвращался бы в исходное состояние. Со стороны: «чекбокс не работает».
    expect(onColumnsChange).toHaveBeenCalledTimes(1)
  })

  // Переключает вся строка, а не только галочка: мишень 24×24 посреди строки
  // 280×56 — промах по площади в двадцать с лишним раз.
  it("toggles from anywhere in the row, not just the checkbox", async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(
      <TableColumnSettings
        columns={COLUMNS}
        onColumnsChange={onColumnsChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.click(screen.getByText("Номер платежа"))

    expect(onColumnsChange).toHaveBeenCalledTimes(1)
    expect(onColumnsChange).toHaveBeenCalledWith([
      COLUMNS[0],
      { ...COLUMNS[1], visible: false },
      COLUMNS[2],
    ])
  })

  it("keeps a locked row inert", async () => {
    const user = userEvent.setup()
    const onColumnsChange = vi.fn()
    render(
      <TableColumnSettings
        columns={COLUMNS}
        onColumnsChange={onColumnsChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.click(screen.getByText("Статус"))

    expect(onColumnsChange).not.toHaveBeenCalled()
  })

  // "Скрытие столбцов не сбрасывает их положение" — a locked column is
  // always shown and its checkbox can't be cleared.
  it("locks the mandatory columns", async () => {
    const user = userEvent.setup()
    render(
      <TableColumnSettings columns={COLUMNS} onColumnsChange={vi.fn()} />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))

    // Base UI's Checkbox renders a `role="checkbox"` span, so the disabled
    // state lands on `aria-disabled`/`data-disabled` rather than the DOM
    // `disabled` property `toBeDisabled()` looks for.
    const checkbox = screen.getByRole("checkbox", {
      name: "Показывать столбец «Статус»",
    })
    expect(checkbox).toHaveAttribute("aria-disabled", "true")
    expect(checkbox).toHaveAttribute("data-checked")
  })

  it("filters the list by the search field", async () => {
    const user = userEvent.setup()
    render(
      <TableColumnSettings columns={COLUMNS} onColumnsChange={vi.fn()} />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.type(screen.getByRole("textbox"), "сум")

    expect(screen.getByText("Сумма")).toBeInTheDocument()
    expect(screen.queryByText("Номер платежа")).not.toBeInTheDocument()
  })

  // "Допускаются таблицы, в которых доступно только включение/отключение
  // видимости или только изменение порядка столбцов (не оба параметра
  // одновременно)."
  it("can drop either axis independently", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <TableColumnSettings
        columns={COLUMNS}
        onColumnsChange={vi.fn()}
        hideable={false}
      />
    )

    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
    expect(
      container.ownerDocument.querySelectorAll(
        '[data-slot="table-column-settings-row"]'
      ).length
    ).toBe(3)
  })
})
