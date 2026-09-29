import { describe, expect, it } from "vitest"

import { formatDateRu, parseDateRu } from "@/lib/calendar"

// Круг 27: год короче четырёх знаков не добивался нулями — «01.01.999»
// не читается ни маской, ни `parseDateRu`.

describe("formatDateRu: год короче четырёх знаков", () => {
  it.each([
    [999, "01.02.0999"],
    [100, "01.02.0100"],
    [2026, "01.02.2026"],
  ])("год %i", (year, expected) => {
    const date = new Date(2000, 1, 1)
    date.setFullYear(year)
    const text = formatDateRu(date)
    expect(text).toBe(expected)
    expect(parseDateRu(text)?.getFullYear()).toBe(year)
  })
})
