import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Toggle } from "./toggle"

// Аудит 9: подпись тумблера была `inline-flex` — ширина по содержимому, и
// `flex-1` текстовой колонки не прижимал тумблер к правому краю строки в
// мобильной форме (он стоял сразу за короткой подписью), а неразрывное
// слово раздвигало строку. У Checkbox и Radio подпись — блочный `flex`.

describe("Toggle: подпись — блочный flex, как у Checkbox", () => {
  it("обёртка подписи занимает строку", () => {
    render(<Toggle label="Уведомления" />)
    const label = screen.getByText("Уведомления").closest("label")!
    const classes = label.className.split(/\s+/)
    expect(classes).toContain("flex")
    expect(classes).not.toContain("inline-flex")
  })

  it("неразрывное слово переносится внутри колонки", () => {
    render(<Toggle label="Договор№0001234567890123456789" />)
    const column = screen.getByText("Договор№0001234567890123456789").parentElement!
    expect(column.className.split(/\s+/)).toContain("break-words")
  })
})
