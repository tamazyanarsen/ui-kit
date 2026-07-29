import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Scrollbar } from "./scrollbar"

describe("Scrollbar", () => {
  it("renders its children", () => {
    render(<Scrollbar>Содержимое</Scrollbar>)
    expect(screen.getByText("Содержимое")).toBeInTheDocument()
  })

  it("defaults to vertical scrolling", () => {
    const { container } = render(<Scrollbar>Содержимое</Scrollbar>)
    const el = container.querySelector('[data-slot="scrollbar"]')!
    expect(el).toHaveAttribute("data-orientation", "vertical")
    expect(el).toHaveClass("overflow-y-auto", "overflow-x-hidden")
  })

  it("switches to horizontal scrolling", () => {
    const { container } = render(
      <Scrollbar orientation="horizontal">Содержимое</Scrollbar>
    )
    const el = container.querySelector('[data-slot="scrollbar"]')!
    expect(el).toHaveAttribute("data-orientation", "horizontal")
    expect(el).toHaveClass("overflow-x-auto", "overflow-y-hidden")
  })

  it("always applies the themed-scrollbar class", () => {
    const { container } = render(<Scrollbar>Содержимое</Scrollbar>)
    expect(container.querySelector('[data-slot="scrollbar"]')).toHaveClass(
      "themed-scrollbar"
    )
  })
})
