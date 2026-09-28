import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "@/components/ui/toast-message"

import { OPERATIONS } from "./data"
import { BusinessCardDetail } from "./detail"

// Итоговая проверка №3: чип «Статус» считался применённым («Выбрано
// фильтров: 1»), но отбор его не читал — «Результатов» не менялось.

const resultCount = () => screen.getByText("Результатов:").nextElementSibling!.textContent

describe("деталка бизнес-карты: чип «Статус»", () => {
  it("отбирает операции «В обработке» — без проводки", async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <BusinessCardDetail />
      </ToastProvider>
    )
    const chip = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="filter"]')
    ).find((element) => element.textContent?.includes("Статус"))!
    await user.click(chip)
    await user.type(await screen.findByPlaceholderText("Введите значение"), "в обработке")
    await user.click(screen.getByRole("button", { name: /Применить/ }))

    const pending = OPERATIONS.filter((row) => !row.transactionDate).length
    expect(pending).toBeGreaterThan(0)
    expect(pending).toBeLessThan(OPERATIONS.length)
    expect(resultCount()).toBe(String(pending))
  }, 20000)
})
