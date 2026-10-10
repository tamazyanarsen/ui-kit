import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RangeInput } from "./range-input"
import { clampToRange } from "./value-mask"

// Ревью 10.10, п. 11: привязка к шагу округляла до точности ШАГА и теряла
// дробную часть `min` — значение уходило мимо сетки ползунка.
describe("clampToRange: точность сетки (ревью 10.10, п. 11)", () => {
  it.each([
    // [набрано, min, max, step, ожидается]
    [3, 0.5, 10.5, 1, 3.5],
    [10.4, 0.5, 10.5, 1, 10.5],
    [0.30000004, 0, 1, 1e-7, 0.3],
    [0.1 + 0.2, 0, 1, 0.1, 0.3],
    // Шаг не делит диапазон: последнее деление — сам `max`, не округлённый.
    [10.4, 0, 10.5, 1, 10],
    [10.6, 0, 10.5, 1, 10.5],
  ])("%s в [%s, %s] с шагом %s → %s", (value, min, max, step, expected) => {
    expect(clampToRange(value, min, max, step)).toBe(expected)
  })
})

// Ревью 10.10, п. 17: `format` уходил в Base UI, и `style: "percent"`
// умножал значение на 100 — ползунок на 50 звучал «5 000 %», а поле
// показывало «50 %».
describe("RangeInput: aria-valuetext совпадает с полем (ревью 10.10, п. 17)", () => {
  it("процент: 50, а не 5 000", () => {
    render(
      <RangeInput
        label="Доля"
        min={0}
        max={100}
        defaultValue={50}
        format={{ style: "percent" }}
      />
    )
    const valuetext = screen.getByRole("slider").getAttribute("aria-valuetext") ?? ""
    expect(valuetext.replace(/\s/g, "")).toBe("50%")
  })

  it("сумма: разряды и знак рубля, как в поле", () => {
    render(<RangeInput label="Сумма" mask="amount" min={0} max={1_000_000} defaultValue={400_000} />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "400 000 ₽")
  })
})
