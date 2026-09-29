import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ItemInformationField } from "./item-information-field"

// r25: значение-строка из пропса не обрезалось по краям (значение из DOM
// обрезалось), поэтому « 1 200 ₽ » не узнавалось числом и копировалось с
// пробелами и знаком. Плюс число 0 в подсказках.

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

describe("ItemInformationField: крайние пробелы при копировании", () => {
  it("« 1 200 ₽ » копируется как «1200»", async () => {
    expect(await copy(" 1 200 ₽ ")).toHaveBeenCalledWith("1200")
  })

  it("номер счёта с пробелами по краям копируется цифрами", async () => {
    expect(await copy(" 40702 810 7 00590062544 ")).toHaveBeenCalledWith(
      "40702810700590062544"
    )
  })

  it("свободный текст копируется обрезанным", async () => {
    expect(await copy("  Иванов Иван  ")).toHaveBeenCalledWith("Иванов Иван")
  })
})

describe("ItemInformationField: подсказки", () => {
  it("labelInfo = 0 показывает значок, а не голый ноль", () => {
    render(<ItemInformationField label="Поле" value="Значение" labelInfo={0} />)
    expect(screen.getAllByRole("button", { name: "Информация" })).toHaveLength(1)
  })
})
