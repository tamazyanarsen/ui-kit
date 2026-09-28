import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Аудит r6: `useOverflowCount` считал доступной всю `clientWidth`
// контейнера — вместе с внутренними отступами, куда пункты не встают.
// Вычитал их только Switcher, сам; Tabs с `className="px-4"`, полоса
// избранного и ButtonMenuRow заезжали на отступы и вылезали за рамку.
// Теперь отступы меряет сам хук. В jsdom вьюпорт мобильный — зазор 24.

const items = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    value: String(index),
    label: `Tab ${index}`,
  }))

/** Лента шириной `width` с отступами `padding` по бокам, вкладка — 100. */
function mockRow(width: number, padding: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "tabs" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.slot === "tabs-item" ? 100 : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
  // Классы jsdom не считает — отступы `px-4` подставляем, как браузер.
  const original = window.getComputedStyle
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = original.call(window, element, pseudo)
    if ((element as HTMLElement).dataset?.slot !== "tabs") return style
    return new Proxy(style, {
      get: (target, property) =>
        property === "paddingLeft" || property === "paddingRight"
          ? `${padding}px`
          : Reflect.get(target, property),
    })
  })
}

describe("Tabs: внутренние отступы ленты — не место под вкладки", () => {
  afterEach(() => vi.restoreAllMocks())

  it("вкладка, заезжающая на отступ, уходит в «…»", () => {
    // 4 × 100 + 3 × 24 = 472 ≤ 480, но с отступами 16 + 16 места 448.
    // С «…» (24 + 16): 40 + 100 + 24 + 100 + 24 + 100 = 388 — видны три.
    mockRow(480, 16)
    render(<Tabs items={items(4)} showMore={false} className="px-4" />)
    expect(screen.getAllByRole("tab")).toHaveLength(3)
  })

  it("без отступов та же лента помещается целиком", () => {
    mockRow(480, 0)
    render(<Tabs items={items(4)} showMore={false} />)
    expect(screen.getAllByRole("tab")).toHaveLength(4)
  })
})
