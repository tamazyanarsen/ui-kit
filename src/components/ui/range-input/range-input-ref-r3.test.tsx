import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RangeInput } from "./range-input"

// Итоговая проверка №2: ref RangeInput висел на корне `role=group`, а у
// него фокуса нет — `Controller` из react-hook-form не мог поставить фокус
// на поле с ошибкой (`field.ref.focus()` ничего не делал). Сверено с
// настоящим RHF 7: после правки фокус уходит на ползунок.

describe("RangeInput: ref для форм", () => {
  it("указывает на нативный input ползунка и фокусирует его", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<RangeInput ref={ref} label="Сумма" defaultValue={10} />)
    const slider = screen.getByRole("slider")
    expect(ref.current).toBe(slider)
    ref.current!.focus()
    expect(slider).toHaveFocus()
  })

  it("внутренний ref для aria-invalid продолжает работать рядом с внешним", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<RangeInput ref={ref} label="Сумма" defaultValue={10} error="Мало" />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true")
  })
})
