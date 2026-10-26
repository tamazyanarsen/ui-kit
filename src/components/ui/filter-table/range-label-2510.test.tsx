import { afterEach, describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { FilterShell } from "./shell"
import { rangeValueLabel } from "./range-format"

// Правки UI-Kit от 25.10, FilterRange: «Доступный лимит: 3 000 – 300 000 ₽»,
// если название помещается в чип, и «3 000 – 300 000 ₽» — если нет.

describe("rangeValueLabel", () => {
  const base = { label: "Сумма", fromLabel: "От", toLabel: "До", amount: true }

  it("диапазон — полная форма с названием и короткая без него", () => {
    expect(
      rangeValueLabel({ ...base, value: { from: "3000", to: "300000" } })
    ).toEqual({
      full: "Сумма: 3 000 – 300 000 ₽",
      short: "3 000 – 300 000 ₽",
    })
  })

  it("без денежного режима — прежние подписи как введено", () => {
    expect(
      rangeValueLabel({ ...base, amount: false, value: { from: "3000", to: "300000" } })
    ).toEqual({ full: "3000 – 300000" })
    expect(
      rangeValueLabel({ ...base, amount: false, value: { from: "3000", to: "" } })
    ).toEqual({ full: "От 3000" })
  })
})

describe("FilterShell: короткая подпись, когда полная не помещается", () => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")!

  afterEach(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", original)
  })

  function mockWidths(fullWidth: number) {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get(this: HTMLElement) {
        return this.dataset.slot === "filter-label-measure" ? fullWidth : 0
      },
    })
  }

  const label = () => document.querySelector('[data-slot="filter-label"]')!

  const shell = () => (
    <FilterShell
      label="Сумма"
      active
      valueLabel="Сумма: 3 000 – 300 000 ₽"
      valueLabelShort="3 000 – 300 000 ₽"
      onClear={() => {}}
      open={false}
      onOpenChange={() => {}}
    />
  )

  it("помещается — полная форма", () => {
    mockWidths(200)
    render(shell())
    expect(label().textContent).toBe("Сумма: 3 000 – 300 000 ₽")
  })

  it("шире 256 — короткая форма", () => {
    mockWidths(300)
    render(shell())
    expect(label().textContent).toBe("3 000 – 300 000 ₽")
  })
})
