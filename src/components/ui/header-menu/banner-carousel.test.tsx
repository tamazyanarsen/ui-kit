import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { BannerCarousel } from "./banner-carousel"

const BANNERS = [
  { title: "Первый", subtitle: "а" },
  { title: "Второй", subtitle: "б" },
]

const track = () =>
  document.querySelector<HTMLElement>('[data-slot="menu-banner-track"]')!.style.transform

describe("BannerCarousel", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("не листает, пока фокус внутри, даже если курсор ушёл", () => {
    render(<BannerCarousel banners={BANNERS} />)
    const root = document.querySelector<HTMLElement>('[data-slot="menu-banner-carousel"]')!
    const next = screen.getByRole("button", { name: "Следующий баннер" })

    fireEvent.mouseEnter(root)
    act(() => next.focus())
    fireEvent.mouseLeave(root)
    act(() => vi.advanceTimersByTime(7000))
    expect(track()).toBe("translateX(-0%)")
  })

  it("не листает под курсором после ухода фокуса наружу", () => {
    render(
      <>
        <BannerCarousel banners={BANNERS} />
        <button type="button">снаружи</button>
      </>
    )
    const root = document.querySelector<HTMLElement>('[data-slot="menu-banner-carousel"]')!
    fireEvent.mouseEnter(root)
    act(() => screen.getByRole("button", { name: "Следующий баннер" }).focus())
    act(() => screen.getByRole("button", { name: "снаружи" }).focus())
    act(() => vi.advanceTimersByTime(7000))
    expect(track()).toBe("translateX(-0%)")
  })

  it("уехавшие слайды инертны", () => {
    render(<BannerCarousel banners={BANNERS} />)
    const slides = document.querySelectorAll('[data-slot="menu-banner-track"] > div')
    expect(slides[0]).not.toHaveAttribute("inert")
    expect(slides[1]).toHaveAttribute("inert")
  })
})
