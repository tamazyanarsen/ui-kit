import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings, type TableColumn } from "./column-settings"

// Аудит 14: окно «Настроить столбцы» не было ограничено по высоте — при
// 20 столбцах в окне 1280×400 последняя строка уходила за низ экрана, а
// позиционер держал окно у верха. И снять можно было все флажки: таблица
// оставалась с одной колонкой флажков без данных.

const popup = () =>
  document.querySelector('[data-slot="table-column-settings"]') as HTMLElement

async function open() {
  await userEvent.setup().click(screen.getByRole("button", { name: "Настроить столбцы" }))
}

describe("TableColumnSettings: окно не выше доступного места", () => {
  it("окно ограничено, сжимается и прокручивается список", async () => {
    const columns = Array.from({ length: 20 }, (_, i) => ({
      id: `c${i}`,
      label: `Столбец ${i + 1}`,
    }))
    render(<TableColumnSettings columns={columns} onColumnsChange={vi.fn()} />)
    await open()
    expect(popup()).toHaveClass("max-h-[min(504px,var(--available-height,504px))]", "flex", "flex-col")
    const list = screen.getByText("Столбец 1").closest(".overflow-y-auto") as HTMLElement
    expect(list).toHaveClass("min-h-0")
  })
})

describe("TableColumnSettings: последний видимый столбец не снимается", () => {
  function Harness({ initial }: { initial: TableColumn[] }) {
    const [columns, setColumns] = React.useState(initial)
    return <TableColumnSettings columns={columns} onColumnsChange={setColumns} />
  }

  it("флажок последнего видимого выключен, щелчок по строке ничего не делает", async () => {
    const user = userEvent.setup()
    render(
      <Harness
        initial={[
          { id: "a", label: "Дата" },
          { id: "b", label: "Сумма" },
        ]}
      />
    )
    await open()
    await user.click(screen.getByRole("checkbox", { name: "Показывать столбец «Дата»" }))
    const last = screen.getByRole("checkbox", { name: "Показывать столбец «Сумма»" })
    expect(last).toHaveAttribute("aria-checked", "true")
    expect(last).toHaveAttribute("aria-disabled", "true")

    await user.click(screen.getByText("Сумма"))
    expect(last).toHaveAttribute("aria-checked", "true")
  })

  it("при видимой закреплённой колонке снять можно все обычные", async () => {
    const onChange = vi.fn()
    render(
      <TableColumnSettings
        columns={[
          { id: "a", label: "Номер", locked: true },
          { id: "b", label: "Сумма" },
        ]}
        onColumnsChange={onChange}
      />
    )
    await open()
    await userEvent.setup().click(screen.getByText("Сумма"))
    expect(onChange).toHaveBeenCalledWith([
      { id: "a", label: "Номер", locked: true },
      { id: "b", label: "Сумма", visible: false },
    ])
  })
})
