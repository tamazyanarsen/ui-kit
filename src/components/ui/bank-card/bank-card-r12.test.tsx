import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { BankCard } from "./bank-card"

// Аудит 11: раскрытие сбрасывалось только при смене стороны. Экземпляр, в
// который пришла другая карта, сразу показывал её полный номер и CVC.

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

function stubClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
}

describe("BankCard: раскрытие сбрасывается при смене реквизитов", () => {
  it("новая карта в том же экземпляре приходит под маской", async () => {
    stubClipboard()
    const first = "2200 1111 1111 1111"
    const second = "2200 2222 2222 2222"
    const { rerender } = render(
      <BankCard type="back" onTypeChange={() => {}} cardNumber={first} last4="1111" />
    )
    await act(async () => {
      fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[0])
    })
    expect(screen.queryAllByText(first).length).toBeGreaterThan(0)

    rerender(<BankCard type="back" onTypeChange={() => {}} cardNumber={second} last4="2222" />)
    expect(screen.queryAllByText(second)).toHaveLength(0)
  })

  it("новый CVC приходит под маской", async () => {
    stubClipboard()
    const { rerender } = render(<BankCard type="back" onTypeChange={() => {}} cvc="123" />)
    await act(async () => {
      fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[1])
    })
    expect(screen.queryAllByText("123").length).toBeGreaterThan(0)

    rerender(<BankCard type="back" onTypeChange={() => {}} cvc="987" />)
    expect(screen.queryAllByText("987")).toHaveLength(0)
  })
})
