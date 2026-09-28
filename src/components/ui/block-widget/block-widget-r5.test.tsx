import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { BlockWidget, BlockWidgetColumn } from "./block-widget"

// Итоговая проверка №4: колонки типа double оборачивались во фрагмент с
// ключом-позицией. Когда первая колонка исчезала, вторая перемонтировалась
// и теряла введённый текст и фокус.

function Double({ first }: { first: boolean }) {
  return (
    <BlockWidget type="double">
      {first && <BlockWidgetColumn>Первая</BlockWidgetColumn>}
      <BlockWidgetColumn>
        <input aria-label="Поле" />
      </BlockWidgetColumn>
    </BlockWidget>
  )
}

describe("BlockWidget double: колонки узнаются по своему ключу", () => {
  it("исчезновение первой колонки не перемонтирует вторую", () => {
    const { rerender } = render(<Double first />)
    const input = screen.getByLabelText("Поле") as HTMLInputElement
    input.value = "набранный текст"
    input.focus()

    rerender(<Double first={false} />)

    const after = screen.getByLabelText("Поле") as HTMLInputElement
    expect(after).toBe(input)
    expect(after.value).toBe("набранный текст")
    expect(after).toHaveFocus()
  })
})
