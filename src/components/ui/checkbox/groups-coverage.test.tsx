import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RangeInput } from "@/components/ui/range-input/range-input"
import { Radio } from "@/components/ui/radio/radio"
import { RadioGroup } from "@/components/ui/radio/root"

import { CheckboxGroup } from "./group"

// Добор покрытия к исправлениям контролов формы: ref у групп и RangeInput
// и подпись при `error=""` у Radio и RangeInput раньше не проверялись.
describe("form groups coverage", () => {
  // Обычная функция на React 18 молча теряла ref потребителя.
  it("forwards refs of CheckboxGroup, RadioGroup and RangeInput", () => {
    const checkboxes = React.createRef<HTMLDivElement>()
    const radios = React.createRef<HTMLDivElement>()
    const range = React.createRef<HTMLDivElement>()
    const { container } = render(
      <>
        <CheckboxGroup ref={checkboxes} items={[{ value: "a", label: "А" }]} />
        <RadioGroup ref={radios} aria-label="Тариф">
          <Radio value="a" label="А" />
        </RadioGroup>
        <RangeInput ref={range} defaultValue={50} aria-label="Сумма" />
      </>
    )
    expect(checkboxes.current).toBe(container.querySelector('[data-slot="checkbox-group"]'))
    expect(radios.current).toBe(container.querySelector('[data-slot="radio-group"]'))
    expect(range.current).toBe(container.querySelector('[data-slot="range-input"]'))
  })

  // `typeof error === "boolean" ? null : error` пропускал пустую строку
  // (`error={touched && msg}` при пустом msg) — и она затирала комментарий.
  it('keeps the Radio comment when error is ""', () => {
    render(
      <RadioGroup aria-label="Тариф">
        <Radio value="a" label="А" comment="Комментарий радио" error="" />
      </RadioGroup>
    )
    expect(screen.getByText("Комментарий радио")).toBeInTheDocument()
  })

  it('keeps the RangeInput comment when error is ""', () => {
    render(<RangeInput defaultValue={50} comment="До 100 000 ₽" error="" aria-label="Сумма" />)
    expect(screen.getByText("До 100 000 ₽")).toBeInTheDocument()
  })
})
