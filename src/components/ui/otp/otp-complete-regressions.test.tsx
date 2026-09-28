import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpInput } from "./input"

// Второй проход: без `maxLength` лишняя цифра в заполненном поле повторно
// отправляла код или молча портила его.
describe("OtpInput completion regressions", () => {
  async function fillCode() {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OtpInput aria-label="Код" onComplete={onComplete} />)
    const field = screen.getByLabelText("Код") as HTMLInputElement
    await user.type(field, "123456")
    return { user, field, onComplete }
  }

  it("ignores a digit typed at the end of a full code", async () => {
    const { user, field, onComplete } = await fillCode()

    await user.keyboard("7")

    expect(field).toHaveValue("123456")
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("ignores a digit typed in the middle of a full code", async () => {
    const { user, field, onComplete } = await fillCode()
    field.setSelectionRange(2, 2)

    await user.keyboard("9")

    expect(field).toHaveValue("123456")
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).not.toHaveBeenCalledWith("129345")
  })

  it("completes again when a digit of a full code is replaced", async () => {
    const { user, field, onComplete } = await fillCode()
    field.setSelectionRange(2, 3)

    await user.keyboard("9")

    expect(field).toHaveValue("129456")
    expect(onComplete).toHaveBeenLastCalledWith("129456")
    expect(onComplete).toHaveBeenCalledTimes(2)
  })

  it("completes again after a controlled reset and the same code", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    function Controlled() {
      const [code, setCode] = React.useState("")
      return (
        <>
          <OtpInput
            aria-label="Код"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onComplete={onComplete}
          />
          <button type="button" onClick={() => setCode("")}>
            Сбросить
          </button>
        </>
      )
    }
    render(<Controlled />)
    const field = screen.getByLabelText("Код")

    await user.type(field, "123456")
    await user.click(screen.getByRole("button", { name: "Сбросить" }))
    await user.type(field, "123456")

    expect(onComplete).toHaveBeenCalledTimes(2)
  })
})
