import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { useOverflowCount } from "./use-overflow-count"

// Управляемая заглушка ResizeObserver: запоминает наблюдаемые узлы и даёт
// тесту самому «сообщить» об изменении размера.
const observers: { cb: ResizeObserverCallback; els: Set<Element> }[] = []
class FakeObserver {
  entry: { cb: ResizeObserverCallback; els: Set<Element> }
  constructor(cb: ResizeObserverCallback) {
    this.entry = { cb, els: new Set() }
    observers.push(this.entry)
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

const widths = new Map<string, number>()

function Row() {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(3, 0)
  return (
    <div ref={containerRef} data-testid="row">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-w={String(i)}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
        />
      ))}
      <output>{visibleCount}</output>
    </div>
  )
}

describe("useOverflowCount", () => {
  const original = globalThis.ResizeObserver
  beforeEach(() => {
    observers.length = 0
    globalThis.ResizeObserver = FakeObserver as unknown as typeof ResizeObserver
    widths.set("0", 50).set("1", 50).set("2", 50)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      return { width: widths.get(this.dataset.w ?? "") ?? 0 } as DOMRect
    })
  })
  afterEach(() => {
    globalThis.ResizeObserver = original
    vi.restoreAllMocks()
  })

  it("пересчитывает счёт, когда меняется ширина пункта при том же их числе", () => {
    render(<Row />)
    expect(screen.getByRole("status").textContent).toBe("3")

    const item = document.querySelector('[data-w="2"]')!
    const observer = observers.find((entry) => entry.els.has(item))
    // Мерная копия пункта обязана быть под наблюдением.
    expect(observer).toBeDefined()

    widths.set("2", 150)
    act(() => observer!.cb([], {} as ResizeObserver))
    expect(screen.getByRole("status").textContent).toBe("2")
  })
})
