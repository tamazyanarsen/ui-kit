import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpInput } from "./input"

// Цифры кода рисует слой ячеек, а не само поле (мастер: ячейки 40px, шаг 56/48).
// Слой обязан показывать ровно то, что в поле, — в том числе когда значение
// переписали мимо React.
const shown = (root: HTMLElement) =>
  Array.from(root.querySelectorAll("[data-otp-cell]"), (cell) => cell.textContent).join("")

describe("OtpInput: слой ячеек", () => {
  it("показывает набранные цифры и убирает нецифры и лишнее", async () => {
    const user = userEvent.setup()
    const { container } = render(<OtpInput aria-label="Код" />)
    await user.type(screen.getByLabelText("Код"), "1a2-3456789")
    expect(shown(container)).toBe("123456")
  })

  it("пустое поле — ячеек нет, показывается placeholder поля", () => {
    const { container } = render(<OtpInput aria-label="Код" />)
    expect(shown(container)).toBe("")
    expect(screen.getByLabelText("Код")).toHaveAttribute("placeholder", "Введите код из СМС")
  })

  it("значение снаружи и defaultValue доезжают до ячеек", () => {
    const { container, rerender } = render(<OtpInput aria-label="Код" value="1234" onChange={() => {}} />)
    expect(shown(container)).toBe("1234")
    rerender(<OtpInput aria-label="Код" value="987" onChange={() => {}} />)
    expect(shown(container)).toBe("987")
  })

  it("запись value мимо React (reset формы) очищает ячейки", async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(<OtpInput aria-label="Код" ref={ref} />)
    await user.click(screen.getByLabelText("Код"))
    await user.paste("123456")
    expect(shown(container)).toBe("123456")
    await act(async () => {
      ref.current!.value = ""
    })
    expect(shown(container)).toBe("")
  })

  it("каретка стоит у границы ячеек по позиции в поле", async () => {
    const user = userEvent.setup()
    const { container } = render(<OtpInput aria-label="Код" defaultValue="1234" />)
    const input = screen.getByLabelText("Код") as HTMLInputElement
    await user.click(input)
    await act(async () => {
      input.setSelectionRange(2, 2)
      document.dispatchEvent(new Event("selectionchange"))
    })
    const cells = Array.from(container.querySelectorAll("[data-otp-cell]"))
    const withCaret = cells.findIndex((cell) => cell.querySelector("[data-slot=otp-caret]"))
    expect(withCaret).toBe(2)
  })
})
