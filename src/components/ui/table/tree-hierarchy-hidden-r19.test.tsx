import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings } from "./column-settings"
import { DataTable } from "./data-table"
import { columnsFromFields, treeRequiredColumnIds } from "./table-columns"
import type { TableField } from "./field-types"

// Аудит 18: столбец дерева (`hierarchy`) можно было скрыть в «Настроить
// столбцы». Без другого текстового столбца шевронов не оставалось ни в
// строках, ни в шапке — вложенные строки свёрнутого дерева было нечем
// раскрыть, и они пропадали из таблицы.

interface Row {
  id: string
  name: string
  amount: number
  children?: Row[]
}

const FIELDS: TableField<Row>[] = [
  { key: "name", title: "Название", hierarchy: true, value: (row) => row.name },
  { key: "amount", title: "Сумма", type: "money", value: (row) => row.amount },
]

const ROWS: Row[] = [
  { id: "p", name: "Родитель", amount: 1, children: [{ id: "c", name: "Ребёнок", amount: 2 }] },
  { id: "q", name: "Сосед", amount: 3 },
]

describe("DataTable: столбец дерева скрыт", () => {
  it("без столбца-носителя шевронов дерево показывается раскрытым", () => {
    const columns = columnsFromFields(FIELDS).map((column) =>
      column.id === "name" ? { ...column, visible: false } : column
    )
    const { container } = render(
      <DataTable fields={FIELDS} rows={ROWS} columnSettings={columns} defaultCollapsed />
    )
    // Три строки: родитель, ребёнок и сосед — ребёнок достижим.
    expect(container.querySelectorAll("tbody tr")).toHaveLength(3)
  })

  it("со столбцом дерева свёрнутое остаётся свёрнутым", () => {
    const { container } = render(<DataTable fields={FIELDS} rows={ROWS} defaultCollapsed />)
    expect(container.querySelectorAll("tbody tr")).toHaveLength(2)
  })
})

describe("TableColumnSettings: столбец дерева нельзя скрыть — только в дереве", () => {
  const box = () => screen.getByRole("checkbox", { name: "Показывать столбец «Название»" })

  async function openWith(rows: Row[], onColumnsChange = vi.fn()) {
    render(
      <TableColumnSettings
        columns={columnsFromFields(FIELDS)}
        onColumnsChange={onColumnsChange}
        requiredIds={treeRequiredColumnIds(FIELDS, rows)}
      />
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    return user
  }

  it("дерево: флажок выключен, щелчок по строке не скрывает", async () => {
    const onColumnsChange = vi.fn()
    const user = await openWith(ROWS, onColumnsChange)
    expect(box()).toHaveAttribute("aria-disabled", "true")
    await user.click(screen.getByText("Название"))
    expect(onColumnsChange).not.toHaveBeenCalled()
    // Обычный столбец по-прежнему скрывается.
    await user.click(screen.getByText("Сумма"))
    expect(onColumnsChange).toHaveBeenCalledTimes(1)
  })

  // Проверка правок r19: флаг ставился в `columnsFromFields` всегда, и в
  // плоской таблице столбец с `hierarchy: true` тоже нельзя было скрыть,
  // хотя защищать там нечего.
  it("плоская таблица: флажок включён, столбец скрывается", async () => {
    const flat = ROWS.map(({ children: _children, ...row }) => row)
    expect(treeRequiredColumnIds(FIELDS, flat)).toEqual([])
    expect(columnsFromFields(FIELDS).some((column) => column.required)).toBe(false)
    const onColumnsChange = vi.fn()
    const user = await openWith(flat, onColumnsChange)
    expect(box()).not.toHaveAttribute("aria-disabled", "true")
    await user.click(screen.getByText("Название"))
    expect(onColumnsChange).toHaveBeenCalledTimes(1)
  })

  it("уже скрытый обязательный столбец включить можно", async () => {
    function Harness() {
      const [columns, setColumns] = React.useState(() =>
        columnsFromFields(FIELDS).map((column) =>
          column.id === "name" ? { ...column, visible: false } : column
        )
      )
      return (
        <TableColumnSettings
          columns={columns}
          onColumnsChange={setColumns}
          requiredIds={treeRequiredColumnIds(FIELDS, ROWS)}
        />
      )
    }
    render(<Harness />)
    const user = userEvent.setup()
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.click(screen.getByText("Название"))
    expect(box()).toHaveAttribute("aria-checked", "true")
  })

  it("явный required у столбца по-прежнему работает", async () => {
    render(
      <TableColumnSettings
        columns={[
          { id: "a", label: "Первый", required: true },
          { id: "b", label: "Второй" },
        ]}
        onColumnsChange={vi.fn()}
      />
    )
    await userEvent.setup().click(screen.getByRole("button", { name: "Настроить столбцы" }))
    expect(
      screen.getByRole("checkbox", { name: "Показывать столбец «Первый»" })
    ).toHaveAttribute("aria-disabled", "true")
  })
})
