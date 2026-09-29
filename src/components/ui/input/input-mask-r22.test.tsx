import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Аудит 21: в сумме (без копеек) набранные «,» или «.» маска отбрасывала, а
// следующие цифры дописывала к целой части — «1234,56» становилось
// «123 456», сумма молча вырастала в 100 раз. Во времени после одной цифры
// часа разделителем работало только «:» — «1.05» давало «10:5».

const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement

describe("Маска суммы: разделитель копеек при наборе", () => {
  it.each([
    ["1234,56", "1 234"],
    ["1234.56", "1 234"],
    ["100,5", "100"],
  ])("набор %s даёт %s, а не сумму в 100 раз больше", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Сумма" mask="amount" />)
    await user.type(field("Сумма"), typed)
    expect(field("Сумма").value).toBe(expected)
  })

  it("после стирания цифры набор снова принимается", async () => {
    const user = userEvent.setup()
    render(<Input label="Сумма" mask="amount" />)
    await user.type(field("Сумма"), "1234,5{Backspace}7")
    expect(field("Сумма").value).toBe("1 237")
  })

  it("вставка, как и раньше, отбрасывает копейки", async () => {
    const user = userEvent.setup()
    render(<Input label="Сумма" mask="amount" />)
    await user.click(field("Сумма"))
    await user.paste("1234,56")
    expect(field("Сумма").value).toBe("1 234")
  })

  // Проверка правок r22: запрет после разделителя переживал уход из поля —
  // «1234,», Tab, возврат и «5» молча не принимали цифру.
  it("после ухода из поля и возврата цифра принимается", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Input label="Сумма" mask="amount" />
        <button type="button">Дальше</button>
      </>
    )
    await user.type(field("Сумма"), "1234,")
    await user.tab()
    await user.click(field("Сумма"))
    await user.keyboard("{End}5")
    expect(field("Сумма").value).toBe("12 345")
  })

  it("обычный набор без разделителя прежний", async () => {
    const user = userEvent.setup()
    render(<Input label="Сумма" mask="amount" />)
    await user.type(field("Сумма"), "1234567")
    expect(field("Сумма").value).toBe("1 234 567")
  })
})

describe("Маска времени: «.», «-» и пробел после одной цифры часа", () => {
  it.each([
    ["1.05", "01:05"],
    ["0 30", "00:30"],
    ["2-15", "02:15"],
  ])("набор %s даёт %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.type(field("Время"), typed)
    expect(field("Время").value).toBe(expected)
  })

  it.each([
    ["1-05", "01:05"],
    ["1.05", "01:05"],
  ])("вставка %s даёт %s", async (pasted, expected) => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.click(field("Время"))
    await user.paste(pasted)
    expect(field("Время").value).toBe(expected)
  })

  it("прежнее: «9.30» — 09:30, «12:30» — 12:30", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Input label="А" mask="time" />
        <Input label="Б" mask="time" />
      </>
    )
    await user.type(field("А"), "9.30")
    await user.type(field("Б"), "12:30")
    expect(field("А").value).toBe("09:30")
    expect(field("Б").value).toBe("12:30")
  })
})
