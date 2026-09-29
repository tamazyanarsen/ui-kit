import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { useOverflowCount } from "./use-overflow-count"

// r26: контейнер, сжатый соседями до нуля, считался «ещё не померенным» и
// показывал все пункты (шапка сотрудника с длинным ФИО на 600px давала
// страницу шире в полтора раза). Ноль у контейнера с коробкой — это «места
// нет»; «не померено» остаётся за контейнером без коробки.

function Row() {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(3, 40, 8)
  return (
    <div ref={containerRef}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
        />
      ))}
      <output>{visibleCount}</output>
    </div>
  )
}

describe("useOverflowCount: контейнер нулевой ширины", () => {
  const original = globalThis.ResizeObserver
  let boxes = 1
  beforeEach(() => {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(0)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return { width: this.tagName === "SPAN" ? 100 : 0 } as DOMRect
      }
    )
    vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
      () => Array.from({ length: boxes }) as unknown as DOMRectList
    )
  })
  afterEach(() => {
    globalThis.ResizeObserver = original
    vi.restoreAllMocks()
  })

  it("сжатый до нуля контейнер оставляет один пункт, а не все", () => {
    boxes = 1
    render(<Row />)
    expect(screen.getByRole("status", { hidden: true }).textContent).toBe("1")
  })

  it("контейнер без коробки по-прежнему «не померен» — видны все", () => {
    boxes = 0
    render(<Row />)
    expect(screen.getByRole("status", { hidden: true }).textContent).toBe("3")
  })
})
