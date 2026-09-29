import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { OtpInput } from "./input"

// Аудит 18: неразрывное слово в тексте ошибки выходило за ячейки.

describe("OtpInput: текст ошибки переносит неразрывное слово", () => {
  it("break-words", () => {
    render(<OtpInput error="Код_недействителен_000123456789" />)
    expect(screen.getByText("Код_недействителен_000123456789")).toHaveClass("break-words")
  })
})
