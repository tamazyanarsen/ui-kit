import { describe, expect, it } from "vitest"

import { amountQuery, matchesAmount } from "./amount-filter"

// Итоговая проверка №4: сравнение по началу строки цифр без границы
// разряда — «2 000 000» находил 20 000 000, «300 000» — 300 000 000.

const matches = (amount: number, input: string) => matchesAmount(amount, amountQuery(input)!)

describe("чип «Сумма»: целая часть полной суммы — точно", () => {
  it("сумма, набранная как в колонке, не находит суммы на порядок больше", () => {
    expect(matches(20_000_000, "2 000 000")).toBe(false)
    expect(matches(300_000_000, "300 000")).toBe(false)
    expect(matches(20_000_000, "2000000")).toBe(false)
  })

  it("та же сумма по-прежнему находится во всех видах ввода", () => {
    expect(matches(2_000_000, "2 000 000")).toBe(true)
    expect(matches(2_000_000, "2000000")).toBe(true)
    expect(matches(2_000_000, "2 000 000,00")).toBe(true)
  })

  it("копейки сравниваются по началу, целая часть — точно", () => {
    expect(matches(1_200_000.5, "1 200 000,5")).toBe(true)
    expect(matches(1_200_000.5, "1 200 000,7")).toBe(false)
    expect(matches(11_200_000.5, "1 200 000,5")).toBe(false)
  })

  it("короткий набор без разделителей ищется по началу, пока печатают", () => {
    expect(matches(1_200_000, "12")).toBe(true)
    expect(matches(300_000_000, "300")).toBe(true)
    expect(matches(1_200_000, "13")).toBe(false)
  })
})
