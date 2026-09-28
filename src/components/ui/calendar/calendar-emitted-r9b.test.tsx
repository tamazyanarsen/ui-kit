import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Calendar } from "./calendar"

// Проверка правок r9: метка «своего» значения жила, пока значение не
// вернётся. Родитель, отклонивший клик, оставлял её навсегда, и та же дата,
// позже пришедшая снаружи, не переводила пролиставший календарь к себе.

describe("Calendar: отклонённый клик не глушит внешнее значение", () => {
  it("после листания дата снаружи переводит календарь к себе", async () => {
    const user = userEvent.setup()
    const march = new Date(2025, 2, 1)
    const { rerender } = render(
      <Calendar mode="single" footer={false} value={march} onChange={() => {}} />
    )
    expect(screen.getByText("Март")).toBeInTheDocument()
    // Родитель клик по 15 марта отклоняет — value остаётся 1 марта.
    await user.click(screen.getByRole("button", { name: "15" }))
    await user.click(screen.getByRole("button", { name: "Вперёд" }))
    await user.click(screen.getByRole("button", { name: "Вперёд" }))
    expect(screen.getByText("Май")).toBeInTheDocument()

    rerender(
      <Calendar mode="single" footer={false} value={new Date(2025, 2, 15)} onChange={() => {}} />
    )
    expect(screen.getByText("Март")).toBeInTheDocument()
  })
})
