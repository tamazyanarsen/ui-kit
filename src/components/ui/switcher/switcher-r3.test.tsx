import { act, render } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Switcher } from "./switcher"

// Итоговая проверка №2: корень Switcher — `inline-flex` и ужимается по
// содержимому. Меря сам себя, он после ухода сегментов в «…» сужался до
// видимых и больше не разворачивался, сколько бы места ни появилось у
// родителя.

const ITEMS = ["a", "b", "c", "d", "e"].map((value) => ({ value, label: value }))
const SEGMENT = 100
const GAP = 4
const TRIGGER = 40

let hostWidth = 0
/** Ширина корня, заданная снаружи (`w-[300px]`); `null` — по содержимому. */
let fixedRoot: number | null = null

const inCopy = (el: Element) => el.closest('[aria-hidden="true"]') !== null
const visibleSegments = () =>
  Array.from(document.querySelectorAll('[data-slot="switcher-item"]')).filter(
    (el) => !inCopy(el)
  )

function rowWidth() {
  const n = visibleSegments().length
  return n * SEGMENT + Math.max(0, n - 1) * GAP
}

function contentWidth() {
  const trigger = document.querySelector('[data-slot="switcher-overflow-trigger"]')
  return rowWidth() + (trigger ? TRIGGER : 0)
}

/** Раскладка inline-flex: корень = содержимое, но не шире родителя. */
function rootWidth() {
  return fixedRoot ?? Math.min(contentWidth(), hostWidth)
}

function mockLayout() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    // Растянутый на время замера корень получает всю ширину родителя.
    if (this.dataset.slot === "switcher") {
      const stretched = this.style.width === "100%" || this.style.flex === "1 1 auto"
      return stretched ? hostWidth : rootWidth()
    }
    if (this.dataset.testid === "host") return hostWidth
    return 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    let width = 0
    if (this.dataset.slot === "switcher-item" && inCopy(this)) width = SEGMENT
    else if (this.dataset.slot === "switcher-row") width = rowWidth()
    else if (this.dataset.slot === "switcher-overflow-trigger") width = TRIGGER
    else if (this.dataset.slot === "switcher") width = rootWidth()
    else if (this.dataset.testid === "host") width = hostWidth
    return { width, height: 40, top: 0, left: 0, right: width, bottom: 40 } as DOMRect
  })
}

describe("Switcher: ряд по ширине содержимого", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    fixedRoot = null
  })

  it("свернувшись в узком родителе, разворачивается, когда место появилось", () => {
    hostWidth = 250
    mockLayout()
    render(
      <div data-testid="host">
        <Switcher items={ITEMS} defaultValue="a" />
      </div>
    )
    expect(visibleSegments().length).toBeLessThan(ITEMS.length)

    hostWidth = 2000
    act(() => {
      window.dispatchEvent(new Event("resize"))
    })
    expect(visibleSegments()).toHaveLength(ITEMS.length)
  })

  it("корень с заданной снаружи шириной по-прежнему меряет сам себя", () => {
    // Корень 300 (например, `w-[300px]`) шире своего свёрнутого содержимого:
    // место у родителя ему не принадлежит, и все пять сегментов не влезают.
    hostWidth = 2000
    fixedRoot = 300
    mockLayout()
    render(
      <div data-testid="host">
        <Switcher items={ITEMS} defaultValue="a" className="w-[300px]" />
      </div>
    )
    expect(visibleSegments().length).toBeLessThan(ITEMS.length)
  })
})
