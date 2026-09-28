import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tabs } from "@/components/ui/tabs"

import { useOverflowCount } from "./use-overflow-count"

// Итоговая проверка №3: пункты переставили, а их ЧИСЛО прежнее. Зависимости
// пересчёта не менялись, мерные копии с ключом по значению — те же узлы того
// же размера, и ResizeObserver молчал: ряд держал прежнее число видимых
// пунктов, хотя в начало переехали длинные, и вылезал за контейнер.

const WIDTH: Record<string, number> = { a: 60, b: 60, c: 60, D: 200, E: 200 }

function Row({ order }: { order: string[] }) {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(order.length, 40, 0)
  return (
    <div ref={containerRef} data-testid="row">
      {order.map((value, i) => (
        <span
          key={value}
          data-w={value}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
        />
      ))}
      <output>{order.slice(0, visibleCount).join(",")}</output>
    </div>
  )
}

describe("useOverflowCount: перестановка при том же числе пунктов", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement
    ) {
      return this.dataset.testid === "row" || this.dataset.slot === "tabs" ? 400 : 0
    })
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      const key = this.dataset.w ?? this.textContent ?? ""
      const width =
        this.dataset.w || this.dataset.slot === "tabs-item" ? (WIDTH[key.trim()] ?? 0) : 0
      return { width, height: 40, top: 0, left: 0, right: width, bottom: 40 } as DOMRect
    })
  })
  afterEach(() => vi.restoreAllMocks())

  it("длинные пункты в начале — видимых становится меньше", () => {
    const { rerender } = render(<Row order={["a", "b", "c", "D", "E"]} />)
    // 60 × 3 + 40 резерва = 220 ≤ 400; с «D» — 420 > 400.
    expect(screen.getByRole("status").textContent).toBe("a,b,c")

    rerender(<Row order={["D", "E", "a", "b", "c"]} />)
    // 40 + 200 = 240; + 200 = 440 > 400 — помещается только «D».
    expect(screen.getByRole("status").textContent).toBe("D")
  })

  it("Tabs пересчитывает ряд после перестановки вкладок", () => {
    const tabs = (order: string[]) => order.map((value) => ({ value, label: value }))
    const { rerender } = render(<Tabs items={tabs(["a", "b", "c", "D", "E"])} />)
    const visible = () =>
      screen.getAllByRole("tab").map((tab) => tab.textContent?.trim())
    const before = visible()

    rerender(<Tabs items={tabs(["D", "E", "a", "b", "c"])} />)
    // Прежнее число видимых вкладок с длинными в начале не помещается.
    expect(visible().length).toBeLessThan(before.length)
  })
})
