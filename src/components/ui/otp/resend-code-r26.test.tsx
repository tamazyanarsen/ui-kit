import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { ResendCode } from "./resend-code"

// Круг 26: отсчёт вёл счёт по числу срабатываний таймера. Пока вкладка или
// приложение в фоне (человек читает СМС в другом окне), браузер замораживает
// таймеры, и по возвращении отсчёт показывал прежние секунды, хотя время
// давно вышло. Теперь остаток считается от срока, а не от числа тиков.

/** Секунды идут по одной: между срабатываниями React успевает перерисоваться. */
function tick(seconds: number) {
  for (let i = 0; i < seconds; i++) act(() => void vi.advanceTimersByTime(1000))
}

describe("ResendCode: отсчёт идёт по часам, а не по тикам", () => {
  afterEach(() => vi.useRealTimers())

  it("после «заморозки» таймеров на 45 секунд остаток пересчитывается сразу", () => {
    vi.useFakeTimers()
    render(<ResendCode seconds={60} />)
    expect(screen.getByRole("status").textContent).toContain("через 60 сек.")

    // Часы ушли на 45 секунд вперёд, а таймер не сработал ни разу.
    act(() => void vi.setSystemTime(Date.now() + 45_000))
    act(() => void vi.advanceTimersByTime(1000))
    const seconds = Number(/через (\d+) сек/.exec(screen.getByRole("status").textContent ?? "")?.[1])
    expect(seconds).toBeLessThanOrEqual(15)
    expect(seconds).toBeGreaterThanOrEqual(13)
  })

  it("после «заморозки» дольше срока показывается кнопка", () => {
    vi.useFakeTimers()
    render(<ResendCode seconds={30} />)
    act(() => void vi.setSystemTime(Date.now() + 90_000))
    act(() => void vi.advanceTimersByTime(1000))
    expect(screen.getByRole("button", { name: "Отправить повторно" })).toBeTruthy()
  })

  it("обычный ход: за 3 секунды остаток уменьшается ровно на 3", () => {
    vi.useFakeTimers()
    render(<ResendCode seconds={10} />)
    tick(3)
    expect(screen.getByRole("status").textContent).toContain("через 7 сек.")
  })

  it("«Отправить повторно» запускает новый отсчёт с полного срока", () => {
    vi.useFakeTimers()
    render(<ResendCode seconds={2} />)
    tick(2)
    act(() => screen.getByRole("button", { name: "Отправить повторно" }).click())
    expect(screen.getByRole("status").textContent).toContain("через 2 сек.")
    tick(1)
    expect(screen.getByRole("status").textContent).toContain("через 1 сек.")
  })
})
