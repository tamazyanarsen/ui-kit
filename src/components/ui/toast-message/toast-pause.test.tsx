import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

type Api = ReturnType<typeof useToast>
let api: Api

function Capture() {
  api = useToast()
  return null
}

function renderToaster() {
  const utils = render(
    <ToastProvider timeout={1000}>
      <Capture />
      <Toaster />
    </ToastProvider>
  )
  const column = utils.container.querySelector("[aria-live]") as HTMLElement
  return { ...utils, column }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe("Toast: пауза времени жизни", () => {
  it("фокус, ушедший вместе с закрытым тостом, не оставляет паузу навсегда", () => {
    const { column } = renderToaster()
    act(() => void api.add({ title: "Первый" }))

    const cross = screen.getByRole("button", { name: "Закрыть" })
    act(() => cross.focus())
    fireEvent.focus(cross)
    act(() => {
      fireEvent.click(cross)
      vi.advanceTimersByTime(400)
    })
    expect(screen.queryByText("Первый")).not.toBeInTheDocument()
    expect(column.contains(document.activeElement)).toBe(false)

    act(() => void api.add({ title: "Второй" }))
    act(() => void vi.advanceTimersByTime(1400))
    expect(screen.queryByText("Второй")).not.toBeInTheDocument()
  })

  it("увод мыши не снимает паузу, пока фокус внутри колонки", () => {
    const { column } = renderToaster()
    act(() => void api.add({ title: "Читаю" }))

    fireEvent.mouseEnter(column)
    fireEvent.focus(screen.getByRole("button", { name: "Закрыть" }))
    fireEvent.mouseLeave(column)
    act(() => void vi.advanceTimersByTime(3000))

    expect(screen.getByText("Читаю")).toBeInTheDocument()
  })

  it("add, захваченный во время паузы, после её снятия заводит таймер", () => {
    const { column } = renderToaster()
    fireEvent.mouseEnter(column)
    const staleAdd = api.add
    fireEvent.mouseLeave(column)

    act(() => void staleAdd({ title: "Поздний" }))
    act(() => void vi.advanceTimersByTime(1400))

    expect(screen.queryByText("Поздний")).not.toBeInTheDocument()
  })

  it("тост с нулевым остатком закрывается после снятия паузы", () => {
    const { column } = renderToaster()
    act(() => void api.add({ title: "На грани" }))
    // Время вышло, но колбэк таймера ещё не отработал: пауза видит остаток 0.
    vi.setSystemTime(Date.now() + 1000)
    vi.spyOn(performance, "now").mockReturnValue(performance.now() + 1000)
    fireEvent.mouseEnter(column)
    vi.mocked(performance.now).mockRestore()
    fireEvent.mouseLeave(column)
    act(() => void vi.advanceTimersByTime(400))

    expect(screen.queryByText("На грани")).not.toBeInTheDocument()
  })
})
