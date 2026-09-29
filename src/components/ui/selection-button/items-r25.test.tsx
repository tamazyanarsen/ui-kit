import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SelectionButton, type SelectionButtonItem } from "./selection-button"

// Раунд 25, класс «.map по массиву без отбрасывания пустых»: действия строки
// собирают условно — `[canEdit && edit, remove]` — и `false` в списке роняло
// меню (`false.disabled`).

describe("SelectionButton: пустые элементы списка", () => {
  it("false и null пропускаются, остальные пункты рисуются", async () => {
    const user = userEvent.setup()
    const items = [
      false,
      { text: "Редактировать" },
      null,
      { text: "Удалить" },
    ] as unknown as SelectionButtonItem[]
    render(<SelectionButton items={items} />)

    await user.click(screen.getByRole("button", { name: "Ещё" }))
    expect(await screen.findAllByRole("menuitem")).toHaveLength(2)
  })
})
