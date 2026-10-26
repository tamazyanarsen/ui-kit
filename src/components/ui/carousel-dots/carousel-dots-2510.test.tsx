import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { CarouselDots } from "./carousel-dots"

// Правки UI-Kit от 25.10, пункт «Постраничный список и точки карусели».

describe("CarouselDots", () => {
  it("одна страница — ничего не рисуется", () => {
    const { container } = render(<CarouselDots count={1} active={0} />)
    expect(container.firstChild).toBeNull()
  })

  it("по точке на страницу, у текущей aria-current", () => {
    render(<CarouselDots count={3} active={1} onSelect={() => {}} />)
    const dots = screen.getAllByRole("button")
    expect(dots).toHaveLength(3)
    expect(dots[1]).toHaveAttribute("aria-current", "true")
    expect(dots[0]).not.toHaveAttribute("aria-current")
    expect(dots[2]).toHaveAccessibleName("Страница 3 из 3")
  })

  it("нажатие на точку листает к своей странице", () => {
    const onSelect = vi.fn()
    render(<CarouselDots count={4} active={0} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole("button")[2])
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it("ячейки вплотную: 12 / 16 в ширину, круг 6 / 8, зона нажатия 24", () => {
    render(<CarouselDots count={2} active={0} onSelect={() => {}} />)
    const dot = screen.getAllByRole("button")[0]
    expect(dot.className).toContain("w-3")
    expect(dot.className).toContain("desktop:w-4")
    expect(dot.className).toContain("before:h-6")
    const circle = dot.firstElementChild as HTMLElement
    expect(circle.className).toContain("size-1.5")
    expect(circle.className).toContain("desktop:size-2")
    expect(screen.getByRole("group").className).not.toMatch(/\bgap-/)
  })

  it("цвета: обычная, наведение, текущая и нажатая — токены точек, переход 200 мс", () => {
    render(<CarouselDots count={2} active={0} onSelect={() => {}} />)
    const [current, other] = screen.getAllByRole("button").map((b) => b.firstElementChild as HTMLElement)
    expect(current.className).toContain("bg-[var(--carousel-dots-fg-current)]")
    expect(other.className).toContain("bg-[var(--carousel-dots-fg)]")
    expect(other.className).toContain("group-hover/dot:bg-[var(--carousel-dots-fg-hover)]")
    expect(other.className).toContain("group-active/dot:bg-[var(--carousel-dots-fg-current)]")
    expect(other.className).toContain("duration-[var(--duration-color)]")
  })
})
