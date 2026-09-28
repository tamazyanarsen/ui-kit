import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Регрессии аудита полей: ref потребителя, очистка маски, подпись при
// `error={false}`.
describe("Input regressions", () => {
  it("forwards ref to the native input (plain and masked)", () => {
    const plain = React.createRef<HTMLInputElement>()
    const masked = React.createRef<HTMLInputElement>()
    render(
      <>
        <Input ref={plain} label="Имя" />
        <Input ref={masked} label="Телефон" mask="phone" />
      </>
    )
    expect(plain.current).toBe(screen.getByLabelText("Имя"))
    expect(masked.current).toBe(screen.getByLabelText("Телефон"))
  })

  it("notifies onChange when the clear button empties a masked field", async () => {
    const user = userEvent.setup()
    function Controlled({ onChange }: { onChange: (v: string) => void }) {
      const [value, setValue] = React.useState("123456789012")
      return (
        <Input
          label="ИНН"
          mask="inn"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
        />
      )
    }
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenLastCalledWith("")
    expect(screen.getByLabelText("ИНН")).toHaveValue("")
  })

  it("keeps a controlled masked field on its value when the parent rejects input", () => {
    render(
      <Input label="ИНН" mask="inn" value="123456789012" onChange={() => {}} />
    )
    const field = screen.getByLabelText("ИНН") as HTMLInputElement
    const shown = field.value

    fireEvent.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(field.value).toBe(shown)
  })

  it("keeps the comment when error is false or true", () => {
    const { rerender } = render(
      <Input label="Имя" comment="Подсказка" error={false} />
    )
    expect(screen.getByText("Подсказка")).toBeInTheDocument()

    rerender(<Input label="Имя" comment="Подсказка" error />)
    expect(screen.getByText("Подсказка")).toBeInTheDocument()
    expect(screen.getByLabelText("Имя")).toHaveAttribute("aria-invalid", "true")
  })

  it("renders no empty caption for error={false} without a comment", () => {
    const { container } = render(<Input label="Имя" error={false} />)
    expect(container.querySelector("p")).toBeNull()
  })
})
