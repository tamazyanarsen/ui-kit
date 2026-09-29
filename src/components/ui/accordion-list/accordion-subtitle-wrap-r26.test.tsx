import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionList, AccordionListItem } from "./accordion-list"
// Аудит r26: неразрывное слово в подзаголовке выходило за край — у
// заголовка `overflow-wrap: anywhere` был, у подзаголовка нет.
const WORD = "Договор_поставки_000123456789_без_пробелов"

describe("AccordionListItem: подзаголовок", () => {
  it("переносит длинное слово", () => {
    render(
      <AccordionList>
        <AccordionListItem title="Заг" subtitle={WORD} />
      </AccordionList>
    )
    expect(screen.getByText(WORD)).toHaveClass("[overflow-wrap:anywhere]")
  })
})
