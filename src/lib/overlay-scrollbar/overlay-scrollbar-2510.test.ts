import { afterEach, describe, expect, it, vi } from "vitest"

import { computeThumb, dragDelta, trackClickTarget } from "./geometry"
import { IDLE_HIDE_MS, VisibilityController } from "./visibility"
import { createWheelHandoffState, decideWheel, type WheelInput } from "./wheel-handoff"

// Правки UI-Kit от 25.10: «Scrollbar — родные полосы браузера вместо полос
// кита» и «Scrollbar — видимость полосы и передача прокрутки странице».

describe("геометрия бегунка", () => {
  it("длина пропорциональна видимой доле, сдвиг — пройденной", () => {
    // 200 из 1000 видно, дорожка 200 → бегунок 40; на середине пути — 80.
    expect(computeThumb({ client: 200, scroll: 1000, position: 0 }, 200)).toEqual({
      scrollable: true,
      size: 40,
      offset: 0,
    })
    expect(computeThumb({ client: 200, scroll: 1000, position: 400 }, 200).offset).toBe(80)
    expect(computeThumb({ client: 200, scroll: 1000, position: 800 }, 200).offset).toBe(160)
  })

  it("бегунок не короче 24", () => {
    const thumb = computeThumb({ client: 100, scroll: 100_000, position: 0 }, 100)
    expect(thumb.size).toBe(24)
  })

  it("прокручивать нечего — полосы нет", () => {
    expect(computeThumb({ client: 200, scroll: 200.5, position: 0 }, 200).scrollable).toBe(false)
  })

  it("перетаскивание переводит путь бегунка в путь области", () => {
    // путь бегунка 160 соответствует пути области 800
    expect(dragDelta(40, { client: 200, scroll: 1000 }, 200, 40)).toBe(200)
  })

  it("нажатие на дорожку листает на 90 % высоты в сторону нажатия", () => {
    const metrics = { client: 200, scroll: 1000, position: 400 }
    const thumb = computeThumb(metrics, 200)
    expect(trackClickTarget(metrics, thumb, 190)).toBe(580)
    expect(trackClickTarget(metrics, thumb, 5)).toBe(220)
    // по самому бегунку — без прокрутки
    expect(trackClickTarget(metrics, thumb, thumb.offset + 1)).toBe(400)
    // и не дальше краёв
    expect(trackClickTarget({ ...metrics, position: 790 }, thumb, 199)).toBe(800)
  })
})

describe("видимость полосы", () => {
  afterEach(() => vi.useRealTimers())

  it("always — видна, пока есть что прокручивать", () => {
    const onChange = vi.fn()
    const v = new VisibilityController(onChange)
    v.set({ mode: "always", scrollable: true })
    expect(v.visible).toBe(true)
    v.set({ scrollable: false })
    expect(v.visible).toBe(false)
  })

  it("hover — при наведении и во время прокрутки", () => {
    vi.useFakeTimers()
    const v = new VisibilityController(() => {})
    v.set({ mode: "hover", scrollable: true })
    expect(v.visible).toBe(false)
    v.set({ hovered: true })
    expect(v.visible).toBe(true)
    v.set({ hovered: false })
    v.activity()
    expect(v.visible).toBe(true)
    vi.advanceTimersByTime(IDLE_HIDE_MS - 1)
    expect(v.visible).toBe(true)
    vi.advanceTimersByTime(1)
    expect(v.visible).toBe(false)
  })

  it("scroll — гаснет через 800 мс после последней прокрутки, отсчёт заново", () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    const v = new VisibilityController(onChange)
    v.set({ mode: "scroll", scrollable: true })
    expect(v.visible).toBe(false)
    v.activity()
    vi.advanceTimersByTime(600)
    v.activity()
    vi.advanceTimersByTime(600)
    expect(v.visible).toBe(true)
    vi.advanceTimersByTime(200)
    expect(v.visible).toBe(false)
    expect(onChange.mock.calls.map(([visible]) => visible)).toEqual([false, true, false])
  })

  it("перетаскивание держит полосу, отпустили — гаснет через 800 мс", () => {
    vi.useFakeTimers()
    const v = new VisibilityController(() => {})
    v.set({ mode: "scroll", scrollable: true, dragging: true })
    vi.advanceTimersByTime(5000)
    expect(v.visible).toBe(true)
    v.set({ dragging: false })
    expect(v.visible).toBe(true)
    vi.advanceTimersByTime(IDLE_HIDE_MS)
    expect(v.visible).toBe(false)
  })
})

describe("передача колеса", () => {
  const base: Omit<WheelInput, "now"> = {
    delta: 100,
    position: 800,
    client: 200,
    scroll: 1000,
    lastBlockMove: -Infinity,
    lastPageMove: -Infinity,
  }

  it("блок докрутили до края сами — держит колесо 500 мс, потом странице", () => {
    const state = createWheelHandoffState()
    const at = (now: number) => decideWheel(state, { ...base, now, lastBlockMove: 950 })
    expect(at(1000)).toBe("hold")
    expect(at(1100)).toBe("hold")
    expect(at(1300)).toBe("hold")
    expect(at(1499)).toBe("hold")
    expect(at(1500)).toBe("page")
    expect(at(1600)).toBe("page")
  })

  it("блок уже стоял у края — сразу странице", () => {
    const state = createWheelHandoffState()
    expect(decideWheel(state, { ...base, now: 1000, lastBlockMove: 500 })).toBe("page")
  })

  it("блоку прокручивать нечего — колесо странице, браузер справляется сам", () => {
    const state = createWheelHandoffState()
    expect(decideWheel(state, { ...base, scroll: 200, now: 1000, lastBlockMove: 990 })).toBe("native")
  })

  it("есть куда ехать и страница стоит — браузер листает блок сам", () => {
    const state = createWheelHandoffState()
    expect(decideWheel(state, { ...base, position: 300, now: 1000 })).toBe("native")
  })

  it("страница двигалась, блок стоял — блок подхватывает колесо до конца жеста", () => {
    const state = createWheelHandoffState()
    const input = { ...base, position: 300, lastPageMove: 900 }
    expect(decideWheel(state, { ...input, now: 1000 })).toBe("block")
    // жест продолжается (паузы ≤ 200), страница давно стоит — всё ещё блок
    expect(decideWheel(state, { ...input, now: 1150, lastPageMove: 900, lastBlockMove: 1100 })).toBe("block")
    expect(decideWheel(state, { ...input, now: 1350, lastPageMove: 900, lastBlockMove: 1300 })).toBe("block")
    // пауза > 200 — новый жест, страница стоит: браузер листает блок сам
    expect(decideWheel(state, { ...input, now: 1700, lastPageMove: 900, lastBlockMove: 1300 })).toBe("native")
  })

  it("блок двигался недавно — страница не перехватывает", () => {
    const state = createWheelHandoffState()
    expect(
      decideWheel(state, { ...base, position: 300, now: 1000, lastPageMove: 950, lastBlockMove: 960 })
    ).toBe("native")
  })

  it("держание у края сбрасывается, когда блоку снова есть куда ехать", () => {
    const state = createWheelHandoffState()
    expect(decideWheel(state, { ...base, now: 1000, lastBlockMove: 990 })).toBe("hold")
    expect(decideWheel(state, { ...base, delta: -100, now: 1050, lastBlockMove: 990 })).toBe("native")
    expect(decideWheel(state, { ...base, now: 1100, lastBlockMove: 1060 })).toBe("hold")
  })
})
