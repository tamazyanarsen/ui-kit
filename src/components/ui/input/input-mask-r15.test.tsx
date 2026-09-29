import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"
import { formatWithMask } from "./mask"

// Аудит 14: ведущая «8» у телефона уходила в код оператора
// («89123456789» → «+7 891 234-56-78», последняя цифра терялась), а маска
// времени не принимала час одной цифрой («930» → «0»).

function field(label: string) {
  return screen.getByLabelText(label) as HTMLInputElement
}

describe("Маска телефона: ведущая 8 — префикс, а не код", () => {
  it.each([
    ["89123456789"],
    ["8 (912) 345-67-89"],
    ["+7 (912) 345-67-89"],
    ["79123456789"],
    ["9123456789"],
  ])("вставка %s даёт +7 912 345-67-89", async (pasted) => {
    const user = userEvent.setup()
    render(<Input label="Телефон" mask="phone" />)
    await user.click(field("Телефон"))
    await user.paste(pasted)
    expect(field("Телефон").value).toBe("+7 912 345-67-89")
  })

  // Сверка r15: набор с клавиатуры не нормализуется — по одной цифре не
  // отличить префикс от кода на 8, а лишняя цифра в конце полного номера
  // сдвигала его в другой номер («+7 800 123-45-67» → «+7 001 234-56-78»).
  it.each([
    ["80012345678", "+7 800 123-45-67"],
    ["81234567890", "+7 812 345-67-89"],
  ])("набор полного номера %s с лишней цифрой оставляет его прежним", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Телефон" mask="phone" />)
    await user.type(field("Телефон"), typed)
    expect(field("Телефон").value).toBe(expected)
  })

  it("десятизначный номер с кодом на 8 набирается как есть", async () => {
    const user = userEvent.setup()
    render(<Input label="Телефон" mask="phone" />)
    await user.type(field("Телефон"), "8123456789")
    expect(field("Телефон").value).toBe("+7 812 345-67-89")
  })

  it("значение снаружи с 8 тоже нормализуется", () => {
    expect(formatWithMask("phone", "89123456789")).toBe("+7 912 345-67-89")
  })
})

describe("Маска времени: час одной цифрой дополняется нулём", () => {
  it.each([
    ["930", "09:30"],
    ["0930", "09:30"],
    ["1230", "12:30"],
    ["2359", "23:59"],
    ["97", "09:07"],
    // Только дополнение: недопустимая цифра отвергается, как и раньше, а
    // не подменяется на 23 (сверка r15: `autofix: "pad"` давал «24» → «23»).
    ["24", "2"],
    ["25", "2"],
    ["2530", "23:0"],
    ["2460", "20"],
  ])("набор %s даёт %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.type(field("Время"), typed)
    expect(field("Время").value).toBe(expected)
  })
})
