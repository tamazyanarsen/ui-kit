import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render } from "@testing-library/react"

import { ToastProvider, TOAST_EXIT_MS } from "./provider"
import { useToast } from "./use-toast"

// Ревью 10.10, п. 23: сторож «уже уходит» вычислялся в ленивом апдейтере
// `setToasts` и почти всегда читался `false`, а `close()` не снимал остаток
// жизни — `resume()` после ховера заводил полный таймер тосту, который уже
// ушёл, и этот таймер никто не снимал.

let api: ReturnType<typeof useToast>

function Capture() {
  api = useToast()
  return null
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe("ToastProvider: таймеры закрытого тоста (ревью 10.10, п. 23)", () => {
  it("после закрытия на паузе и снятия паузы таймеров не остаётся", () => {
    render(
      <ToastProvider timeout={1000}>
        <Capture />
      </ToastProvider>
    )
    let id = ""
    act(() => {
      id = api.add({ title: "Сохранено" })
    })
    act(() => api.pause())
    act(() => api.close(id))
    act(() => api.resume())
    act(() => {
      vi.advanceTimersByTime(TOAST_EXIT_MS)
    })

    expect(api.toasts).toHaveLength(0)
    expect(vi.getTimerCount()).toBe(0)
  })

  it("повторный close не заводит второй таймер ухода", () => {
    render(
      <ToastProvider timeout={0}>
        <Capture />
      </ToastProvider>
    )
    let id = ""
    act(() => {
      id = api.add({ title: "Ошибка" })
    })
    act(() => {
      api.close(id)
      api.close(id)
    })
    expect(vi.getTimerCount()).toBe(1)
  })
})
