import "@/test/desktop-viewport"

import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { PromoCarousel } from "./promo-carousel"

// Правки UI-Kit от 25.10, «Карусель баннеров»: на десктопе два баннера в
// кадре, стрелки при наведении, точек нет; один-два баннера — листать нечего.

const banners = (n: number) =>
  Array.from({ length: n }, (_, i) => <div key={i}>Баннер {i + 1}</div>)

describe("PromoCarousel, десктоп", () => {
  it("два в кадре: по две копии с каждого края, зазор 24, стрелки, без точек", () => {
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    const slides = container.querySelectorAll<HTMLElement>('[data-slot="promo-carousel-slide"]')
    expect(slides).toHaveLength(8)
    expect(slides[0]).toHaveAttribute("inert")
    expect(slides[1]).toHaveAttribute("inert")
    expect(slides[2]).not.toHaveAttribute("inert")
    expect(slides[2].style.width).toContain("100% - 24px")
    expect(screen.getByRole("button", { name: "Предыдущий баннер" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Следующий баннер" })).toBeInTheDocument()
    expect(screen.queryByRole("group", { name: "Баннеры" })).toBeNull()
  })

  it("стрелки видны при наведении на карусель", () => {
    const { container } = render(<PromoCarousel>{banners(3)}</PromoCarousel>)
    const arrow = container.querySelector('[data-slot="promo-carousel-arrow"]') as HTMLElement
    expect(arrow.className).toContain("opacity-0")
    expect(arrow.className).toContain("group-hover/promo:opacity-100")
  })

  it("два баннера — без копий, стрелок и точек", () => {
    const { container } = render(<PromoCarousel>{banners(2)}</PromoCarousel>)
    expect(container.querySelectorAll('[data-slot="promo-carousel-slide"]')).toHaveLength(2)
    expect(screen.queryByRole("button")).toBeNull()
  })
})
