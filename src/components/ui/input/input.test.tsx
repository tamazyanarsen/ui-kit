import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Search } from "@/icons"

import { Input } from "./input"

describe("Input", () => {
  it("renders a label and associates it with the field", () => {
    render(<Input label="Имя" />)
    expect(screen.getByLabelText("Имя")).toBeInTheDocument()
  })

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Имя" onChange={onChange} />)

    await user.type(screen.getByLabelText("Имя"), "Иван")

    expect(onChange).toHaveBeenCalledTimes(4)
    expect(screen.getByLabelText("Имя")).toHaveValue("Иван")
  })

  it("shows a clear button once there is text and clears it", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<Input label="Имя" onClear={onClear} />)

    const field = screen.getByLabelText("Имя")
    await user.type(field, "Иван")
    await user.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(onClear).toHaveBeenCalledTimes(1)
    expect(field).toHaveValue("")
  })

  it("shows the error message instead of the comment", () => {
    render(<Input label="Имя" comment="Подсказка" error="Обязательное поле" />)
    expect(screen.getByText("Обязательное поле")).toBeInTheDocument()
    expect(screen.queryByText("Подсказка")).not.toBeInTheDocument()
  })

  // ⚠️ Заблокированное поле принимает Tab: блокировка выражается парой
  // `readOnly` + `aria-disabled`, а не нативным `disabled`, который убрал бы
  // поле из обхода клавиатурой целиком. Редактировать нельзя, дойти и
  // прочитать — можно.
  it("blocks editing but stays reachable by Tab when disabled", async () => {
    const user = userEvent.setup()
    render(<Input label="Имя" disabled />)

    const field = screen.getByLabelText("Имя")
    expect(field).toHaveAttribute("aria-disabled", "true")
    expect(field).toHaveAttribute("readonly")
    expect(field).not.toBeDisabled()

    await user.tab()
    expect(field).toHaveFocus()

    await user.keyboard("Иван")
    expect(field).toHaveValue("")
  })

  it("toggles password visibility", async () => {
    const user = userEvent.setup()
    render(<Input label="Пароль" type="password" />)

    const field = screen.getByLabelText("Пароль")
    expect(field).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: "Показать пароль" }))

    expect(field).toHaveAttribute("type", "text")
  })

  it("renders a leading icon", () => {
    const { container } = render(<Input label="Поиск" iconLeft={<Search />} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
