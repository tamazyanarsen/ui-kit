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
    expect(el).toHaveClass("rounded-[8px]")
  })

  it("switches to the circle shape", () => {
    const { container } = render(<Shimmer shape="circle" />)
    const el = container.querySelector('[data-slot="shimmer"]')!
    expect(el).toHaveAttribute("data-shape", "circle")
    expect(el).toHaveClass("rounded-full")
  })

  it("sweeps a gradient highlight instead of pulsing opacity", () => {
    // Дизайн-чек 08.10, замечание 18. В jsdom нет движка CSS, поэтому
    // проверяется утилита перелива (styles/motion.css), а не вычисленный
    // стиль; пульсации прозрачности быть не должно.
    const { container } = render(<Shimmer />)
    const el = container.querySelector('[data-slot="shimmer"]')!
    expect(el).toHaveClass("shimmer-sweep")
    expect(el).not.toHaveClass("animate-pulse")
  })

  it("accepts a custom size via className", () => {
    const { container } = render(<Shimmer className="h-6 w-24" />)
    expect(container.querySelector('[data-slot="shimmer"]')).toHaveClass("h-6", "w-24")
  })
})
