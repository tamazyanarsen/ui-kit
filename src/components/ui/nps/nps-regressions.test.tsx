import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { Nps } from "./nps"

describe("Nps: регрессии", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("«Спасибо за оценку» закрывается сам через autoCloseMs", () => {
    const onClose = vi.fn()
    render(<Nps submitted onClose={onClose} />)
    expect(screen.getByText("Окно закроется автоматически")).toBeInTheDocument()

    act(() => void vi.advanceTimersByTime(1999))
    expect(onClose).not.toHaveBeenCalled()
    act(() => void vi.advanceTimersByTime(1))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("новый onClose на каждом рендере не перезапускает отсчёт", () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = render(<Nps submitted onClose={first} />)
    act(() => void vi.advanceTimersByTime(1500))
    rerender(<Nps submitted onClose={second} />)
    act(() => void vi.advanceTimersByTime(500))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it("autoCloseMs={0} и отсутствие onClose — без обещания и без таймера", () => {
    const onClose = vi.fn()
    const { rerender } = render(<Nps submitted onClose={onClose} autoCloseMs={0} />)
    act(() => void vi.advanceTimersByTime(5000))
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.queryByText("Окно закроется автоматически")).not.toBeInTheDocument()

    rerender(<Nps submitted />)
    expect(screen.queryByText("Окно закроется автоматически")).not.toBeInTheDocument()
  })

  it("таймер снимается при размонтировании", () => {
    const onClose = vi.fn()
    const { unmount } = render(<Nps submitted onClose={onClose} />)
    unmount()
    act(() => void vi.advanceTimersByTime(3000))
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe("Nps: свёрнутая панель", () => {
  it("до оценки панель отзыва инертна — Tab в неё не заходит", () => {
    const { container, rerender } = render(<Nps value={null} />)
    const panel = container.querySelector("[inert]")
    expect(panel).not.toBeNull()
    expect(panel?.querySelector("textarea")).not.toBeNull()

    rerender(<Nps value={3} />)
    expect(container.querySelector("[inert]")).toBeNull()
  })
})
