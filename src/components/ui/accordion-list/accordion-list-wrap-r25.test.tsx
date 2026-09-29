import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionListItem } from "./accordion-list"

// Аудит r25: неразрывное слово в заголовке строки списка выходило за колонку
// (`min-w-0 flex-1` есть, а `overflow-wrap: anywhere` — нет: `min-w-0` не
// режет слово, которое некуда переносить).

describe("AccordionListItem: длинный заголовок", () => {
  it("переносится по буквам внутри своей колонки", () => {
    render(<AccordionListItem title="Договор_поставки_оборудования_000123456789" />)
    const title = screen.getByText(/Договор_поставки/)
    expect(title).toHaveClass("min-w-0", "flex-1", "[overflow-wrap:anywhere]")
  })
})
