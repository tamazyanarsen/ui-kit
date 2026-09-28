import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render } from "@testing-library/react"

import { useInfiniteCount } from "./use-infinite-count"

// Поддельный IntersectionObserver: запоминает наблюдаемые узлы и даёт
// «проскроллить» до любого из них.
const observers: { nodes: Set<Element>; cb: IntersectionObserverCallback }[] = []
class FakeObserver {
  nodes = new Set<Element>()
  cb: IntersectionObserverCallback
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb
    observers.push(this)
  }
  observe(node: Element) {
    this.nodes.add(node)
  }
  disconnect() {
    this.nodes.clear()
  }
}

function intersect(node: Element) {
  for (const o of observers) {
    if (o.nodes.has(node)) {
      o.cb([{ isIntersecting: true } as IntersectionObserverEntry], o as never)
    }
  }
}

function Harness({ generation }: { generation: number }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { count, sentinelRef } = useInfiniteCount(scrollRef, 6, 6)
  return (
    <div ref={scrollRef}>
      <span data-testid="count">{count}</span>
      {/* `key` пересоздаёт маркер — как переход через выбор года. */}
      <div key={generation} data-testid="sentinel" ref={sentinelRef} />
    </div>
  )
}

afterEach(() => {
  observers.length = 0
  vi.unstubAllGlobals()
})

describe("useInfiniteCount", () => {
  it("keeps loading after the sentinel node is replaced", () => {
    vi.stubGlobal("IntersectionObserver", FakeObserver)
    const { getByTestId, rerender } = render(<Harness generation={0} />)

    rerender(<Harness generation={1} />)
    act(() => intersect(getByTestId("sentinel")))

    expect(getByTestId("count")).toHaveTextContent("12")
  })
})
