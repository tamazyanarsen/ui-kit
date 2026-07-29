import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Badge } from "./badge"

describe("Badge", () => {
  it("renders the counter value", () => {
    render(<Badge type="counter" value={7} />)
    expect(screen.getByText("7")).toBeInTheDocument()
  })

  it("caps the counter display at 99+", () => {
    render(<Badge type="counter" value={143} />)
    expect(screen.getByText("99+")).toBeInTheDocument()
  })

  it("floors fractional/negative counter values", () => {
    const { rerender } = render(<Badge type="counter" value={4.9} />)
    expect(screen.getByText("4")).toBeInTheDocument()

    rerender(<Badge type="counter" value={-3} />)
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("renders no text for the point type", () => {
    const { container } = render(<Badge type="point" />)
    expect(container.querySelector('[data-slot="badge"]')).toBeEmptyDOMElement()
  })

  it("applies the requested color as its background", () => {
    const { container } = render(<Badge type="counter" value={1} color="black" />)
    expect(container.querySelector('[data-slot="badge"]')).toHaveStyle({
      backgroundColor: "var(--badge-black-bg)",
    })
  })

  it("collapses to the muted disabled palette when disabled", () => {
    const { container } = render(<Badge type="counter" value={1} color="red" disabled />)
    expect(container.querySelector('[data-slot="badge"]')).toHaveStyle({
      backgroundColor: "var(--badge-disabled-bg)",
    })
  })
})
