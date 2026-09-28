import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tooltip } from "./tooltip"

describe("Tooltip: disabled", () => {
  it("повторное включение не открывает подсказку само, без наведения", async () => {
    const user = userEvent.setup()
    function Harness({ disabled }: { disabled: boolean }) {
      return (
        <Tooltip content="Полный текст" disabled={disabled}>
          <button type="button">Якорь</button>
        </Tooltip>
      )
    }
    const { rerender } = render(<Harness disabled={false} />)

    await user.hover(screen.getByRole("button", { name: "Якорь" }))
    expect(await screen.findByText("Полный текст", {}, { timeout: 2000 })).toBeInTheDocument()

    // Текст перестал обрезаться — подсказку выключили. Внутреннее `open`
    // раньше оставалось `true`: Base UI при `open={false}` считает подсказку
    // закрытой и `onOpenChange(false)` не присылает.
    rerender(<Harness disabled />)
    // Снова обрезано: подсказка включена, нового наведения не было.
    rerender(<Harness disabled={false} />)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    expect(screen.queryByText("Полный текст")).not.toBeInTheDocument()
  })
})
