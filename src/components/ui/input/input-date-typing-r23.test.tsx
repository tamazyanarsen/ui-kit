import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "@/components/ui/date-picker"

import { Input } from "./input"

// Аудит 22: разделитель после одной цифры дня или месяца маска даты
// отбрасывала (блок ещё не заполнен), и цифры уезжали в соседний блок —
// «10.1.2026» становилось «10.12.026», «1.1.2026» — «11.20.26», а DatePicker
// при уходе с поля молча терял дату.

const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement

describe("Маска даты: разделитель после одной цифры дня или месяца", () => {
  it.each([
    ["10.1.2026", "10.01.2026"],
    ["1.10.2026", "01.10.2026"],
    ["1.1.2026", "01.01.2026"],
    ["1/1/2026", "01.01.2026"],
    ["1-1-2026", "01.01.2026"],
    ["01.1.2026", "01.01.2026"],
  ])("набор %s даёт %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.type(field("Дата"), typed)
    expect(field("Дата").value).toBe(expected)
  })

  it.each([
    ["10012026", "10.01.2026"],
    ["10.01.2026", "10.01.2026"],
  ])("прежнее: набор %s даёт %s", async (typed, expected) => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.type(field("Дата"), typed)
    expect(field("Дата").value).toBe(expected)
  })

  it("прежнее: вставка «1.1.2026» даёт 01.01.2026", async () => {
    const user = userEvent.setup()
    render(<Input label="Дата" mask="date" />)
    await user.click(field("Дата"))
    await user.paste("1.1.2026")
    expect(field("Дата").value).toBe("01.01.2026")
  })
})

describe("DatePicker: дата, набранная без ведущего нуля", () => {
  it("«10.1.2026» и Tab — onChange(10.01.2026)", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DatePicker label="Дата" onChange={onChange} />)
    const input = screen.getByRole("textbox") as HTMLInputElement
    await user.click(input)
    await user.keyboard("10.1.2026")
    await user.tab()
    expect(input.value).toBe("10.01.2026")
    const last = onChange.mock.calls.at(-1)?.[0] as Date
    expect(last).toBeInstanceOf(Date)
    expect([last.getFullYear(), last.getMonth(), last.getDate()]).toEqual([2026, 0, 10])
  })
})
