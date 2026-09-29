import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { useFloatingCornerInset } from "./use-floating-corner-inset"

// Проверка правок r22: занятый низ стал составной переменной
// `--floating-bottom: max(…)`, а getComputedStyle отдаёт её строкой
// «max(89px, 0px)» — parseFloat давал NaN, inset считался нулём, и высота
// панели попадала в угол дважды: «Наверх» висел над NPS на 89px выше.

function Card() {
  const ref = useFloatingCornerInset<HTMLDivElement>(true)
  return <div ref={ref} data-card="" />
}

const root = document.documentElement

describe("useFloatingCornerInset: занятый низ вычитается из отступа карточки", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    for (const name of ["--viewport-inset-bottom", "--floating-inset-bottom", "--floating-bottom"]) {
      root.style.removeProperty(name)
    }
  })

  it("панель 89px: в угол входит отступ 40 + высота 234 + зазор 16 = 290", () => {
    root.style.setProperty("--viewport-inset-bottom", "89px")
    root.style.setProperty("--floating-inset-bottom", "0px")
    root.style.setProperty("--floating-bottom", "max(89px, 0px)")

    const realStyle = window.getComputedStyle
    vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudo) => {
      const style = realStyle(el, pseudo)
      if (el instanceof HTMLElement && el.dataset.card !== undefined) {
        return { ...style, bottom: "129px", getPropertyValue: style.getPropertyValue.bind(style) } as CSSStyleDeclaration
      }
      return style
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 234,
      width: 360,
      top: 0,
      left: 0,
      right: 360,
      bottom: 234,
    } as DOMRect)

    const { unmount } = render(<Card />)
    expect(root.style.getPropertyValue("--floating-corner-inset")).toBe(
      "calc(var(--floating-bottom, 0px) + 290px)"
    )
    unmount()
    expect(root.style.getPropertyValue("--floating-corner-inset")).toBe("")
  })

  it("кнопка «Выбрать на всех страницах»: берётся больший из двух вкладов", () => {
    root.style.setProperty("--viewport-inset-bottom", "72px")
    root.style.setProperty("--floating-inset-bottom", "136px")
    root.style.setProperty("--floating-bottom", "max(72px, 136px)")

    const realStyle = window.getComputedStyle
    vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudo) => {
      const style = realStyle(el, pseudo)
      if (el instanceof HTMLElement && el.dataset.card !== undefined) {
        return { ...style, bottom: "176px", getPropertyValue: style.getPropertyValue.bind(style) } as CSSStyleDeclaration
      }
      return style
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 234,
      width: 360,
      top: 0,
      left: 0,
      right: 360,
      bottom: 234,
    } as DOMRect)

    render(<Card />)
    expect(root.style.getPropertyValue("--floating-corner-inset")).toBe(
      "calc(var(--floating-bottom, 0px) + 290px)"
    )
  })
})
