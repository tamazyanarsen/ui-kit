import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Круг 27: (1) вставка «-12» в сумму давала «12» — другое положительное
// число; (2) вставка «abc» в телефон и стирание единственной цифры
// оставляли «+7 », и `required` видел значение; (3) набранное «007»
// показывалось «007», вставленное — «7».

const field = () => screen.getByLabelText("X") as HTMLInputElement

describe("Сумма", () => {
  it.each(["-12", " -5", "−7", "-0"])("вставка %j не принимается", async (text) => {
    const user = userEvent.setup()
    render(<Input label="X" mask="amount" />)
    await user.click(field())
    await user.paste(text)
    expect(field().value).toBe("")
  })

  it("вставка положительного числа не затронута", async () => {
    const user = userEvent.setup()
    render(<Input label="X" mask="amount" />)
    await user.click(field())
    await user.paste("1234")
    expect(field().value).toBe("1 234")
  })

  it("набранное «007» показывается как «7», «00» — как «0»", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Input label="X" mask="amount" />)
    await user.type(field(), "007")
    expect(field().value).toBe("7")
    unmount()
    render(<Input label="X" mask="amount" />)
    await user.type(field(), "00")
    expect(field().value).toBe("0")
  })

  it("«0», набранный в начале числа, не уводит каретку: «5», Home, «0», «3» → «35»", async () => {
    const user = userEvent.setup()
    render(<Input label="X" mask="amount" />)
    await user.type(field(), "5")
    await user.keyboard("{Home}0")
    expect(field().value).toBe("5")
    expect(field().selectionStart).toBe(0)
    await user.keyboard("3")
    expect(field().value).toBe("35")
  })

  it("значение снаружи «-12» поле не показывает (минимум 0), а не делает «12»", () => {
    render(<Input label="X" mask="amount" value="-12" onChange={() => {}} />)
    expect(field().value).toBe("")
  })

  it("набор «100» и «1 000 500» не затронут", async () => {
    const user = userEvent.setup()
    render(<Input label="X" mask="amount" />)
    await user.type(field(), "1000500")
    expect(field().value).toBe("1 000 500")
  })
})

describe("Телефон: пустое поле — это пустая строка", () => {
  it("вставка «abc» оставляет поле пустым", async () => {
    const user = userEvent.setup()
    render(<Input label="X" mask="phone" />)
    await user.click(field())
    await user.paste("abc")
    expect(field().value).toBe("")
  })

  it("стирание единственной цифры опустошает поле", async () => {
    const user = userEvent.setup()
    render(<Input label="X" mask="phone" />)
    await user.type(field(), "9")
    expect(field().value).toBe("+7 9")
    await user.keyboard("{Backspace}")
    expect(field().value).toBe("")
  })

  it("обычный ввод и вставка номера не затронуты", async () => {
    const user = userEvent.setup()
    render(<Input label="X" mask="phone" />)
    await user.type(field(), "9123456789")
    expect(field().value).toBe("+7 912 345-67-89")
  })
})
