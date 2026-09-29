import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { GridCol, gridSpanWidth } from "./grid"

// r27: span={NaN} (Number("") из поля) давал невалидное `span NaN / span NaN`
// и «calc(… NaN …)»: колонка теряла размещение в сетке.

describe("Grid: NaN в span", () => {
  it("GridCol растягивается на все 12 колонок", () => {
    const { container } = render(<GridCol span={NaN}>x</GridCol>)
    const style = (container.firstChild as HTMLElement).getAttribute("style")
    expect(style).toContain("span 12")
    expect(style).not.toContain("NaN")
  })

  it("gridSpanWidth не выдаёт NaN", () => {
    expect(gridSpanWidth(NaN)).toBe("100%")
  })
})
