import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { MailFeed } from "./mail-feed"

// Аудит r26: неразрывное слово (номер договора, адрес, URL) в свободном
// тексте выходило за край блока — у узла не было `overflow-wrap: anywhere`.
const WORD = "Договор_поставки_000123456789_без_пробелов"
const WRAP = "[overflow-wrap:anywhere]"

describe("MailFeed: текст письма", () => {
  it("неразрывное слово переносится", () => {
    render(<MailFeed id="1" sender="Иван" date="01.01" subject="Тема" message={WORD} />)
    expect(screen.getByText(WORD)).toHaveClass(WRAP)
  })
})
