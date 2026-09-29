import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { IssueItem } from "./issue-item"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("IssueItem: текст ошибки", () => {
  it("неразрывное слово переносится", () => {
    render(<IssueItem>{WORD}</IssueItem>)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
