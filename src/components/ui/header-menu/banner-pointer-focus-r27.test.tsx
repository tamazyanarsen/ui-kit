import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { BannerCarousel } from "./banner-carousel"

// r27: после щелчка мышью по стрелке или точке фокус оставался на кнопке и
// держал паузу автолистания даже после ухода курсора: карусель замирала до
// щелчка мимо. Пауза по фокусу нужна клавиатуре, а не мыши.

const BANNERS = [
  { title: "Первый", subtitle: "а" },
  { title: "Второй", subtitle: "б" },
]

const track = () =>
  document.querySelector<HTMLElement>('[data-slot="menu-banner-track"]')!.style.transform

function mouseClick(element: HTMLElement) {
  fireEvent.pointerDown(element)
  act(() => element.focus())
  fireEvent.pointerUp(element)
  fireEvent.click(element)
}

describe("BannerCarousel: фокус от мыши", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("после щелчка по стрелке и ухода курсора автолистание идёт дальше", () => {
    render(<BannerCarousel banners={BANNERS} />)
    const root = document.querySelector<HTMLElement>('[data-slot="menu-banner-carousel"]')!
    fireEvent.mouseEnter(root)
    mouseClick(screen.getByRole("button", { name: "Следующий баннер" }))
    expect(track()).toBe("translateX(-100%)")
    fireEvent.mouseLeave(root)
    act(() => vi.advanceTimersByTime(6100))
    expect(track()).toBe("translateX(-0%)")
  })

  it("клавиша на такой кнопке возвращает паузу", () => {
    render(<BannerCarousel banners={BANNERS} />)
    const root = document.querySelector<HTMLElement>('[data-slot="menu-banner-carousel"]')!
    fireEvent.mouseEnter(root)
    const next = screen.getByRole("button", { name: "Следующий баннер" })
    mouseClick(next)
    fireEvent.keyDown(next, { key: "Enter" })
    fireEvent.mouseLeave(root)
    act(() => vi.advanceTimersByTime(7000))
    expect(track()).toBe("translateX(-100%)")
  })
})
