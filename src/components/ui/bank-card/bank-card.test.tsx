import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { ToastProvider } from "@/components/ui/toast-message"

import { BankCard } from "./bank-card"

function renderCard(props?: React.ComponentProps<typeof BankCard>) {
  const utils = render(
    <ToastProvider>
      <BankCard {...props} />
    </ToastProvider>
  )
  const card = utils.container.querySelector('[data-slot="bank-card"]') as HTMLElement
  return { ...utils, card }
}

describe("BankCard", () => {
  it("renders the balance and masked card number on the face", () => {
    renderCard({ balance: "1 000 ₽", last4: "1234" })
    expect(screen.getByText("1 000 ₽")).toBeInTheDocument()
    expect(screen.getByText("· 1234")).toBeInTheDocument()
  })

  it("flips to the back when the card itself is clicked", () => {
    const { card } = renderCard()
    fireEvent.click(card)
    expect(screen.getByText("CVC/CVV")).toBeInTheDocument()
  })

  it("flips to the back via the 'Показать реквизиты' link", () => {
    renderCard()
    fireEvent.click(screen.getByText("Показать реквизиты"))
    expect(screen.getByText("CVC/CVV")).toBeInTheDocument()
  })

  it("reveals and copies the card number", () => {
    const writeText = vi.fn()
    Object.assign(navigator, { clipboard: { writeText } })
    renderCard({ cardNumber: "2200 1111 2222 4498" })

    fireEvent.click(screen.getByText("Показать реквизиты"))
    fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[0])
    expect(screen.getByText("2200 1111 2222 4498")).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith("2200111122224498")
  })
})
