import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionCard } from "./accordion-card"
// Аудит r26: неразрывное слово в подзаголовке выходило за край — у
// заголовка `overflow-wrap: anywhere` был, у подзаголовка нет.
const WORD = "Договор_поставки_000123456789_без_пробелов"

describe("AccordionCard: подзаголовок", () => {
  it("переносит длинное слово", () => {
    render(<AccordionCard title="Заг" subtitle={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass("[overflow-wrap:anywhere]")
  })
})
