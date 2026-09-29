import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Banner } from "./banner"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("Banner: неразрывное слово в заголовке и описании", () => {
  it.each(["desktop", "compact", "mobile"] as const)("%s: заголовок переносится", (size) => {
    render(<Banner size={size} title={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
  it("compact: описание одной строкой переносится", () => {
    render(<Banner size="compact" title="Заг" description={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
