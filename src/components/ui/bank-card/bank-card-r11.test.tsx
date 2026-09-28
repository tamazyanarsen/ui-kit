import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { BankCard } from "./bank-card"

// Аудит r11: раскрытый номер карты оставался раскрытым после ухода с
// оборота — вернувшись, пользователь видел полный номер без действия.

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

const NUMBER = "2200 1234 5678 4498"
const shown = () => screen.queryAllByText(NUMBER).length > 0

function stubClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
}

describe("BankCard: раскрытие сбрасывается при смене стороны", () => {
  it("переворот туда и обратно возвращает маску", async () => {
    stubClipboard()
    const { container } = render(<BankCard cardNumber={NUMBER} />)
    fireEvent.click(screen.getByRole("button", { name: "Показать реквизиты" }))
    await act(async () => {
      fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[0])
    })
    expect(shown()).toBe(true)

    const card = container.querySelector('[data-slot="bank-card"]') as HTMLElement
    fireEvent.click(card)
    fireEvent.click(screen.getByRole("button", { name: "Показать реквизиты" }))
    expect(shown()).toBe(false)
  })

  it("внешняя смена type тоже возвращает маску", async () => {
    stubClipboard()
    const { rerender } = render(
      <BankCard type="back" onTypeChange={() => {}} cardNumber={NUMBER} />
    )
    await act(async () => {
      fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[0])
    })
    expect(shown()).toBe(true)
    rerender(<BankCard type="face" onTypeChange={() => {}} cardNumber={NUMBER} />)
    rerender(<BankCard type="back" onTypeChange={() => {}} cardNumber={NUMBER} />)
    expect(shown()).toBe(false)
  })
})
