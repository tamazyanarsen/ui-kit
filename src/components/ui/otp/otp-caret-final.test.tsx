import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpInput } from "./input"

// Финальный аудит: нецифры вычищались записью `input.value = digits`, и
// каретка улетала в конец поля. Человек, поправлявший код посередине,
// продолжал печатать уже не там.

describe("OtpInput: каретка после вычистки нецифр", () => {
  it("нецифра посередине не сдвигает каретку", async () => {
    const user = userEvent.setup()
    render(<OtpInput aria-label="Код" defaultValue="1234" />)
    const input = screen.getByLabelText("Код") as HTMLInputElement

    await user.type(input, "a", { initialSelectionStart: 1, initialSelectionEnd: 1 })

    expect(input).toHaveValue("1234")
    expect(input.selectionStart).toBe(1)
  })

  it("вставка с дефисом посередине ставит каретку за вставленными цифрами", async () => {
    const user = userEvent.setup()
    render(<OtpInput aria-label="Код" defaultValue="56" />)
    const input = screen.getByLabelText("Код") as HTMLInputElement

    await user.click(input)
    input.setSelectionRange(1, 1)
    await user.paste("1-2")

    expect(input).toHaveValue("5126")
    expect(input.selectionStart).toBe(3)
  })
})
