import { render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Switcher } from "./switcher"

// Итоговая проверка №3: замер «места у родителя» (корень на время замера
// растягивали `flex: 1 1 auto`, `min-width: 0`) рядом с обрезаемым
// заголовком (`<h2 class="truncate">` без `flex-1`) делил нехватку места
// с заголовком — мера выходила меньше собственной ширины переключателя, и
// ряд сворачивался до одного сегмента, хотя в своей ширине помещался весь.
// Замер откачен: переключатель меряет сам себя.

const ITEMS = ["a", "b", "c", "d", "e"].map((value) => ({ value, label: value }))
const SEGMENT = 100
/** Пять сегментов с зазорами — 516, плюс отступы корня 8 и рамка 2. */
const OWN = 526
/** Что дала бы растянутая мера рядом с длинным заголовком (Chrome: 248). */
const SQUEEZED = 248

const inCopy = (el: Element) => el.closest('[aria-hidden="true"]') !== null
const visibleSegments = () =>
  Array.from(document.querySelectorAll('[data-slot="switcher-item"]')).filter(
    (el) => !inCopy(el)
  )

function mockLayout(ownWidth: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.dataset.slot !== "switcher") return 0
    // Растянутый корень делит нехватку места с обрезаемым заголовком.
    const stretched = this.style.flex === "1 1 auto" || this.style.width === "100%"
    return stretched ? SQUEEZED : ownWidth
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    let width = 0
    if (this.dataset.slot === "switcher-item" && inCopy(this)) width = SEGMENT
    // Видимый ряд равен корню: корень ужат по содержимому (`inline-flex`).
    else if (this.dataset.slot === "switcher-row") width = ownWidth
    else if (this.dataset.slot === "switcher") width = ownWidth
    return { width, height: 40, top: 0, left: 0, right: width, bottom: 40 } as DOMRect
  })
}

describe("Switcher: мера — собственная ширина переключателя", () => {
  afterEach(() => vi.restoreAllMocks())

  it("рядом с обрезаемым заголовком помещающийся ряд не сворачивается", () => {
    mockLayout(OWN)
    render(
      <div style={{ display: "flex", justifyContent: "space-between", width: 600 }}>
        <h2 className="truncate">Очень длинный заголовок раздела, который обрезается</h2>
        <Switcher items={ITEMS} defaultValue="a" />
      </div>
    )
    expect(visibleSegments()).toHaveLength(ITEMS.length)
  })

  it("переключатель уже своих сегментов уходит в «…»", () => {
    // Ширина задана снаружи (`w-[300px]`): все пять не помещаются.
    mockLayout(300)
    render(<Switcher items={ITEMS} defaultValue="a" className="w-[300px]" />)
    expect(visibleSegments().length).toBeLessThan(ITEMS.length)
  })
})
