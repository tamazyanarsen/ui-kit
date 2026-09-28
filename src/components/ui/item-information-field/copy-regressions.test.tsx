import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider, Toaster } from "@/components/ui/toast-message"

import { ItemInformationField } from "./item-information-field"

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

function renderField(value: React.ReactNode, copyValue?: string) {
  return render(
    <ToastProvider>
      <ItemInformationField label="Счёт" value={value} copyValue={copyValue} copyable />
      <Toaster />
    </ToastProvider>
  )
}

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
  return writeText
}

describe("ItemInformationField: копирование", () => {
  it("без Clipboard API показывает ошибку, а не «Скопировано»", async () => {
    const user = userEvent.setup()
    // userEvent.setup() ставит свой буфер — убираем его ПОСЛЕ.
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined })
    renderField("40702810")

    await user.click(screen.getByRole("button", { name: "Копировать" }))

    expect(await screen.findByText("Не удалось скопировать")).toBeInTheDocument()
    expect(screen.queryByText("Скопировано в буфер обмена")).not.toBeInTheDocument()
  })

  it("значение-разметка копируется по видимому тексту, а не пустой строкой", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    renderField(<b>40702 810</b>)

    await user.click(screen.getByRole("button", { name: "Копировать" }))

    expect(writeText).toHaveBeenCalledWith("40702 810")
  })

  it("число копируется строкой", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    renderField(1200)

    await user.click(screen.getByRole("button", { name: "Копировать" }))

    expect(writeText).toHaveBeenCalledWith("1200")
  })

  it("разметка без текста — ошибка, а не ложный успех", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    renderField(<span aria-hidden="true" />)

    await user.click(screen.getByRole("button", { name: "Копировать" }))

    expect(writeText).not.toHaveBeenCalled()
    expect(await screen.findByText("Не удалось скопировать")).toBeInTheDocument()
  })
})
