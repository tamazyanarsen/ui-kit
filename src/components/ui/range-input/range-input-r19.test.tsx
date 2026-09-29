import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RangeInput } from "./range-input"

// Аудит 18: подпись RangeInput переносилась в коробке фиксированной высоты
// и ложилась поверх значения, а неразрывное слово в подписи под полем
// выходило за его край.

const classes = (el: Element) => el.className.split(/\s+/)

describe("RangeInput: длинные подписи", () => {
  it("подпись в коробке — одна строка с многоточием", () => {
    render(<RangeInput label="Очень длинное название документа в несколько слов" min={0} max={100} />)
    const label = classes(screen.getByText("Очень длинное название документа в несколько слов"))
    expect(label).toEqual(expect.arrayContaining(["min-w-0", "whitespace-nowrap", "text-ellipsis", "overflow-clip"]))
  })

  it("подпись под полем переносит неразрывное слово", () => {
    render(<RangeInput label="Сумма" min={0} max={100} error="Неверно: Договор_000123456789" />)
    expect(screen.getByText("Неверно: Договор_000123456789")).toHaveClass("break-words")
  })
})
