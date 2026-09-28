import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ItemInformationField } from "./item-information-field"

// Аудит 12: `subText && …` при 0 выводил голую цифру — без своей строки и
// цвета (текст поля читался как «Комиссия1000»).

describe("ItemInformationField: subText={0} — своя строка", () => {
  it("0 рисуется в строке подписи со своим цветом", () => {
    render(<ItemInformationField label="Комиссия" value="100" subText={0} />)
    const zero = screen.getByText("0")
    expect(zero.tagName).toBe("SPAN")
    expect(zero.className).toContain("text-p3-medium")
  })
})
