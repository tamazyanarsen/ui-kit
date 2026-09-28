import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Card } from "./card"

// Аудит r6: `{value && …}` при `value={0}` рисовал голый «0» прямо в строке
// заголовка — без колонки справа и без её стиля.

describe("Card: значение 0", () => {
  it("рисуется в своей колонке, а не голым текстом", () => {
    render(<Card title="Счёт" value={0} />)
    const value = screen.getByText("0")
    expect(value.tagName).toBe("SPAN")
    expect(value.className).toContain("text-right")
  })

  it("пустое значение колонку не рисует", () => {
    const { container } = render(<Card title="Счёт" value="" />)
    expect(container.querySelector(".text-right")).toBeNull()
  })
})
