import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { TitleCard } from "./title-card"
import { TitleRegistry } from "./title-registry"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("Title: описание", () => {
  it("TitleCard переносит длинное слово", () => {
    render(<TitleCard title="Заг" description={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
  it("TitleRegistry переносит длинное слово", () => {
    render(<TitleRegistry title="Заг" description={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
