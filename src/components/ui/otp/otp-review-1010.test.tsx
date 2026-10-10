import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, render } from "@testing-library/react"

import { OtpInput } from "./input"

const cells = (root: HTMLElement) =>
  Array.from(root.querySelectorAll("[data-otp-cell]"), (cell) => cell.textContent)

// Ревью 10.10, п. 1: слой ячеек чистил значение регуляркой `/D/g` (буква
// «D») вместо `/\D/g`. Запись в `ref.value` мимо React (reset формы,
// setValue) с разделителем рисовала ячейку с дефисом.
describe("OtpInput: программная запись с разделителями (ревью 10.10, п. 1)", () => {
  it("ячейки показывают только цифры", async () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(<OtpInput aria-label="Код" ref={ref} />)
    await act(async () => {
      ref.current!.value = "12-34"
    })
    expect(cells(container)).toEqual(["1", "2", "3", "4"])
  })
})
