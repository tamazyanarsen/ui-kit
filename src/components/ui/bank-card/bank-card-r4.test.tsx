import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { BankCard } from "./bank-card"

// Итоговая проверка №3: BankCard безусловно звал `useToast()`, а тот
// бросает без `<ToastProvider>` — карта роняла всё дерево, даже когда
// реквизиты не показываются и копировать нечего.

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

describe("BankCard без ToastProvider", () => {
  it("рисуется без реквизитов", () => {
    const { container } = render(<BankCard showRequisites={false} />)
    expect(container.querySelector('[data-slot="bank-card"]')).not.toBeNull()
  })

  it("раскрывает и копирует номер без провайдера, не падая", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    render(<BankCard type="back" onTypeChange={() => {}} cardNumber="2200 1111 2222 4498" />)

    fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[0])
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith("2200111122224498"))
    expect(screen.getByText("2200 1111 2222 4498")).toBeInTheDocument()
  })
})
