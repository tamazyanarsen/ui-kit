import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionCard } from "./accordion-card"

// Аудит r25: `{subtitle && …}` при `subtitle={0}` выводил голый «0» прямо в
// триггер — без своего узла и цвета подзаголовка.

describe("AccordionCard: подзаголовок 0", () => {
  it("рисуется в своём узле подзаголовка, а не голым текстом", () => {
    render(<AccordionCard title="Счёт" subtitle={0} />)
    const subtitle = screen.getByText("0")
    expect(subtitle.tagName).toBe("SPAN")
    expect(subtitle.className).toContain("accordion-card-subtitle-fg")
  })

  it("пустая строка и false узел не рисуют", () => {
    const { container, rerender } = render(<AccordionCard title="Счёт" subtitle="" />)
    expect(container.querySelector('[class*="subtitle-fg"]')).toBeNull()
    rerender(<AccordionCard title="Счёт" subtitle={false} />)
    expect(container.querySelector('[class*="subtitle-fg"]')).toBeNull()
  })
})
