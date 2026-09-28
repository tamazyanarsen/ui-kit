import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { useViewportInsetBottom } from "./use-viewport-inset-bottom"

// Круг проверки r3: правило «касается низа» сравнивало низ полосы с
// `innerHeight`, а он включает горизонтальную полосу прокрутки страницы.
// Вживую: innerHeight 900, clientHeight 885, sticky-панель внизу 885 —
// публиковался 0, и контейнер таблицы вырос на высоту панели.

function Bar() {
  const ref = useViewportInsetBottom<HTMLDivElement>(true)
  return <div ref={ref} />
}

const inset = () =>
  document.documentElement.style.getPropertyValue("--viewport-inset-bottom")

/** Окно 900, видимая область 885 (полоса прокрутки 15), панель 89. */
function placeBar(top: number) {
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(900)
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(885)
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + 89,
    height: 89,
    left: 0,
    right: 100,
    width: 100,
  } as DOMRect)
}

describe("useViewportInsetBottom: низ видимой области без полосы прокрутки", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("sticky-панель над горизонтальной полосой прокрутки публикует свою высоту", () => {
    placeBar(796)
    render(<Bar />)
    expect(inset()).toBe("89px")
  })

  it("панель посреди страницы по-прежнему ничего не закрывает", () => {
    placeBar(300)
    render(<Bar />)
    expect(inset()).toBe("0px")
  })

  // Мобильный браузер спрятал адресную строку: `clientHeight` остался 844
  // (высота с показанной строкой), `innerHeight` вырос до 900, и fixed-
  // панель уехала к новому низу — 812…900. Считая от `clientHeight`,
  // перекрытие занижалось до 32 вместо 88.
  it("при спрятанной адресной строке публикуется вся высота панели", () => {
    mockVisual({ inner: 900, client: 844, visual: 900, top: 812, height: 88 })
    render(<Bar />)
    expect(inset()).toBe("88px")
  })

  // Круг r3c: касание низа проверялось по `clientHeight`, а перекрытие — до
  // `innerHeight`. На мобильном панель в 40px НАД краем считалась
  // касающейся; на десктопе панель, въезжающая снизу, завышала вклад на
  // высоту полосы прокрутки. Низ видимой области — `visualViewport`.
  it("мобильный: панель над краем экрана при спрятанной строке ничего не закрывает", () => {
    mockVisual({ inner: 900, client: 844, visual: 900, top: 772, height: 88 })
    render(<Bar />)
    expect(inset()).toBe("0px")
  })

  it("десктоп: панель, въезжающая снизу, закрывает только видимую часть", () => {
    mockVisual({ inner: 900, client: 885, visual: 885, top: 850, height: 89 })
    render(<Bar />)
    expect(inset()).toBe("35px")
  })
})

function mockVisual(o: { inner: number; client: number; visual: number; top: number; height: number }) {
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(o.inner)
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(o.client)
  vi.stubGlobal("visualViewport", { height: o.visual, offsetTop: 0 })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: o.top,
    bottom: o.top + o.height,
    height: o.height,
    left: 0,
    right: 100,
    width: 100,
  } as DOMRect)
}
