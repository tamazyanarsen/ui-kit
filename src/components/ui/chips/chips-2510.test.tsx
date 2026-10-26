import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Chips } from "./chips"

// Правки UI-Kit от 25.10, «Chips — нет нажимаемого режима»: фильтр-чипс —
// кнопка с aria-pressed, фокус с клавиатуры, Enter/Space.

function Toggle({ onChange }: { onChange?: (v: boolean) => void }) {
  const [selected, setSelected] = React.useState(false)
  return (
    <Chips
      selected={selected}
      onPressedChange={(v) => {
        setSelected(v)
        onChange?.(v)
      }}
    >
      Активные
    </Chips>
  )
}

describe("Chips: нажимаемый режим", () => {
  it("без onPressedChange — по-прежнему span без роли кнопки", () => {
    render(<Chips>Значение</Chips>)
    expect(screen.queryByRole("button")).toBeNull()
    expect(document.querySelector('[data-slot="chips"]')?.tagName).toBe("SPAN")
  })

  it("с onPressedChange — кнопка с aria-pressed и press-scale", () => {
    render(<Toggle />)
    const chip = screen.getByRole("button", { name: "Активные" })
    expect(chip).toHaveAttribute("data-slot", "chips")
    expect(chip).toHaveAttribute("aria-pressed", "false")
    expect(chip).toHaveAttribute("type", "button")
    expect(chip).toHaveClass("press-scale", "focus-visible:focus-ring", "cursor-pointer")
    expect(chip).not.toHaveClass("transition-colors")
  })

  it("берёт фокус по Tab и переключается по Enter и Space", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle onChange={onChange} />)
    await user.tab()
    const chip = screen.getByRole("button", { name: "Активные" })
    expect(chip).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(chip).toHaveAttribute("aria-pressed", "true")
    await user.keyboard(" ")
    expect(chip).toHaveAttribute("aria-pressed", "false")
    expect(onChange.mock.calls).toEqual([[true], [false]])
  })

  it("переключается кликом", async () => {
    const user = userEvent.setup()
    render(<Toggle />)
    const chip = screen.getByRole("button", { name: "Активные" })
    await user.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
  })

  it("выключенный чипс не переключается", async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(
      <Chips disabled onPressedChange={onPressedChange}>
        Активные
      </Chips>
    )
    const chip = screen.getByRole("button", { name: "Активные" })
    expect(chip).toBeDisabled()
    await user.click(chip)
    expect(onPressedChange).not.toHaveBeenCalled()
  })

  it("крестик в нажимаемом режиме не рисуется — кнопки в кнопке нет", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(
      <Chips closable onRemove={() => {}} onPressedChange={() => {}}>
        Активные
      </Chips>
    )
    const chip = screen.getByRole("button", { name: "Активные" })
    expect(chip.querySelector("button")).toBeNull()
    expect(screen.queryByRole("button", { name: "Удалить" })).toBeNull()
    warn.mockRestore()
  })
})
