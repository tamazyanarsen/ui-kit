import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpConfirmCard } from "./confirm-card"
import { ResendCode } from "./resend-code"

// Итоговая проверка №5.

describe("OtpConfirmCard: код сбрасывается при повторном открытии", () => {
  // Неуправляемый код жил снаружи диалога: после закрытия и повторного
  // открытия в поле стоял прежний код, а «Подтвердить» была сразу активна
  // (таймер ResendCode при этом честно начинался заново).
  it("после закрытия и открытия поле пустое, «Подтвердить» выключена", async () => {
    const user = userEvent.setup()
    render(
      <OtpConfirmCard length={6} trigger={<button type="button">Открыть</button>} />
    )
    await user.click(screen.getByRole("button", { name: "Открыть" }))
    await user.type(screen.getByPlaceholderText("Введите код из СМС"), "123456")
    expect(screen.getByRole("button", { name: "Подтвердить" })).toBeEnabled()

    await user.click(screen.getByRole("button", { name: "Закрыть" }))
    await waitFor(() =>
      expect(screen.queryByPlaceholderText("Введите код из СМС")).toBeNull()
    )

    await user.click(screen.getByRole("button", { name: "Открыть" }))
    expect(screen.getByPlaceholderText("Введите код из СМС")).toHaveValue("")
    expect(screen.getByRole("button", { name: "Подтвердить" })).toBeDisabled()
  })
})

describe("ResendCode: фокус после повторной отправки", () => {
  afterEach(() => vi.useRealTimers())

  // Нажатая кнопка сменялась таблеткой отсчёта и уходила из DOM — фокус
  // падал на body, клавиатурный пользователь терял место в окне.
  it("фокус переезжает на таблетку отсчёта, а не на body", async () => {
    vi.useFakeTimers()
    render(<ResendCode seconds={1} />)
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    const button = screen.getByRole("button", { name: "Отправить повторно" })
    button.focus()
    act(() => button.click())

    const status = screen.getByRole("status")
    expect(document.activeElement).not.toBe(document.body)
    expect(document.activeElement).toBe(status)
  })
})
