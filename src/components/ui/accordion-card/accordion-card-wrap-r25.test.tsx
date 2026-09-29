import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { AccordionCard } from "./accordion-card"

// Аудит r25: неразрывное слово в заголовке карточки выходило за её край и
// выталкивало шеврон (в колонке 300px `scrollWidth` был 300 у карточки, но
// заголовок торчал за неё): у заголовка во флекс-строке не было `min-w-0` и
// `overflow-wrap: anywhere`. Живая проверка в Chrome: после правки ничего не
// выступает.

describe("AccordionCard: длинный заголовок", () => {
  it("сжимается во флекс-строке и переносится по буквам", () => {
    render(<AccordionCard title="Договор_поставки_оборудования_000123456789" />)
    const title = screen.getByText("Договор_поставки_оборудования_000123456789")
    expect(title).toHaveClass("min-w-0", "[overflow-wrap:anywhere]")
  })
})
