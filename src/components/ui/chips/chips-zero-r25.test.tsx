import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Chips } from "./chips"

// Аудит r25: `subtitle={0}` молча пропадал (`Boolean(0)`), а `icon={0}`
// (`icon && …`) выводил голый «0» рядом со значением — без узла иконки.

describe("Chips: нулевые значения", () => {
  it("subtitle 0 — строкой подписи над значением", () => {
    render(
      <Chips type="filter-subtitle-white" subtitle={0}>
        Значение
      </Chips>
    )
    const subtitle = screen.getByText("0")
    expect(subtitle).toHaveClass("truncate", "text-p3-medium")
  })

  it("icon 0 — в узле иконки", () => {
    const { container } = render(<Chips icon={0}>Значение</Chips>)
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveTextContent("0")
  })

  it("пустая подпись строку не рисует", () => {
    const { container } = render(
      <Chips type="filter-subtitle-white" subtitle="">
        Значение
      </Chips>
    )
    expect(container.querySelector(".text-p3-medium")).toBeNull()
  })
})
