import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Thumbnail } from "./thumbnail"

// r27: last4="" давал «·» без цифр; не заданный last4 по-прежнему «0000».

describe("Thumbnail: last4", () => {
  it("пустая строка не рисует «·» без числа", () => {
    const { container } = render(<Thumbnail type="sbp-card" last4="" />)
    expect(container.textContent).not.toContain("·")
  })

  it("не заданный — заглушка, заданный — цифры", () => {
    expect(render(<Thumbnail type="sbp-card" />).container.textContent).toContain("· 0000")
    expect(render(<Thumbnail type="sbp-card" last4="1234" />).container.textContent).toContain("· 1234")
  })
})
