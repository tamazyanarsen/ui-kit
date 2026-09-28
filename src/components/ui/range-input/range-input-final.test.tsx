import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { RangeInput } from "./range-input"

// Финальный аудит: `aria-invalid` стоял на корне — `div role=group`, у
// которого этот атрибут не поддерживается, — а сам ползунок (`input
// role=slider`) ошибки не получал. Скринридер объявлял поле обычным.

describe("RangeInput: ошибка на самом ползунке", () => {
  it("aria-invalid стоит на input role=slider", () => {
    render(
      <RangeInput label="Сумма" defaultValue={50} min={0} max={100} error="Слишком много" />
    )
    expect(screen.getByRole("slider")).toHaveAttribute("aria-invalid", "true")
  })

  it("без ошибки атрибута нет", () => {
    render(<RangeInput label="Сумма" defaultValue={50} min={0} max={100} />)
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-invalid")
  })
})
