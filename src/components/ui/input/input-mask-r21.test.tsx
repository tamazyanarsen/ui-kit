import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"

// Аудит 20: двоеточие, набранное после одной цифры часа, маска отбрасывала
// (блок часов ещё не заполнен), и следующие цифры уходили в часы — «1:05»
// становилось «10:5», «0:30» — «03:0». Вставка даты с годом в начале через
// «/» или «.» («2026/01/10») раскладывалась по цифрам подряд.

const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement

describe("Маска времени: двоеточие после одной цифры часа", () => {
  it.each([
    ["1:05", "01:05"],
    ["0:30", "00:30"],
    ["2:15", "02:15"],
    ["1:30", "01:30"],
  ])("набор %s даёт %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.type(field("Время"), typed)
    expect(field("Время").value).toBe(expected)
  })

  it("вставка 1:5 даёт 01:5", async () => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.click(field("Время"))
    await user.paste("1:5")
    expect(field("Время").value).toBe("01:5")
  })

  // Прежнее поведение: дополнение 3–9 и отказ от недопустимых цифр.
  it.each([
    ["930", "09:30"],
    ["9:05", "09:05"],
    ["2359", "23:59"],
    ["24", "2"],
  ])("прежнее: %s даёт %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Время" mask="time" />)
    await user.type(field("Время"), typed)
    expect(field("Время").value).toBe(expected)
  })
})

describe("Маска даты: вставка с годом в начале", () => {
  it.each([
    ["2026/01/10", "10.01.2026"],
    ["2026.01.10", "10.01.2026"],
    ["2026/1/5", "05.01.2026"],
  ])("вставка %s даёт %s", async (pasted, expected) => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.click(field("Дата"))
    await user.paste(pasted)
    expect(field("Дата").value).toBe(expected)
  })
})
