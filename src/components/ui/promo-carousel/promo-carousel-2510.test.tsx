import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { PromoCarousel } from "./promo-carousel"

// Правки UI-Kit от 25.10: «Карусель баннеров в мобильном виде» и правило
// каркаса «Механики свайпов». В jsdom — мобильный вид (один баннер в кадре).
//
// Раскладки в jsdom нет, поэтому шаг ленты подставлен: слот 300 + зазор 16.
const STEP = 316
let restore: (() => void) | undefined

beforeAll(() => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetLeft")
  Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
    configurable: true,
    get(this: HTMLElement) {
      if (this.dataset.slot !== "promo-carousel-slide" || !this.parentElement) return 0
      return Array.from(this.parentElement.children).indexOf(this) * STEP
    },
  })
  restore = () => {
    if (original) Object.defineProperty(HTMLElement.prototype, "offsetLeft", original)
  }
})
afterAll(() => restore?.())

const banners = (n: number) =>
  Array.from({ length: n }, (_, i) => <div key={i}>Баннер {i + 1}</div>)

function track(container: HTMLElement) {
  return container.querySelector('[data-slot="promo-carousel-track"]') as HTMLElement
}

function stopScroll(el: HTMLElement) {
  act(() => {
    el.dispatchEvent(new Event("scrollend"))
    vi.advanceTimersByTime(200)
  })
}

describe("PromoCarousel, мобильный вид", () => {
  it("копии крайних баннеров по краям — inert и aria-hidden", () => {
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    const slides = container.querySelectorAll('[data-slot="promo-carousel-slide"]')
    expect(slides).toHaveLength(6)
    expect(slides[0]).toHaveTextContent("Баннер 4")
    expect(slides[5]).toHaveTextContent("Баннер 1")
    for (const clone of [slides[0], slides[5]]) {
      expect(clone).toHaveAttribute("aria-hidden", "true")
      expect(clone).toHaveAttribute("inert")
    }
    expect(slides[1]).not.toHaveAttribute("inert")
  })

  it("лента стартует на первом настоящем баннере", () => {
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    expect(track(container).scrollLeft).toBe(STEP)
  })

  it("нативная прокрутка со scroll-snap, без стрелок, точки от баннера 12", () => {
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    expect(track(container).className).toContain("snap-mandatory")
    expect(track(container).className).toContain("gap-4")
    expect(container.querySelector('[data-slot="promo-carousel-arrow"]')).toBeNull()
    const dots = screen.getByRole("group", { name: "Баннеры" })
    expect(dots.className).toContain("mt-3")
    expect(screen.getAllByRole("button", { name: /Баннер \d из 4/ })).toHaveLength(4)
  })

  it("остановка на копии слева — перескок на последний настоящий, точка 4", () => {
    vi.useFakeTimers()
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    const el = track(container)
    el.scrollLeft = 0
    fireEvent.scroll(el)
    stopScroll(el)
    expect(el.scrollLeft).toBe(4 * STEP)
    expect(screen.getByRole("button", { name: "Баннер 4 из 4" })).toHaveAttribute("aria-current", "true")
    vi.useRealTimers()
  })

  it("остановка на копии справа — перескок на первый, точка 1", () => {
    vi.useFakeTimers()
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    const el = track(container)
    el.scrollLeft = 5 * STEP
    fireEvent.scroll(el)
    stopScroll(el)
    expect(el.scrollLeft).toBe(STEP)
    expect(screen.getByRole("button", { name: "Баннер 1 из 4" })).toHaveAttribute("aria-current", "true")
    vi.useRealTimers()
  })

  it("точка листает к своему баннеру кратчайшим путём по кругу", () => {
    const { container } = render(<PromoCarousel>{banners(4)}</PromoCarousel>)
    const el = track(container)
    const scrollTo = vi.fn()
    el.scrollTo = scrollTo as unknown as typeof el.scrollTo
    fireEvent.click(screen.getByRole("button", { name: "Баннер 3 из 4" }))
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: 3 * STEP }))
    // С первого на последний — назад через копию слева, а не через весь круг.
    fireEvent.click(screen.getByRole("button", { name: "Баннер 1 из 4" }))
    fireEvent.click(screen.getByRole("button", { name: "Баннер 4 из 4" }))
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: 0 }))
  })

  it("один баннер — без копий, прокрутки и точек", () => {
    const { container } = render(<PromoCarousel>{banners(1)}</PromoCarousel>)
    expect(container.querySelectorAll('[data-slot="promo-carousel-slide"]')).toHaveLength(1)
    expect(track(container).className).not.toContain("snap-mandatory")
    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("PromoCarousel: дети во фрагменте", () => {
  it("баннеры, обёрнутые в <>…</>, — отдельные слайды, а не один", () => {
    const { container } = render(<PromoCarousel>{<>{banners(4)}</>}</PromoCarousel>)
    const real = container.querySelectorAll('[data-slot="promo-carousel-slide"]:not([data-clone])')
    expect(real.length).toBe(4)
  })
})
