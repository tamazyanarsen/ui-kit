import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DatePicker } from "./date-picker"

// Седьмой проход: фокус в календаре должен вставать на день-остановку Tab
// сетки (APG «Date Picker Dialog»). Раньше поиск шёл по `data-selected`, а у
// диапазона его нет ни у одного дня, и открытие с клавиатуры ставило фокус
// на кнопку «Назад» шапки.

const RANGE: [Date, Date] = [new Date(2026, 4, 10), new Date(2026, 4, 20)]
const focusedDate = () => (document.activeElement as HTMLElement | null)?.dataset.date

describe("DatePicker: фокус на дне-остановке сетки", () => {
  it("range, календарь уже открыт: ArrowDown — на начало диапазона", async () => {
    const user = userEvent.setup()
    render(<DatePicker mode="range" rangeValue={RANGE} />)
    const field = screen.getByRole("textbox")

    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })
    field.focus()
    await user.keyboard("{ArrowDown}")

    await waitFor(() => expect(focusedDate()).toBe("2026-5-10"))
  })

  it("range: открытие стрелкой вниз ставит фокус на начало диапазона", async () => {
    const user = userEvent.setup()
    render(<DatePicker mode="range" rangeValue={RANGE} />)
    screen.getByRole("textbox").focus()
    await user.keyboard("{ArrowDown}")

    await waitFor(() => expect(focusedDate()).toBe("2026-5-10"))
  })

  it("single: открытие стрелкой вниз ставит фокус на выбранный день", async () => {
    const user = userEvent.setup()
    render(<DatePicker value={new Date(2026, 4, 15)} />)
    screen.getByLabelText("Дата").focus()
    await user.keyboard("{ArrowDown}")

    await waitFor(() => expect(focusedDate()).toBe("2026-5-15"))
  })

  it("single: открытие значком ставит фокус на выбранный день", async () => {
    const user = userEvent.setup()
    render(<DatePicker value={new Date(2026, 4, 15)} />)
    await user.click(screen.getByRole("button", { name: "Открыть календарь" }))

    await waitFor(() => expect(focusedDate()).toBe("2026-5-15"))
  })

  it("single: клик по полю оставляет фокус в поле", async () => {
    const user = userEvent.setup()
    render(<DatePicker value={new Date(2026, 4, 15)} />)
    const field = screen.getByLabelText("Дата")
    await user.click(field)
    await screen.findByRole("button", { name: "Применить" })

    expect(document.activeElement).toBe(field)
  })
})
