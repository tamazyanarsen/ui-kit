import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RangeInput } from "@/components/ui/range-input/range-input"
import { Radio } from "@/components/ui/radio/radio"
import { RadioGroup } from "@/components/ui/radio/root"
import { Textarea } from "@/components/ui/textarea/textarea"
import { Toggle } from "@/components/ui/toggle/toggle"

import { Checkbox } from "./checkbox"

// Регрессии аудита контролов формы: ref потребителя и подпись при
// булевом `error`.
describe("form controls regressions", () => {
  it("forwards refs to the underlying elements", () => {
    const textarea = React.createRef<HTMLTextAreaElement>()
    const checkbox = React.createRef<HTMLSpanElement>()
    const toggle = React.createRef<HTMLSpanElement>()
    const radio = React.createRef<HTMLSpanElement>()
    render(
      <>
        <Textarea ref={textarea} label="Комментарий" />
        <Checkbox ref={checkbox} label="Согласен" />
        <Toggle ref={toggle} label="Уведомления" />
        <RadioGroup>
          <Radio ref={radio} value="a" label="Вариант" />
        </RadioGroup>
      </>
    )
    expect(textarea.current).toBe(screen.getByLabelText("Комментарий"))
    expect(checkbox.current).toBeInstanceOf(HTMLElement)
    expect(toggle.current).toBeInstanceOf(HTMLElement)
    expect(radio.current).toBeInstanceOf(HTMLElement)
  })

  it.each([false, true, ""] as const)("keeps the comment when error is %j", (error) => {
    render(
      <>
        <Checkbox label="Чекбокс" comment="Комментарий чекбокса" error={error} />
        <Textarea label="Поле" comment="Комментарий поля" error={error} />
      </>
    )
    expect(screen.getByText("Комментарий чекбокса")).toBeInTheDocument()
    expect(screen.getByText("Комментарий поля")).toBeInTheDocument()
  })

  it("keeps a placeholder on a textarea with a non-string label", () => {
    render(<Textarea label={<b>Комментарий</b>} aria-label="Поле" />)
    expect(screen.getByLabelText("Поле")).toHaveAttribute("placeholder", " ")
  })

  it("links the range caption to the thumb input", () => {
    render(<RangeInput defaultValue={50} comment="До 100 000 ₽" aria-label="Сумма" />)
    const caption = screen.getByText("До 100 000 ₽")
    const slider = screen.getByRole("slider")
    expect(slider.getAttribute("aria-describedby")).toBe(caption.id)
  })
})
