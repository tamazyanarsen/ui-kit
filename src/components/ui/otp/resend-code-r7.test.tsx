import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { ResendCode } from "./resend-code"

// Аудит 6: r6 перевёл фокус с нажатой кнопки на таблетку отсчёта, но по
// окончании отсчёта таблетка сменялась кнопкой — и фокус снова падал на body.

describe("ResendCode: фокус по окончании отсчёта", () => {
  afterEach(() => vi.useRealTimers())

  it("фокус с таблетки переходит на появившуюся кнопку", () => {
    vi.useFakeTimers()
    render(<ResendCode seconds={2} />)
    const status = screen.getByRole("status")
    act(() => status.focus())

    act(() => void vi.advanceTimersByTime(1000))
    act(() => void vi.advanceTimersByTime(1000))
    const button = screen.getByRole("button", { name: "Отправить повторно" })
    expect(document.activeElement).toBe(button)
  })

  it("фокус не перехватывается, если стоял не на таблетке", () => {
    vi.useFakeTimers()
    render(
      <>
        <input aria-label="Другое поле" />
        <ResendCode seconds={1} />
      </>
    )
    const other = screen.getByRole("textbox", { name: "Другое поле" })
    act(() => other.focus())

    act(() => void vi.advanceTimersByTime(1000))
    expect(document.activeElement).toBe(other)
  })
})
