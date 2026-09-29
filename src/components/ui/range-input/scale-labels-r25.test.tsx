import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { RangeInput } from "./range-input"

// Раунд 25, класс «.map по массиву без отбрасывания пустых»: метки шкалы
// `["0", cond && "50", "100"]` рисовались тремя `<span>`, средний пустой, и
// `justify-between` расставлял «0» и «100» так, будто посередине что-то есть.

const spans = (container: HTMLElement) =>
  [...container.querySelectorAll("div.justify-between > span")].map((span) => span.textContent)

describe("RangeInput: пустые метки шкалы", () => {
  it("null и false не рисуются, остальные метки на месте", () => {
    const { container } = render(
      <RangeInput defaultValue={5} scaleLabels={["0", null, false, "100"]} />
    )
    expect(spans(container)).toEqual(["0", "100"])
  })

  it("число 0 и пустая строка остаются метками", () => {
    const { container } = render(<RangeInput defaultValue={5} scaleLabels={[0, "", 10]} />)
    expect(spans(container)).toEqual(["0", "", "10"])
  })

  it("одни пустые метки — шкала не рисуется вовсе", () => {
    const { container } = render(<RangeInput defaultValue={5} scaleLabels={[null, false]} />)
    expect(container.querySelector("div.justify-between")).toBeNull()
  })
})
