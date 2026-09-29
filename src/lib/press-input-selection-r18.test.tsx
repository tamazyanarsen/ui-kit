import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { pressHandlers } from "./press"

// Аудит 17: Chrome показывает выделение внутри `<input>`/`<textarea>`
// свёрнутым для документа. Протяжка по тексту поля, отпущенная уже на
// самом блоке, давала `click` по блоку — и он срабатывал.

function Block({ onPress, type = "text" }: { onPress: () => void; type?: string }) {
  return (
    <div role="button" tabIndex={0} data-testid="block" {...pressHandlers(onPress)}>
      <input aria-label="Поле" type={type} defaultValue="Длинный текст в поле" />
      <span>Подпись блока</span>
    </div>
  )
}

describe("pressHandlers: выделение в поле внутри блока — не нажатие", () => {
  it("выделенный текст в поле, отпускание на блоке — onPress не вызван", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    const field = screen.getByLabelText("Поле") as HTMLInputElement
    field.focus()
    field.setSelectionRange(3, 12)
    fireEvent.click(screen.getByText("Подпись блока"))
    expect(onPress).not.toHaveBeenCalled()
  })

  it("поле в фокусе без выделения — обычный клик по блоку срабатывает", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    const field = screen.getByLabelText("Поле") as HTMLInputElement
    field.focus()
    field.setSelectionRange(4, 4)
    fireEvent.click(screen.getByText("Подпись блока"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("поле без текстового выделения (checkbox) не мешает нажатию", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} type="checkbox" />)
    ;(screen.getByLabelText("Поле") as HTMLInputElement).focus()
    fireEvent.click(screen.getByText("Подпись блока"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
