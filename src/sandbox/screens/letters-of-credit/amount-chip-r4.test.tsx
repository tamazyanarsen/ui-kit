import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "@/components/ui/toast-message"

import { amountQuery, matchesAmount } from "./amount-filter"
import { LETTERS_OF_CREDIT } from "./data"
import { LettersOfCreditScreen } from "./screen"

// Итоговая проверка №3: чип «Сумма» выбрасывал из ввода всё, кроме цифр, —
// «1 200 000,00» становилось «120000000» и не находило ни одной строки. Ввод
// без цифр пропускал все строки, но чип считался применённым.

const resultCount = () => screen.getByText("Результатов:").nextElementSibling!.textContent
const appliedCount = () =>
  screen.getByText("Выбрано фильтров:").nextElementSibling!.textContent

async function applyAmount(value: string) {
  const user = userEvent.setup()
  const chip = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="filter"]')
  ).find((element) => element.textContent?.includes("Сумма"))!
  await user.click(chip)
  await user.type(await screen.findByPlaceholderText("Введите значение"), value)
  await user.click(screen.getByRole("button", { name: /Применить/ }))
}

describe("amountQuery / matchesAmount", () => {
  it("сумма, набранная как в колонке, совпадает", () => {
    expect(matchesAmount(1_200_000, amountQuery("1 200 000,00")!)).toBe(true)
    expect(matchesAmount(1_200_000, amountQuery("1200000")!)).toBe(true)
    expect(matchesAmount(1_200_000, amountQuery("1 200 000")!)).toBe(true)
    expect(matchesAmount(1_200_000, amountQuery("1 300 000")!)).toBe(false)
  })

  it("ввод без цифр — фильтра нет", () => {
    expect(amountQuery("абв")).toBeNull()
    expect(amountQuery("")).toBeNull()
  })
})

describe("реестр аккредитивов: чип «Сумма»", () => {
  it("находит строки по сумме в виде «1 200 000,00»", async () => {
    render(
      <ToastProvider>
        <LettersOfCreditScreen />
      </ToastProvider>
    )
    const amount = LETTERS_OF_CREDIT[0].amount
    const expected = LETTERS_OF_CREDIT.filter((row) => row.amount === amount).length
    const [whole, cents] = amount.toFixed(2).split(".")
    const shown = `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${cents}`

    await applyAmount(shown)

    expect(resultCount()).toBe(String(expected))
  }, 20000)

  it("ввод без цифр не считается применённым фильтром", async () => {
    render(
      <ToastProvider>
        <LettersOfCreditScreen />
      </ToastProvider>
    )
    await applyAmount("абв")
    expect(appliedCount()).toBe("0")
    expect(resultCount()).toBe(String(LETTERS_OF_CREDIT.length))
  }, 20000)
})
