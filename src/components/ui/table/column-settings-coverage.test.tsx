import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableColumnSettings } from "./column-settings"

// Покрытие правки «locked-столбец нельзя сдвинуть при активном поиске».
// Хук сортировки видит только найденные строки: закреплённая колонка,
// скрытая поиском между двумя найденными, для него не существует, и
// стрелка на соседней ручке переставляла колонки ЧЕРЕЗ неё — закреплённая
// съезжала с места. Проверка теперь идёт по полному списку `columns`.

describe("настройка столбцов: закреплённый столбец при поиске", () => {
  it("стрелка не переносит найденную колонку через скрытую поиском закреплённую", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TableColumnSettings
        columns={[
          { id: "sum-1", label: "Сумма в рублях", visible: true },
          { id: "contract", label: "Договор", visible: true, locked: true },
          { id: "sum-2", label: "Сумма в валюте", visible: true },
        ]}
        onColumnsChange={onChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.type(screen.getByPlaceholderText("Поиск"), "Сумма")

    const handles = document.querySelectorAll<HTMLElement>('[data-slot="sortable-handle"]')
    // Видны только две «Суммы»; «Договор» спрятан между ними.
    expect(handles).toHaveLength(2)
    fireEvent.keyDown(handles[0], { key: "ArrowDown" })

    expect(onChange).not.toHaveBeenCalled()
  })

  it("без закреплённой между ними перенос при поиске работает", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TableColumnSettings
        columns={[
          { id: "sum-1", label: "Сумма в рублях", visible: true },
          { id: "contract", label: "Договор", visible: true },
          { id: "sum-2", label: "Сумма в валюте", visible: true },
        ]}
        onColumnsChange={onChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.type(screen.getByPlaceholderText("Поиск"), "Сумма")

    const handles = document.querySelectorAll<HTMLElement>('[data-slot="sortable-handle"]')
    fireEvent.keyDown(handles[0], { key: "ArrowDown" })

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ id: "contract" }),
      expect.objectContaining({ id: "sum-2" }),
      expect.objectContaining({ id: "sum-1" }),
    ])
  })
})
