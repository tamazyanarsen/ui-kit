import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { useActiveIndicator } from "./use-active-indicator"

// Аудит 20: когда активный сегмент уходил за многоточие, бегунок только
// становился прозрачным, а `left`/`width` оставались от первого замера (все
// сегменты ещё видны). Абсолютный элемент на left 1625px входил в ширину
// прокрутки документа — у страницы появлялась горизонтальная прокрутка.

function Row({ items, active }: { items: string[]; active: string }) {
  const indicator = useActiveIndicator<HTMLDivElement>(active, [items.join()])
  return (
    <div ref={indicator.rowRef}>
      {items.map((item) => (
        <button key={item} data-value={item}>
          {item}
        </button>
      ))}
      <span
        data-testid="indicator"
        data-visible={indicator.visible}
        data-ready={indicator.ready}
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  )
}

describe("useActiveIndicator: активный сегмент спрятан", () => {
  afterEach(() => vi.restoreAllMocks())

  it("координаты обнуляются, а не остаются от прошлого замера", () => {
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockReturnValue(1625)
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(232)
    const { rerender } = render(<Row items={["a", "b", "c"]} active="c" />)
    const indicator = screen.getByTestId("indicator")
    expect(indicator.style.left).toBe("1625px")

    // «c» ушла за многоточие — в ряду её больше нет.
    rerender(<Row items={["a", "b"]} active="c" />)
    expect(indicator.dataset.visible).toBe("false")
    expect(indicator.style.left).toBe("0px")
    expect(indicator.style.width).toBe("0px")
    // Когда сегмент вернётся, бегунок встанет на место без выезда из нуля.
    expect(indicator.dataset.ready).toBe("false")
  })
})
