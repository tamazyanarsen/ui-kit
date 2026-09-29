import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "@/components/ui/date-picker"

import { Input } from "./input"

// Круг 26: маска даты принимала «45.13.2024» и отдавала родителю
// невозможную дату, хотя маска времени держит диапазоны. Теперь день 01–31 и
// месяц 01–12 проверяются на вводе, а первая цифра 4–9 (день) и 2–9 (месяц)
// получает ведущий ноль.

const field = () => screen.getByLabelText("Дата") as HTMLInputElement

async function typeInto(text: string) {
  const user = userEvent.setup()
  render(<Input label="Дата" mask="date" />)
  await user.type(field(), text)
}

describe("Маска даты: диапазоны дня и месяца", () => {
  it.each([
    ["32", "3"],
    ["1013", "10.1"],
    ["3112", "31.12"],
    ["00", "0"],
    ["4", "04"],
    ["1.13", "01.1"],
    ["5.5.2024", "05.05.2024"],
    ["452", "04.05.2"],
  ])("набор %s даёт %s", async (typed, expected) => {
    await typeInto(typed)
    expect(field().value).toBe(expected)
  })

  it.each([
    ["31122024", "31.12.2024"],
    ["01012024", "01.01.2024"],
    ["10.01.2026", "10.01.2026"],
    ["29.02.2024", "29.02.2024"],
  ])("нормальная дата %s остаётся %s", async (typed, expected) => {
    await typeInto(typed)
    expect(field().value).toBe(expected)
  })

  it.each(["45.13.2024", "00.00.2024", "32.01.2024", "2026-13-45", "45132024"])(
    "вставка невозможной даты %s не оставляет ничего",
    async (pasted) => {
      const user = userEvent.setup()
      render(<Input label="Дата" mask="date" />)
      await user.click(field())
      await user.paste(pasted)
      expect(field().value).toBe("")
    }
  )

  it("значение снаружи «45.13.2024» поле не показывает", () => {
    render(<Input label="Дата" mask="date" value="45.13.2024" onChange={() => {}} />)
    expect(field().value).toBe("")
  })

  it("DatePicker: вставка «45.13.2024» не даёт onChange и не оставляет текста", async () => {
    const user = userEvent.setup()
    const dates: unknown[] = []
    render(<DatePicker label="Дата" onChange={(d) => dates.push(d)} />)
    const input = screen.getByRole("textbox") as HTMLInputElement
    await user.click(input)
    await user.paste("45.13.2024")
    expect(dates).toEqual([])
    expect(input.value).toBe("")
  })
})
