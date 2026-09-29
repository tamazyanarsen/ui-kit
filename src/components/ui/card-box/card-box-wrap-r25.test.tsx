import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CardBox } from "./card-box"

// Аудит r25: неразрывное слово в заголовке блока выходило за его край (в
// колонке 300px `scrollWidth` был 878): у заголовка не было
// `overflow-wrap: anywhere`.

describe("CardBox: длинный заголовок", () => {
  it.each(["large", "table", "small"] as const)("%s: переносится по буквам", (type) => {
    render(<CardBox type={type} title="Договор_поставки_оборудования_000123456789" />)
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("[overflow-wrap:anywhere]")
  })
})
