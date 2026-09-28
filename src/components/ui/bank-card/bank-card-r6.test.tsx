import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { ToastProvider, Toaster } from "@/components/ui/toast-message"

import { BankCard } from "./bank-card"

// Аудит r6: тост «Номер карты скопирован» уходил в центр уведомлений
// (`collected` по умолчанию), хотя это отклик системы, как у CopyButton
// (дизайн-чек от 08.09, замечание 15).

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

function renderCard() {
  return render(
    <ToastProvider>
      <BankCard type="back" onTypeChange={() => {}} cardNumber="2200 1111 2222 4498" />
      <Toaster />
    </ToastProvider>
  )
}

const toast = () => document.querySelector('[data-slot="toast"]')

describe("BankCard: тосты копирования — transient", () => {
  it("успешное копирование", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    const { getAllByLabelText } = renderCard()
    fireEvent.click(getAllByLabelText("Показать и скопировать")[0])
    await vi.waitFor(() => expect(toast()).not.toBeNull())
    expect(toast()!.getAttribute("data-behavior")).toBe("transient")
  })

  it("ошибка копирования", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("нет"))
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    const { getAllByLabelText } = renderCard()
    fireEvent.click(getAllByLabelText("Показать и скопировать")[0])
    await vi.waitFor(() => expect(toast()).not.toBeNull())
    expect(toast()!.getAttribute("data-behavior")).toBe("transient")
  })
})
