import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { useViewportInsetBottom } from "./use-viewport-inset-bottom"

// Итоговая проверка №2: полоса посреди страницы или прокрученная выше
// экрана публиковала всю свою высоту — формула отличала только «ниже экрана»
// от «не ниже».

function Bar() {
  const ref = useViewportInsetBottom<HTMLDivElement>(true)
  return <div ref={ref} />
}

const inset = () =>
  document.documentElement.style.getPropertyValue("--viewport-inset-bottom")

/** Полоса высотой 88 с верхом на `top` при окне высотой 900. */
function placeBar(top: number) {
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(900)
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + 88,
    height: 88,
    left: 0,
    right: 100,
    width: 100,
  } as DOMRect)
}

describe("useViewportInsetBottom: перекрытие нижнего края", () => {
  afterEach(() => vi.restoreAllMocks())

  it("полоса у нижнего края публикует свою высоту", () => {
    placeBar(812)
    render(<Bar />)
    expect(inset()).toBe("88px")
  })

  it("полоса посреди экрана ничего не закрывает", () => {
    placeBar(300)
    render(<Bar />)
    expect(inset()).toBe("0px")
  })

  it("полоса, прокрученная выше экрана, ничего не закрывает", () => {
    placeBar(-300)
    render(<Bar />)
    expect(inset()).toBe("0px")
  })

  it("полоса, наполовину ушедшая за нижний край, публикует видимую часть", () => {
    placeBar(860)
    render(<Bar />)
    expect(inset()).toBe("40px")
  })
})
