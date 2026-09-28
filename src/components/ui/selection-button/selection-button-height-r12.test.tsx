import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SelectionButton } from "./selection-button"

// Аудит 11: меню SelectionButton не ограничивало высоту — длинный список
// уходил за край окна без прокрутки внутри.

describe("SelectionButton: высота меню", () => {
  it("список ограничен --available-height и прокручивается", async () => {
    const user = userEvent.setup()
    render(<SelectionButton items={[{ text: "Удалить" }]} />)
    await user.click(screen.getByRole("button", { name: "Ещё" }))
    const list = await screen.findByRole("menu")
    expect(list).toHaveClass("max-h-(--available-height)", "overflow-y-auto", "themed-scrollbar")
    expect(list).not.toHaveClass("overflow-hidden")
  })
})
