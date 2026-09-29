import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { pressHandlers } from "./press"

// Аудит 16: протяжка мышью по тексту кликабельной карточки (номер счёта,
// чтобы скопировать) заканчивалась `click` и вызывала `onPress` — переход
// срабатывал, выделить и скопировать реквизит было нельзя.

function Block({ onPress }: { onPress: () => void }) {
  return (
    <div role="button" tabIndex={0} data-testid="block" {...pressHandlers(onPress)}>
      <span>Счёт 40702810000000001234</span>
    </div>
  )
}

/** Выделение, пересекающее узел `node` (или не пересекающее, если null). */
function mockSelection(node: Node | null) {
  vi.spyOn(window, "getSelection").mockReturnValue({
    isCollapsed: node === null,
    rangeCount: node === null ? 0 : 1,
    getRangeAt: () => ({ intersectsNode: (other: Node) => other.contains(node!) || node!.contains(other) }),
  } as unknown as Selection)
}

describe("pressHandlers: выделение текста — не нажатие", () => {
  afterEach(() => vi.restoreAllMocks())

  it("клик после протяжки по тексту блока onPress не вызывает", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    const text = screen.getByText("Счёт 40702810000000001234")
    mockSelection(text.firstChild)
    fireEvent.click(text)
    expect(onPress).not.toHaveBeenCalled()
  })

  it("обычный клик по-прежнему вызывает onPress", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    mockSelection(null)
    fireEvent.click(screen.getByText("Счёт 40702810000000001234"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("выделение вне блока нажатию не мешает", () => {
    const onPress = vi.fn()
    render(
      <>
        <p>Посторонний текст</p>
        <Block onPress={onPress} />
      </>
    )
    mockSelection(screen.getByText("Посторонний текст").firstChild)
    fireEvent.click(screen.getByTestId("block"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("Enter на блоке срабатывает и при выделенном тексте", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    mockSelection(screen.getByText("Счёт 40702810000000001234").firstChild)
    fireEvent.keyDown(screen.getByTestId("block"), { key: "Enter" })
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
