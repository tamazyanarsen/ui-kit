import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ToastProvider } from "@/components/ui/toast-message"

import { BusinessCardDetail } from "./business-cards/detail"
import { BusinessCardsRegistry } from "./business-cards/registry"
import { CostRedistributionScreen } from "./cost-redistribution/screen"
import { LettersOfCreditScreen } from "./letters-of-credit/screen"

// Раунд 26: экраны с отбором показывали пустой результат с кнопкой «Сбросить
// фильтры», которая ничего не делала (обработчик не передавался). У деталки
// бизнес-карты и таблицы перераспределения ССР пустого результата не было
// вовсе — под шапкой оставалась голая шапка таблицы.

const wrap = (node: React.ReactElement) => render(<ToastProvider>{node}</ToastProvider>)
const empty = () => document.querySelector<HTMLElement>('[data-slot="empty-search-results"]')
const bodyRows = () => document.querySelectorAll('tbody [data-slot="table-row"]').length

async function resetFromEmpty(user: ReturnType<typeof userEvent.setup>) {
  expect(empty()).not.toBeNull()
  await user.click(within(empty()!).getByRole("button", { name: "Сбросить фильтры" }))
}

describe("Песочница: пустой результат отбора", () => {
  it("реестр аккредитивов: кнопка сбрасывает поиск", async () => {
    const user = userEvent.setup()
    wrap(<LettersOfCreditScreen />)
    const before = bodyRows()
    const search = screen.getByPlaceholderText("Поиск по нескольким крит...")
    await user.type(search, "яяяяяя")
    expect(bodyRows()).toBe(0)
    await resetFromEmpty(user)
    expect(search).toHaveValue("")
    expect(bodyRows()).toBe(before)
  }, 20000)

  it("деталка бизнес-карты: пустой результат есть и кнопка работает", async () => {
    const user = userEvent.setup()
    wrap(<BusinessCardDetail />)
    const before = bodyRows()
    const search = screen.getByPlaceholderText("Операция")
    await user.type(search, "яяяяяя")
    expect(bodyRows()).toBe(0)
    await resetFromEmpty(user)
    expect(search).toHaveValue("")
    expect(bodyRows()).toBe(before)
  }, 20000)

  it("перераспределение ССР: пустой результат есть и кнопка очищает поиск", async () => {
    const user = userEvent.setup()
    wrap(<CostRedistributionScreen />)
    const before = bodyRows()
    const search = screen.getByLabelText("Код, статья или сумма")
    await user.type(search, "яяяяяя")
    expect(bodyRows()).toBe(0)
    await resetFromEmpty(user)
    expect(search).toHaveValue("")
    expect(bodyRows()).toBe(before)
  }, 20000)

  it("реестр бизнес-карт: кнопка сбрасывает чип", async () => {
    const user = userEvent.setup()
    wrap(<BusinessCardsRegistry />)
    const chip = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="filter"]')
    ).find((element) => element.textContent?.includes("Держатель"))!
    await user.click(chip)
    await user.type(await screen.findByPlaceholderText("Введите значение"), "яяяяяя")
    await user.click(screen.getByRole("button", { name: /Применить/ }))
    expect(document.querySelectorAll('[data-slot="card"]').length).toBe(0)
    await resetFromEmpty(user)
    expect(empty()).toBeNull()
    expect(document.querySelectorAll('[data-slot="card"]').length).toBeGreaterThan(0)
  }, 20000)
})
