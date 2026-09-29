import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { StatusScreen } from "./status-screen"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("StatusScreen: тексты", () => {
  it("заголовок и подзаголовок переносятся", () => {
    render(<StatusScreen title={WORD + "1"} subtitle={WORD + "2"} />)
    expect(screen.getByText(WORD + "1")).toHaveClass(WRAP)
    expect(screen.getByText(WORD + "2")).toHaveClass(WRAP)
  })
})
