import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Круг 26: время вне 00:00–23:59, вставленное целым куском, маска раскладывала
// по блокам и превращала в другое правдоподобное («24:00» → «02:40»,
// «25:61» → «02:50»). Теперь такая вставка не принимается.

const field = () => screen.getByLabelText("Время") as HTMLInputElement

describe("Маска времени: вставка невозможного времени", () => {
  it.each(["24:00", "25:61", "12:60", "2460", "23:99", "24.00", "24 00"])(
    "вставка %s оставляет поле пустым",
    async (pasted) => {
      const user = userEvent.setup()
      render(<Input label="Время" mask="time" />)
      await user.click(field())
      await user.paste(pasted)
      expect(field().value).toBe("")
    }
  )

  it.each([
    ["23:59", "23:59"],
    ["00:00", "00:00"],
    ["1230", "12:30"],
    ["9:5", "09:5"],
    ["1.05", "01:05"],
  ])("вставка допустимого %s даёт %s", async (pasted, expected) => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.click(field())
    await user.paste(pasted)
    expect(field().value).toBe(expected)
  })

  it("значение снаружи «25:61» поле не показывает", () => {
    render(<Input label="Время" mask="time" value="25:61" onChange={() => {}} />)
    expect(field().value).toBe("")
  })

  it("набор с клавиатуры не затронут: «1230» даёт 12:30", async () => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.type(field(), "1230")
    expect(field().value).toBe("12:30")
  })
})
