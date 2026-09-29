import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tooltip } from "./tooltip"

// r26: собственный `id` у ребёнка Tooltip (`<Button id="save">`) перекрывал
// id, под которым Base UI зарегистрировал триггер: подсказка открывалась и
// через мгновение сама закрывалась с причиной «потерян триггер». Id ребёнка
// теперь отдаётся самому триггеру.

describe("Tooltip: id у ребёнка", () => {
  it("подсказка не закрывается сама, когда у кнопки есть id", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Сохранить черновик">
        <button id="save">Сохранить</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole("button", { name: "Сохранить" }))
    await waitFor(() => expect(screen.getByText("Сохранить черновик")).toBeInTheDocument(), {
      timeout: 2000,
    })
    // Раньше подсказка пропадала в следующем же такте после открытия.
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(screen.getByText("Сохранить черновик")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Сохранить" })).toHaveAttribute("id", "save")
  })
})
