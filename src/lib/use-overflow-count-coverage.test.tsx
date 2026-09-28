import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { useOverflowCount } from "./use-overflow-count"

// Добор покрытия к исправлениям навигации (раунд 1): при росте числа
// пунктов в ряду, который помещался целиком, хвост не должен ни на один
// проход раскладки уезжать в «Ещё» — иначе пункт пересоздаётся и теряет
// фокус и состояние.

function Row({ count, log }: { count: number; log: string[] }) {
  const { containerRef, itemRefs, visibleCount } = useOverflowCount(count, 0)
  // Пишется только закоммиченный рендер: рендер, выброшенный React из-за
  // обновления состояния прямо в теле хука, на экран не попадает.
  React.useLayoutEffect(() => {
    log.push(`${visibleCount}/${count}`)
  })
  return (
    <div ref={containerRef}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          data-w="50"
          ref={(el) => {
            itemRefs.current[i] = el
          }}
        />
      ))}
    </div>
  )
}

describe("useOverflowCount: рост числа пунктов", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      return { width: Number(this.dataset.w ?? 0) } as DOMRect
    })
  })
  afterEach(() => vi.restoreAllMocks())

  it("новый пункт в помещающемся ряду ни на один рендер не уходит в «Ещё»", () => {
    const log: string[] = []
    const { rerender } = render(<Row count={2} log={log} />)
    expect(log.at(-1)).toBe("2/2")

    log.length = 0
    rerender(<Row count={3} log={log} />)

    // Все три пункта по 50 px в ряду 400 px помещаются — счёт с первого же
    // рендера равен новому числу.
    expect(log).not.toContain("2/3")
    expect(log.at(-1)).toBe("3/3")
  })
})
