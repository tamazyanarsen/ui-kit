import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { RangeInput } from "./range-input"

// Ревью 10.10, КК-2: детали изменения для ввода с клавиатуры собирались
// вручную с заглушкой `cancel: () => {}`. Отмена в `onValueChange`
// работала для бегунка (её соблюдает Base UI), а набранное значение
// применялось всё равно.
describe("RangeInput: details.cancel() у набранного значения (ревью 10.10, КК-2)", () => {
  it("отменённый ввод не меняет значение и не фиксируется", async () => {
    const user = userEvent.setup()
    const onValueCommitted = vi.fn()
    render(
      <RangeInput
        label="Срок"
        min={0}
        max={100}
        defaultValue={10}
        onValueChange={(_value, details) => details.cancel()}
        onValueCommitted={onValueCommitted}
      />
    )
    const field = screen.getByRole("textbox")
    await user.clear(field)
    await user.type(field, "70")
    fireEvent.blur(field)

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "10")
    expect(onValueCommitted).not.toHaveBeenCalled()
  })

  it("без отмены набранное применяется", async () => {
    const user = userEvent.setup()
    const onValueCommitted = vi.fn()
    render(
      <RangeInput
        label="Срок"
        min={0}
        max={100}
        defaultValue={10}
        onValueCommitted={onValueCommitted}
      />
    )
    const field = screen.getByRole("textbox")
    await user.clear(field)
    await user.type(field, "70")
    fireEvent.blur(field)

    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "70")
    expect(onValueCommitted).toHaveBeenCalledWith(70, expect.anything())
  })
})
