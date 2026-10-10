import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Checkbox } from "./checkbox"

// Ревью 10.10, п. 12: `hasCaption = Boolean(caption)` прятал комментарий
// «0» вместе с его `aria-describedby`, хотя для `label` ноль — содержимое.
describe("Checkbox: комментарий-число 0 (ревью 10.10, п. 12)", () => {
  it("рисуется и связан с чекбоксом", () => {
    render(<Checkbox label="Согласен" comment={0} />)
    const box = screen.getByRole("checkbox")
    const caption = document.getElementById(box.getAttribute("aria-describedby") ?? "none")
    expect(caption?.textContent).toBe("0")
  })
})
