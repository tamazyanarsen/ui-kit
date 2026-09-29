import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { usePageScrollLock } from "@/lib/use-page-scroll-lock"

import { UpButton } from "./up-button"

// Аудит 23: кнопка «Наверх» (z-40, позже в DOM) лежала поверх открытых
// панелей шапки «Меню» и «Создать» и нажималась — прокручивала скрытую
// страницу. В момент открытия она ещё и прыгала вправо на ширину полосы
// прокрутки: блокировка страницы компенсировала только `body`.

function Lock({ active }: { active: boolean }) {
  usePageScrollLock(active)
  return null
}

function showUpButton() {
  Object.defineProperty(window, "scrollY", { configurable: true, value: 2000 })
  render(<UpButton />)
  act(() => {
    window.dispatchEvent(new Event("scroll"))
  })
  return screen.getByRole("button", { name: "Наверх" })
}

describe("UpButton: под открытыми панелями и без прыжка при блокировке", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 })
  })

  it("уходит под оверлей шапки и попапы, как NPS", () => {
    const button = showUpButton()
    expect(button.className).toContain(
      "[:root:has([data-side][data-open],[data-slot=header-menu-overlay])_&]:z-[35]"
    )
  })

  it("отступ справа учитывает снятую полосу прокрутки", () => {
    const button = showUpButton()
    expect(button.className).toContain("right-[calc(1.5rem+var(--scroll-lock-gap,0px))]")
    expect(button.className.split(/\s+/)).not.toContain("right-6")
  })

  it("блокировка страницы публикует ширину полосы и снимает её после", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1280)
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1265)
    const { rerender } = render(<Lock active />)
    expect(document.documentElement.style.getPropertyValue("--scroll-lock-gap")).toBe("15px")
    rerender(<Lock active={false} />)
    expect(document.documentElement.style.getPropertyValue("--scroll-lock-gap")).toBe("")
  })
})
