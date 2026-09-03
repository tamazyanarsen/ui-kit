import { describe, expect, it } from "vitest"

import {
  GROUP_SPACES,
  NARROW_NBSP,
  NBSP,
  formatSignSpacing,
  stripGroupSeparators,
  unitSeparator,
} from "./number-format"

describe("unitSeparator", () => {
  // `%`, `‰`, `°` набираются ВПЛОТНУЮ к числу, знак валюты — через
  // неразрывный пробел. Раньше отбивка была одна на всех, и процент
  // отрывался от своего числа.
  it("glues percent-like signs and spaces out currency", () => {
    expect(unitSeparator("%")).toBe("")
    expect(unitSeparator("‰")).toBe("")
    expect(unitSeparator("°")).toBe("")
    expect(unitSeparator("₽")).toBe(NBSP)
    expect(unitSeparator("$")).toBe(NBSP)
    expect(unitSeparator("шт.")).toBe(NBSP)
  })
})

describe("formatSignSpacing", () => {
  it("removes the space ICU puts before a percent", () => {
    expect(formatSignSpacing(`50${NARROW_NBSP}%`)).toBe("50%")
    expect(formatSignSpacing("50 %")).toBe("50%")
  })

  it("keeps the space before a currency sign and normalises it", () => {
    expect(formatSignSpacing(`1${NARROW_NBSP}200${NARROW_NBSP}₽`)).toBe(
      `1${NBSP}200${NBSP}₽`
    )
  })
})

describe("stripGroupSeparators", () => {
  it("drops separators between digits and keeps the currency sign", () => {
    expect(stripGroupSeparators(`120${NBSP}000${NBSP}000,00${NBSP}₽`)).toBe(
      `120000000,00${NBSP}₽`
    )
  })

  // ⚠️ Разбор идёт по строке целиком: выделение С КРАЯ должно давать тот же
  // ответ, что и выделение посередине.
  it("handles a selection that starts mid-number", () => {
    expect(stripGroupSeparators("000 000")).toBe("000000")
  })

  it("takes the separator set from the caller — телефону нужен и дефис", () => {
    expect(stripGroupSeparators("+7 912 345-67-89", [" ", "-"])).toBe(
      "+79123456789"
    )
    // Только пробел: дефисы остаются, и получается полуформат — ровно то,
    // ради чего каждая маска объявляет СВОЙ набор.
    expect(stripGroupSeparators("+7 912 345-67-89", [" "])).toBe(
      "+7912345-67-89"
    )
  })

  it("leaves free text alone when no separator is declared", () => {
    expect(stripGroupSeparators("Дом 12345 корп 2", [])).toBe("Дом 12345 корп 2")
  })

  it("does not touch a space that is not between digits", () => {
    expect(stripGroupSeparators("Иванов Иван", GROUP_SPACES)).toBe("Иванов Иван")
  })
})
