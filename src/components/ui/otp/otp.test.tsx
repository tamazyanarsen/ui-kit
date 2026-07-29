import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpInput } from "./input"
import { ResendCode } from "./resend-code"
import { OtpConfirmCard } from "./confirm-card"

// The countdown reschedules its own setTimeout from inside a state-update
// callback each tick — advancing fake timers in one big jump fires every
// pending timer before React gets a chance to re-render and schedule the
// next one, so it has to be stepped one second at a time with an `act()`
// flush in between.
async function advanceSeconds(n: number) {
  for (let i = 0; i < n; i++) {
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
  }
}

describe("OtpInput", () => {
  it("strips non-digit characters", async () => {
    const user = userEvent.setup()
    render(<OtpInput aria-label="Код" />)

    const field = screen.getByLabelText("Код")
    await user.type(field, "12a3b4")

    expect(field).toHaveValue("1234")
  })

  it("calls onComplete once the full length is typed", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OtpInput length={4} aria-label="Код" onComplete={onComplete} />)

    await user.type(screen.getByLabelText("Код"), "1234")

    expect(onComplete).toHaveBeenCalledWith("1234")
  })

  it("shows the error message", () => {
    render(<OtpInput aria-label="Код" error="Неверный код" />)
    expect(screen.getByText("Неверный код")).toBeInTheDocument()
  })
})

describe("ResendCode", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows the countdown", () => {
    render(<ResendCode seconds={5} />)
    expect(screen.getByRole("status")).toHaveTextContent("Отправить повторно через 5 сек.")
  })

  it("swaps to a clickable button once the countdown reaches 0", async () => {
    render(<ResendCode seconds={2} />)

    await advanceSeconds(2)

    expect(screen.getByRole("button", { name: "Отправить повторно" })).toBeInTheDocument()
  })

  it("calls onResend and restarts the countdown when clicked", async () => {
    const onResend = vi.fn()
    render(<ResendCode seconds={2} onResend={onResend} />)

    await advanceSeconds(2)
    act(() => {
      screen.getByRole("button", { name: "Отправить повторно" }).click()
    })

    expect(onResend).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("status")).toHaveTextContent("Отправить повторно через 2 сек.")
  })
})

describe("OtpConfirmCard", () => {
  it("renders the title and phone-based subtitle", () => {
    render(<OtpConfirmCard phone="+7 900 000-00-00" />)
    expect(
      screen.getByText("Код подтверждения отправлен на номер +7 900 000-00-00")
    ).toBeInTheDocument()
  })

  it("keeps the confirm button disabled until the code is complete", async () => {
    const user = userEvent.setup()
    render(<OtpConfirmCard length={4} />)

    const confirm = screen.getByRole("button", { name: "Подтвердить" })
    expect(confirm).toBeDisabled()

    await user.type(screen.getByPlaceholderText("Введите код из СМС"), "1234")

    expect(confirm).toBeEnabled()
  })

  it("submits the completed code", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OtpConfirmCard length={4} onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText("Введите код из СМС"), "1234")
    await user.click(screen.getByRole("button", { name: "Подтвердить" }))

    expect(onSubmit).toHaveBeenCalledWith("1234")
  })

  it("calls onClose from the close button", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<OtpConfirmCard onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Закрыть" }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
