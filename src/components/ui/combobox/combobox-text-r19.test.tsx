import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ComboboxFooter } from "./footer"
import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"

// Аудит 18: неразрывное слово в подписи под полем выходило за его край, а
// подпись кнопки подвала в узком поле срезалась краем без многоточия —
// текст лежал прямо во флексе кнопки.

describe("Combobox: длинные тексты", () => {
  it("подпись под полем — break-words", () => {
    render(
      <Combobox items={["a"]}>
        <ComboboxTrigger error="Ошибка: Договор_000123456789">Выбрано: 1</ComboboxTrigger>
      </Combobox>
    )
    expect(screen.getByText("Ошибка: Договор_000123456789")).toHaveClass("break-words")
  })

  it("подписи кнопок подвала — своим узлом с многоточием", () => {
    render(<ComboboxFooter applyLabel="Выбрать: 10/10" onReset={() => {}} onApply={() => {}} />)
    for (const text of ["Сбросить", "Выбрать: 10/10"]) {
      const label = screen.getByText(text)
      expect(label.tagName).toBe("SPAN")
      expect(label).toHaveClass("min-w-0")
      expect(label).toHaveClass("text-ellipsis")
      expect(label).toHaveClass("whitespace-nowrap")
      // Сверка r19: подпись забирает боковые поля кнопки, иначе короткое
      // «Сбросить» в поле 200px обрезалось, хотя раньше помещалось.
      expect(label).toHaveClass("-mx-4")
    }
  })
})
