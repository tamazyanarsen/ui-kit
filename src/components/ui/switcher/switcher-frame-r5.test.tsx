import { render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Switcher } from "./switcher"

// Итоговая проверка №4: у Switcher с шириной снаружи ряд вылезал за рамку.
// Хук считал доступной `clientWidth` корня, а в ней — внутренние отступы
// `p-1` (4 + 4), куда сегменты не встают; резерв под «…» у md был 40 при
// реальных 44 (зазор 4 + кнопка `p-3` вокруг значка 16). Сверено в Chrome:
// до правки md вылезал на 44 ширинах из 601 (до 12.9px), lg — на 20.

const ITEMS = ["a", "b", "c", "d", "e", "f"].map((value) => ({ value, label: value }))
/** Сегмент мерной копии. */
const SEGMENT = 70

const inCopy = (el: Element) => el.closest('[aria-hidden="true"]') !== null
const visibleSegments = () =>
  Array.from(document.querySelectorAll('[data-slot="switcher-item"]')).filter(
    (el) => !inCopy(el)
  )

function mockLayout(clientWidth: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "switcher" ? clientWidth : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const width = this.dataset.slot === "switcher-item" && inCopy(this) ? SEGMENT : 0
    return { width, height: 40, top: 0, left: 0, right: width, bottom: 40 } as DOMRect
  })
  // Отступы корня `p-1` — jsdom классов не считает, подставляем как браузер.
  const original = window.getComputedStyle
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = original.call(window, element, pseudo)
    if ((element as HTMLElement).dataset?.slot !== "switcher") return style
    return new Proxy(style, {
      get: (target, property) =>
        property === "paddingLeft" || property === "paddingRight"
          ? "4px"
          : Reflect.get(target, property),
    })
  })
}

describe("Switcher: ряд не выходит за рамку", () => {
  afterEach(() => vi.restoreAllMocks())

  it("md: отступы корня и настоящий размер «…» учитываются", () => {
    // clientWidth 336 → место под сегменты 328. Четыре сегмента с «…»:
    // 4 × 70 + 3 × 4 + 4 + 40 = 336 > 328 — вылезли бы на 8px. Помещаются три.
    mockLayout(336)
    render(<Switcher items={ITEMS} defaultValue="a" size="md" className="flex w-full" />)
    expect(visibleSegments()).toHaveLength(3)
  })

  it("lg: отступы корня учитываются", () => {
    // clientWidth 348 → место 340. Четыре сегмента с «…» lg:
    // 4 × 70 + 3 × 4 + 4 + 48 = 344 > 340 — вылезли бы на 4px. Помещаются три.
    mockLayout(348)
    render(<Switcher items={ITEMS} defaultValue="a" size="lg" className="flex w-full" />)
    expect(visibleSegments()).toHaveLength(3)
  })

  it("когда все сегменты помещаются в место без отступов — все видны", () => {
    // 6 × 70 + 5 × 4 = 440 ≤ 448 − 8.
    mockLayout(448)
    render(<Switcher items={ITEMS} defaultValue="a" className="flex w-full" />)
    expect(visibleSegments()).toHaveLength(6)
  })
})
