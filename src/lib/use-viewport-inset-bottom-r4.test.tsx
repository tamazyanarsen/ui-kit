import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render } from "@testing-library/react"

import { useViewportInsetBottom } from "./use-viewport-inset-bottom"

// Итоговая проверка №3: вклад полосы пересчитывался только по scroll,
// resize и размеру самой полосы. Когда менялась высота содержимого над
// sticky-полосой (строки пришли асинхронно, фильтр оставил 0 строк), полоса
// начинала или переставала касаться низа экрана, а вклад оставался прежним
// до первой прокрутки.

const observed: { cb: ResizeObserverCallback; els: Set<Element> }[] = []
class FakeObserver {
  entry: { cb: ResizeObserverCallback; els: Set<Element> }
  constructor(cb: ResizeObserverCallback) {
    this.entry = { cb, els: new Set() }
    observed.push(this.entry)
  }
  observe(el: Element) {
    this.entry.els.add(el)
  }
  unobserve(el: Element) {
    this.entry.els.delete(el)
  }
  disconnect() {
    this.entry.els.clear()
  }
}

function Bar() {
  const ref = useViewportInsetBottom<HTMLDivElement>(true)
  return <div ref={ref} />
}

const inset = () =>
  document.documentElement.style.getPropertyValue("--viewport-inset-bottom")

let barTop = 0
/** Страница изменила размер — сообщают наблюдатели, следящие за корнем. */
function pageResized() {
  for (const { cb, els } of observed) {
    if (els.has(document.documentElement)) cb([], {} as ResizeObserver)
  }
}

describe("useViewportInsetBottom: высота страницы изменилась без прокрутки", () => {
  const original = globalThis.ResizeObserver
  beforeEach(() => {
    observed.length = 0
    globalThis.ResizeObserver = FakeObserver as unknown as typeof ResizeObserver
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(700)
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(700)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top: barTop,
          bottom: barTop + 88,
          height: 88,
          left: 0,
          right: 100,
          width: 100,
        }) as DOMRect
    )
  })
  afterEach(() => {
    globalThis.ResizeObserver = original
    vi.restoreAllMocks()
  })

  it("страница выросла — прилипшая к низу полоса публикует свою высоту", () => {
    barTop = 100
    render(<Bar />)
    expect(inset()).toBe("0px")

    // Строки пришли: страница выше экрана, полоса прилипла к низу.
    barTop = 612
    act(() => pageResized())
    expect(inset()).toBe("88px")
  })

  it("страница сжалась — полоса посреди экрана больше ничего не закрывает", () => {
    barTop = 612
    render(<Bar />)
    expect(inset()).toBe("88px")

    barTop = 100
    act(() => pageResized())
    expect(inset()).toBe("0px")
  })
})
