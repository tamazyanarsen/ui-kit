import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Input } from "./input"

// Аудит 18: неразрывное слово (номер договора, имя файла) в подписи ошибки
// или комментария выходило за правый край поля — перенос был только у
// Checkbox, Radio и Toggle.

describe("Input: подпись под полем переносит неразрывное слово", () => {
  it("ошибка и комментарий — break-words", () => {
    const { rerender } = render(<Input label="Поле" error="Ошибка: Договор_000123456789" />)
    expect(screen.getByText("Ошибка: Договор_000123456789")).toHaveClass("break-words")
    rerender(<Input label="Поле" comment="Комментарий: Файл_000123456789.pdf" />)
    expect(screen.getByText("Комментарий: Файл_000123456789.pdf")).toHaveClass("break-words")
  })
})
