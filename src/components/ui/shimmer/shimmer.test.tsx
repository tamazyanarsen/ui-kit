import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Shimmer } from "./shimmer"

describe("Shimmer", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<Shimmer />)
    expect(container.querySelector('[data-slot="shimmer"]')).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  })

  it("defaults to the square shape", () => {
    const { container } = render(<Shimmer />)
    const el = container.querySelector('[data-slot="shimmer"]')!
    expect(el).toHaveAttribute("data-shape", "square")
    expect(el).toHaveClass("rounded-lg")
  })

  it("switches to the circle shape", () => {
    const { container } = render(<Shimmer shape="circle" />)
    const el = container.querySelector('[data-slot="shimmer"]')!
    expect(el).toHaveAttribute("data-shape", "circle")
    expect(el).toHaveClass("rounded-full")
  })

  it("pulses at a 1.8s cycle", () => {
    // jsdom has no stylesheet/CSS engine, so this checks for the Tailwind
    // utility classes that drive the pulse rather than computed style.
    const { container } = render(<Shimmer />)
    const el = container.querySelector('[data-slot="shimmer"]')!
    expect(el).toHaveClass("animate-pulse", "[animation-duration:1.8s]")
  })

  it("accepts a custom size via className", () => {
    const { container } = render(<Shimmer className="h-6 w-24" />)
    expect(container.querySelector('[data-slot="shimmer"]')).toHaveClass("h-6", "w-24")
  })
})
