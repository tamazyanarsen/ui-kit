import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Chips } from "./chips"

// Аудит r9: подпись лежит в колонке `items-start`, её ширина — ширина
// текста, и `truncate` было нечего резать: длинная подпись шла за плашку.

describe("Chips: подпись обрезается по плашке", () => {
  it("узел подписи не шире плашки", () => {
    render(
      <Chips type="filter-subtitle-white" subtitle="Очень длинная подпись фильтра по контрагенту">
        Значение
      </Chips>
    )
    const subtitle = screen.getByText(/Очень длинная подпись/)
    const classes = subtitle.className.split(/\s+/)
    expect(classes).toContain("max-w-full")
    expect(classes).toContain("truncate")
  })
})
