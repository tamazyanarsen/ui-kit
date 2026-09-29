import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Nps } from "./nps"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("Nps: заголовок вопроса", () => {
  it("неразрывное слово переносится", () => {
    render(<Nps title={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
