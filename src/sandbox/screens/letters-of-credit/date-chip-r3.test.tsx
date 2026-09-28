import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "@/components/ui/toast-message"

import { LETTERS_OF_CREDIT } from "./data"
import { LettersOfCreditScreen } from "./screen"

// Итоговая проверка кита: чип «Дата» считался в «Выбрано фильтров», но
// отбор его не читал — «Результатов» не менялось.

const resultCount = () => screen.getByText("Результатов:").nextElementSibling!.textContent

async function applyDate(value: string) {
  const user = userEvent.setup()
  const chip = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="filter"]')
  ).find((element) => element.textContent?.includes("Дата"))!
  await user.click(chip)
  await user.type(await screen.findByPlaceholderText("Введите значение"), value)
  await user.click(screen.getByRole("button", { name: /Применить/ }))
}

describe("реестр аккредитивов: чип «Дата»", () => {
  it("отбирает строки по дате в виде «дд.мм.гггг»", async () => {
    render(
      <ToastProvider>
        <LettersOfCreditScreen />
      </ToastProvider>
    )
    const [year, month, day] = LETTERS_OF_CREDIT[0].date.split("-")
    const expected = LETTERS_OF_CREDIT.filter(
      (row) => row.date === `${year}-${month}-${day}`
    ).length

    await applyDate(`${day}.${month}.${year}`)

    expect(resultCount()).toBe(String(expected))
    expect(expected).toBeLessThan(LETTERS_OF_CREDIT.length)
  }, 20000)
})
