import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Item } from "./item"

describe("Item", () => {
  it("renders text, value, and comment", () => {
    render(<Item text="Тип операции" value="Перевод" comment="Комментарий" />)
    expect(screen.getByText("Тип операции")).toBeInTheDocument()
    expect(screen.getByText("Перевод")).toBeInTheDocument()
    expect(screen.getByText("Комментарий")).toBeInTheDocument()
  })

  it("is a clickable row and calls onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Item value="Перевод" onClick={onClick} />)

    await user.click(screen.getByRole("button"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("activates via keyboard", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Item value="Перевод" onClick={onClick} />)

    screen.getByRole("button").focus()
    await user.keyboard("{Enter}")

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Item value="Перевод" disabled onClick={onClick} />)

    const row = screen.getByRole("button")
    expect(row).toHaveAttribute("aria-disabled", "true")
    expect(row).toHaveAttribute("tabindex", "-1")

    await user.click(row)

    expect(onClick).not.toHaveBeenCalled()
  })

  it("toggles the checkbox right element without firing the row's onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onCheckboxChange = vi.fn()
    render(
      <Item
        value="Перевод"
        rightElement="checkbox"
        onClick={onClick}
        onCheckboxChange={onCheckboxChange}
      />
    )

    await user.click(screen.getByRole("checkbox"))

    expect(onCheckboxChange).toHaveBeenCalledWith(true, expect.anything())
    expect(onClick).not.toHaveBeenCalled()
  })

  it("toggles the toggle right element without firing the row's onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onToggleChange = vi.fn()
    render(
      <Item
        value="Уведомления"
        rightElement="toggle"
        onClick={onClick}
        onToggleChange={onToggleChange}
      />
    )

    await user.click(screen.getByRole("switch"))

    expect(onToggleChange).toHaveBeenCalledWith(true, expect.anything())
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders the rightText for the text right element", () => {
    render(<Item value="Курс" rightElement="text" rightText="+1,5%" />)
    expect(screen.getByText("+1,5%")).toBeInTheDocument()
  })
})
