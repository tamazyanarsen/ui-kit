import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Thumbnail } from "./thumbnail"

describe("Thumbnail", () => {
  it("exposes its type and size via data attributes", () => {
    const { container } = render(<Thumbnail type="card" size="l" />)
    const el = container.querySelector('[data-slot="thumbnail"]')!
    expect(el).toHaveAttribute("data-type", "card")
    expect(el).toHaveAttribute("data-size", "l")
  })

  it("renders an icon-status glyph with its tinted background", () => {
    const { container } = render(<Thumbnail type="check" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders a real image for the picture type when src is given", () => {
    render(<Thumbnail type="picture" src="/avatar.png" alt="Аватар" />)
    expect(screen.getByRole("img", { name: "Аватар" })).toHaveAttribute("src", "/avatar.png")
  })

  it("falls back to a placeholder icon for the picture type without src", () => {
    const { container } = render(<Thumbnail type="picture" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("renders a counter badge when count is given", () => {
    render(<Thumbnail type="card" count={2} />)
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("renders a status dot when showDot is set", () => {
    const { container } = render(<Thumbnail type="card" showDot />)
    expect(container.querySelector('[data-type="point"]')).toBeInTheDocument()
  })

  it("renders the SBP last-4 suffix", () => {
    render(<Thumbnail type="sbp-card" last4="1234" />)
    expect(screen.getByText("· 1234")).toBeInTheDocument()
  })

  it("marks itself disabled via data attribute", () => {
    const { container } = render(<Thumbnail type="card" disabled />)
    expect(container.querySelector('[data-slot="thumbnail"]')).toHaveAttribute(
      "data-disabled",
      "true"
    )
  })
})
