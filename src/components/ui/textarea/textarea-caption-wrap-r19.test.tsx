import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Textarea } from "./textarea"

// Аудит 18: неразрывное слово в подписи под полем выходило за его край.

describe("Textarea: подпись под полем переносит неразрывное слово", () => {
  it("ошибка — break-words", () => {
    render(<Textarea label="Поле" error="Ошибка: Договор_000123456789" />)
    expect(screen.getByText("Ошибка: Договор_000123456789")).toHaveClass("break-words")
  })
})
