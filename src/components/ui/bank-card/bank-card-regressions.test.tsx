import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider, Toaster } from "@/components/ui/toast-message"

import { BankCard } from "./bank-card"

function renderCard(props?: React.ComponentProps<typeof BankCard>) {
  const utils = render(
    <ToastProvider>
      <BankCard {...props} />
      <Toaster />
    </ToastProvider>
  )
  const card = utils.container.querySelector('[data-slot="bank-card"]') as HTMLElement
  return { ...utils, card }
}

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

describe("BankCard: регрессии", () => {
  it("Enter на «глазе» раскрывает номер, а не переворачивает карту", async () => {
    const user = userEvent.setup()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    renderCard({ type: "back", onTypeChange: vi.fn(), cardNumber: "2200 1111 2222 4498" })

    screen.getAllByLabelText("Показать и скопировать")[0].focus()
    await user.keyboard("{Enter}")

    expect(screen.getByText("2200 1111 2222 4498")).toBeInTheDocument()
  })

  it("в управляемом режиме сообщает о перевороте через onTypeChange", () => {
    const onTypeChange = vi.fn()
    const { card } = renderCard({ type: "face", onTypeChange })
    fireEvent.click(card)
    expect(onTypeChange).toHaveBeenCalledWith("back")
    fireEvent.click(screen.getByText("Показать реквизиты"))
    expect(onTypeChange).toHaveBeenLastCalledWith("back")
  })

  it("управляемая карта без onTypeChange не объявляет себя кнопкой", () => {
    const { card } = renderCard({ type: "face" })
    expect(card).not.toHaveAttribute("role")
    expect(card).not.toHaveAttribute("tabindex")
  })

  it("отвёрнутая сторона инертна — её кнопки вне порядка фокуса", () => {
    const { container, card } = renderCard()
    const face = container.querySelector('[data-slot="bank-card-face"]')
    const back = container.querySelector('[data-slot="bank-card-back"]')
    expect(back).toHaveAttribute("inert")
    expect(face).not.toHaveAttribute("inert")
    fireEvent.click(card)
    expect(face).toHaveAttribute("inert")
    expect(back).not.toHaveAttribute("inert")
  })

  it("без Clipboard API показывает ошибку, а не «скопирован»", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined })
    renderCard({ type: "back", onTypeChange: vi.fn() })

    fireEvent.click(screen.getAllByLabelText("Показать и скопировать")[0])

    expect(await screen.findByText("Не удалось скопировать")).toBeInTheDocument()
    expect(screen.queryByText("Номер карты скопирован")).not.toBeInTheDocument()
  })
})
