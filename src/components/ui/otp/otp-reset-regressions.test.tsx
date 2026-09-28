import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpInput } from "./input"

// Третий проход: код, сброшенный мимо ввода (родителем или записью в
// `ref.value`), оставлял в памяти компонента прежний полный код.
describe("OtpInput reset regressions", () => {
  it("completes again when the parent resets and the same code is pasted", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    function Harness() {
      const [code, setCode] = React.useState("")
      return (
        <>
          <OtpInput
            aria-label="Код"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onComplete={onComplete}
          />
          <button type="button" onClick={() => setCode("")}>
            Сбросить
          </button>
        </>
      )
    }
    render(<Harness />)
    const field = screen.getByLabelText("Код")

    await user.click(field)
    await user.paste("123456")
    await user.click(screen.getByRole("button", { name: "Сбросить" }))
    await user.click(field)
    await user.paste("123456")

    expect(onComplete).toHaveBeenCalledTimes(2)
  })

  it("accepts a new code after the form cleared the uncontrolled field via ref", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const ref = React.createRef<HTMLInputElement>()
    render(<OtpInput aria-label="Код" ref={ref} onComplete={onComplete} />)
    const field = screen.getByLabelText("Код") as HTMLInputElement

    await user.click(field)
    await user.paste("123456")
    ref.current!.value = ""
    await user.paste("Код: 654-321-9")

    expect(field).toHaveValue("654321")
    expect(onComplete).toHaveBeenLastCalledWith("654321")
  })

  it("completes again with the same code after a reset via ref", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const ref = React.createRef<HTMLInputElement>()
    render(<OtpInput aria-label="Код" ref={ref} onComplete={onComplete} />)
    const field = screen.getByLabelText("Код")

    await user.click(field)
    await user.paste("123456")
    ref.current!.value = ""
    await user.paste("123456")

    expect(onComplete).toHaveBeenCalledTimes(2)
  })

  it("replaces a fully selected code with a longer paste, truncated", async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OtpInput aria-label="Код" onComplete={onComplete} />)
    const field = screen.getByLabelText("Код") as HTMLInputElement

    await user.click(field)
    await user.paste("123456")
    field.setSelectionRange(0, 6)
    await user.paste("654321 7")

    expect(field).toHaveValue("654321")
    expect(onComplete).toHaveBeenLastCalledWith("654321")
  })
})
