import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Divider } from "./divider"

describe("Divider", () => {
  it("рисует горизонтальную линию по умолчанию", () => {
    render(<Divider />)
    const divider = screen.getByRole("separator")
    expect(divider).toHaveAttribute("data-orientation", "horizontal")
    expect(divider).toHaveAttribute("aria-orientation", "horizontal")
  })

  it("переключается в вертикальную ориентацию", () => {
    render(<Divider orientation="vertical" />)
    const divider = screen.getByRole("separator")
    expect(divider).toHaveAttribute("data-orientation", "vertical")
    expect(divider).toHaveAttribute("aria-orientation", "vertical")
  })

  // forwardRef здесь обязателен, а не желателен: примитивы Base UI
  // подставляют Divider через свой пропс `render` (так делает
  // SelectSeparator) и пробрасывают в него ref.
  it("пробрасывает ref на элемент", () => {
    let node: HTMLHRElement | null = null
    render(<Divider ref={(el) => { node = el }} />)
    expect(node).toBeInstanceOf(HTMLHRElement)
  })

  it("принимает нативные пропсы и className", () => {
    render(<Divider id="rule" data-testid="rule" className="my-4" />)
    const divider = screen.getByTestId("rule")
    expect(divider).toHaveAttribute("id", "rule")
    expect(divider).toHaveClass("my-4")
  })
})
