import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Thumbnail } from "./thumbnail"

// Сверка с Figma r27: числовой last4 (слабо типизированный вызов) роняет рендер на `last4.trim()`.
describe("Thumbnail: цифры карты", () => {
  it.each([[1234, "· 1234"], [0, "· 0"], ["5678", "· 5678"], [undefined, "· 0000"]])("last4=%j показывает %s", (last4, text) => {
    render(<Thumbnail type="sbp-card" last4={last4 as unknown as string} />)
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it("пустая строка убирает цифры", () => {
    const { container } = render(<Thumbnail type="sbp-card" last4="" />)
    expect(container.textContent).not.toContain("·")
  })
})
