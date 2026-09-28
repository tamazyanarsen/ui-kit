import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Регрессии второго прохода по маске: очистка при каретке в середине и
// запись значения в узел снаружи (так пишет react-hook-form).
describe("Input mask regressions", () => {
  async function putCaretMidValue(field: HTMLInputElement) {
    const user = userEvent.setup()
    await user.click(field)
    field.setSelectionRange(7, 7)
    // Нажатие клавиши — то, на чём imask запоминает позицию каретки.
    await user.keyboard("{ArrowRight}")
    return user
  }

  it("clears the whole masked value when the caret sits mid-value (uncontrolled)", async () => {
    const onChange = vi.fn()
    render(
      <Input
        label="Телефон"
        mask="phone"
        defaultValue="9123456789"
        onChange={(e) => onChange(e.target.value)}
      />
    )
    const field = screen.getByLabelText("Телефон") as HTMLInputElement
    expect(field.value).toBe("+7 912 345-67-89")
    const user = await putCaretMidValue(field)

    await user.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(field.value).toBe("")
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith("")
  })

  it("clears the whole masked value when the caret sits mid-value (controlled)", async () => {
    const onChange = vi.fn()
    function Controlled() {
      const [value, setValue] = React.useState("+7 912 345-67-89")
      return (
        <Input
          label="Телефон"
          mask="phone"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
        />
      )
    }
    render(<Controlled />)
    const field = screen.getByLabelText("Телефон") as HTMLInputElement
    const user = await putCaretMidValue(field)

    await user.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(field.value).toBe("")
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith("")
  })

  it("keeps a value written into the node before the mask mounted", () => {
    // Так react-hook-form отдаёт `defaultValues`: `ref.value = …` в ref-колбэке.
    const writeDefault = (node: HTMLInputElement | null) => {
      if (node) node.value = "9123456789"
    }
    render(<Input ref={writeDefault} label="Телефон" mask="phone" />)

    expect(screen.getByLabelText("Телефон")).toHaveValue("+7 912 345-67-89")
  })

  it("syncs the mask with a value written into the node later", async () => {
    const onChange = vi.fn()
    const ref = React.createRef<HTMLInputElement>()
    render(
      <Input
        ref={ref}
        label="Телефон"
        mask="phone"
        defaultValue="9123456789"
        onChange={(e) => onChange(e.target.value)}
      />
    )
    const field = screen.getByLabelText("Телефон") as HTMLInputElement

    // `setValue()` / `reset()` из react-hook-form.
    ref.current!.value = "9001112233"
    expect(field.value).toBe("+7 900 111-22-33")

    // Следующий ввод считается от НОВОГО значения, а не от прежнего.
    const user = userEvent.setup()
    await user.click(field)
    field.setSelectionRange(field.value.length, field.value.length)
    await user.keyboard("{Backspace}")
    expect(field.value).toBe("+7 900 111-22-3")
    expect(onChange).toHaveBeenLastCalledWith("+7 900 111-22-3")
  })
})
