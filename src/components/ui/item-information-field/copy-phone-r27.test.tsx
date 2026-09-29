import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ItemInformationField } from "./item-information-field"

// r27: «+7 900 123 45 67» узнавался числом и копировался без пробелов.
// Правило r24: телефоны копируются как есть; суммы и счета — цифрами.

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

async function copy(value: string) {
  const user = userEvent.setup()
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
  render(<ItemInformationField label="Поле" value={value} copyable />)
  await user.click(screen.getByRole("button", { name: "Копировать" }))
  return writeText
}

describe("ItemInformationField: телефон при копировании", () => {
  it.each(["+7 900 123 45 67", "8 900 123 45 67", "+7 900 123 45 67".replace(/ /g, " ")])(
    "%s копируется как есть",
    async (phone) => {
      expect(await copy(phone)).toHaveBeenCalledWith(phone)
    }
  )

  it.each([
    ["+1 200 000 ₽", "+1200000"],
    ["1 200 000", "1200000"],
    ["40702 810 7 00590062544", "40702810700590062544"],
  ])("%s по-прежнему цифрами", async (shown, copied) => {
    expect(await copy(shown)).toHaveBeenCalledWith(copied)
  })
})
