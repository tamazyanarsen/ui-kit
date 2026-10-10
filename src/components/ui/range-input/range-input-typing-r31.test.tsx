import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { RangeInput } from "./range-input"
import { formatRangeValue, rangeValueSpec } from "./value-mask"

// Дизайн-чек 08.10, замечание 31: маски (₽ и другие единицы), разряды
// по-русски и ввод с клавиатуры, двигающий ползунок по мере набора.

function field() {
  return screen.getByRole("textbox") as HTMLInputElement
}

describe("RangeInput: маска значения", () => {
  it("сумма: разряды пробелом и знак ₽, без «,000»", () => {
    const { container } = render(
      <RangeInput label="Сумма" mask="amount" min={50_000} max={50_000_000} defaultValue={23_700_000} />
    )
    expect(field().value).toBe("23 700 000")
    expect(container.querySelector('[data-slot="range-input-value"]')!.textContent).toBe("23 700 000 ₽")
  })

  it("знак и дробная часть берутся из format", () => {
    expect(rangeValueSpec({ format: { style: "unit", unit: "percent" }, min: 0 }).suffix).toBe("%")
    const rub = rangeValueSpec({ format: { style: "currency", currency: "RUB" }, min: 0 })
    expect(rub.suffix).toBe("\u00A0₽")
    expect(formatRangeValue(rub, 2_000_000)).toBe("2 000 000,00")
    expect(rangeValueSpec({ unit: "дн.", min: 0 }).suffix).toBe("\u00A0дн.")
  })
})

describe("RangeInput: ввод с клавиатуры", () => {
  it("ползунок едет по мере набора, фиксация — по шагу и в диапазоне", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <RangeInput
        label="Сумма"
        mask="amount"
        min={0}
        max={1_000_000}
        step={1000}
        defaultValue={0}
        onValueChange={onValueChange}
      />
    )
    await user.click(field())
    await user.clear(field())
    await user.type(field(), "4005")
    // Каждый символ — новое положение ползунка, без привязки к шагу.
    expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([4, 40, 400, 4005])
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "4005")
    expect(field().value).toBe("4 005")

    fireEvent.blur(field())
    expect(onValueChange).toHaveBeenLastCalledWith(4000, expect.anything())
    expect(field().value).toBe("4 000")
  })

  it("набор выше максимума упирает ползунок в край, текст не трогает до ухода", async () => {
    const user = userEvent.setup()
    render(<RangeInput label="Срок" min={1} max={365} defaultValue={10} />)
    await user.tripleClick(field())
    await user.keyboard("999")
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "365")
    expect(field().value).toBe("999")
    await user.keyboard("{Enter}")
    expect(field().value).toBe("365")
  })

  it("клик по подписи ставит каретку в поле", async () => {
    const user = userEvent.setup()
    render(<RangeInput label="Сумма" defaultValue={10} />)
    await user.click(screen.getByText("Сумма"))
    expect(field()).toHaveFocus()
  })
})
