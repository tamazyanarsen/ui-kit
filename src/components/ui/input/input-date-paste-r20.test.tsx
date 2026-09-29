import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Input } from "./input"
import { DatePicker } from "@/components/ui/date-picker"

// Аудит 19: маска даты раскладывала вставленную строку по цифрам подряд —
// ISO «2026-01-10» становилось «20.26.0110», «1.1.2026» — «11.20.26», а
// DatePicker при уходе с поля молча отбрасывал такое значение.

const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement

describe("Маска даты: вставка в другом формате", () => {
  it.each([
    ["2026-01-10", "10.01.2026"],
    ["2026-01-10T12:30:00", "10.01.2026"],
    ["1.1.2026", "01.01.2026"],
    ["1/1/2026", "01.01.2026"],
    ["10.01.2026", "10.01.2026"],
  ])("вставка %s даёт %s", async (pasted, expected) => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.click(field("Дата"))
    await user.paste(pasted)
    expect(field("Дата").value).toBe(expected)
  })

  it("набор с клавиатуры не меняется", async () => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.type(field("Дата"), "10012026")
    expect(field("Дата").value).toBe("10.01.2026")
  })
})

describe("DatePicker: вставленная ISO-дата принимается", () => {
  it("после Tab — onChange с этой датой", async () => {
    const user = userEvent.setup()
    const changes: (Date | null)[] = []
    render(<DatePicker onChange={(date) => changes.push(date)} />)
    await user.click(field("Дата"))
    await user.paste("2026-01-10")
    await user.tab()
    const last = changes.at(-1)
    expect(last).toBeInstanceOf(Date)
    expect([last!.getFullYear(), last!.getMonth(), last!.getDate()]).toEqual([2026, 0, 10])
  })
})
