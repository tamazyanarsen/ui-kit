import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { pressHandlers } from "./press"

// Финальный аудит: удержание пробела вызывало `onPress` на каждом
// автоповторе keydown. Нативная кнопка срабатывает на пробел один раз.

function Block({ onPress }: { onPress: () => void }) {
  return <div role="button" tabIndex={0} data-testid="block" {...pressHandlers(onPress)} />
}

describe("pressHandlers: удержание клавиш", () => {
  it("удержание пробела нажимает блок один раз", () => {
    const onPress = vi.fn()
    render(<Block onPress={onPress} />)
    const block = screen.getByTestId("block")

    fireEvent.keyDown(block, { key: " " })
    fireEvent.keyDown(block, { key: " ", repeat: true })
    fireEvent.keyDown(block, { key: " ", repeat: true })
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("автоповтор пробела всё равно не прокручивает страницу", () => {
    render(<Block onPress={() => {}} />)
    const block = screen.getByTestId("block")
    fireEvent.keyDown(block, { key: " " })
    const repeated = fireEvent.keyDown(block, { key: " ", repeat: true })
    // fireEvent возвращает false, если обработчик вызвал preventDefault.
    expect(repeated).toBe(false)
  })
})
