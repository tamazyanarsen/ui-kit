import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ItemInformationField } from "./item-information-field"

// Аудит 23: номер счёта «40702 810 7 00590062544» копировался с пробелами и не
// вставлялся в поле, где ждут 20 цифр; сумма «19 009,51 ₽» — с пробелами и
// знаком. BankCard, ячейка таблицы и поля ввода разделители уже снимают.

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard")

afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
  return writeText
}

async function copy(value: React.ReactNode, copyValue?: string) {
  const user = userEvent.setup()
  const writeText = mockClipboard()
  render(<ItemInformationField label="Поле" value={value} copyValue={copyValue} copyable />)
  await user.click(screen.getByRole("button", { name: "Копировать" }))
  return writeText
}

describe("ItemInformationField: копирование без разделителей", () => {
  it.each([
    ["40702 810 7 00590062544", "40702810700590062544"],
    ["19 009,51 ₽", "19009,51"],
    ["19 009,51 ₽", "19009,51"],
    ["1 200", "1200"],
  ])("число «%s» копируется как «%s»", async (value, expected) => {
    expect(await copy(value)).toHaveBeenCalledWith(expected)
  })

  it("номер в разметке — тоже без пробелов", async () => {
    expect(await copy(<b>40702 810 7 00590062544</b>)).toHaveBeenCalledWith(
      "40702810700590062544"
    )
  })

  it("свободный текст, дата и телефон копируются как есть", async () => {
    expect(await copy("ООО «Ромашка»")).toHaveBeenCalledWith("ООО «Ромашка»")
  })

  it.each(["10.01.2026", "+7 912 345-67-89", "ул. Ленина, 12"])(
    "«%s» не меняется",
    async (value) => {
      expect(await copy(value)).toHaveBeenCalledWith(value)
    }
  )

  it("явный copyValue — слово в слово", async () => {
    expect(await copy("40702 810", "40702 810")).toHaveBeenCalledWith("40702 810")
  })
})
