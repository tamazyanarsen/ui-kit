import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DropdownPanelButton } from "./dropdown-panel-button"

describe("DropdownPanelButton", () => {
  it("рисует кнопку с подписью и стрелкой слева и зовёт onClick", async () => {
    const onClick = vi.fn()
    render(<DropdownPanelButton onClick={onClick}>Добавить</DropdownPanelButton>)
    const button = screen.getByRole("button", { name: "Добавить" })
    expect(button.querySelector("svg")).toBeInTheDocument()
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
