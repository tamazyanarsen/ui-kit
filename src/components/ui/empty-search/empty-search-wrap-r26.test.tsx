import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { EmptySearchResults } from "./empty-search"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("EmptySearchResults: тексты", () => {
  it("заголовок и описание переносятся", () => {
    render(<EmptySearchResults title={WORD + "1"} description={WORD + "2"} />)
    expect(screen.getByText(WORD + "1")).toHaveClass(WRAP)
    expect(screen.getByText(WORD + "2")).toHaveClass(WRAP)
  })
})
