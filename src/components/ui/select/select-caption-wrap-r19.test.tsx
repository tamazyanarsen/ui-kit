import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Select, SelectTrigger, SelectValue } from "./index"

// Аудит 18: неразрывное слово в подписи под полем выходило за его край.

describe("SelectTrigger: подпись под полем переносит неразрывное слово", () => {
  it("ошибка — break-words", () => {
    render(
      <Select items={[{ value: "a", label: "Альфа" }]}>
        <SelectTrigger label="Поле" error="Ошибка: Договор_000123456789">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByText("Ошибка: Договор_000123456789")).toHaveClass("break-words")
  })
})
