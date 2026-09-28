import { afterEach, describe, expect, it, vi } from "vitest"
import { act, render } from "@testing-library/react"

import { useActiveIndicator } from "./use-active-indicator"

function Row({ value }: { value: string }) {
  const indicator = useActiveIndicator<HTMLDivElement>(value)
  return (
    <div ref={indicator.rowRef}>
      <span data-testid="indicator" data-ready={String(indicator.ready)} />
      <button data-value="a">A</button>
      <button data-value="b">B</button>
    </div>
  )
}

// Третий проход: класс перехода приходил в одном коммите с первыми
// координатами, и бегунок на загрузке выезжал от нулевой ширины.
describe("useActiveIndicator", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("does not allow animation on the first positioned render", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] })
    const { getByTestId } = render(<Row value="b" />)

    expect(getByTestId("indicator")).toHaveAttribute("data-ready", "false")

    act(() => {
      vi.advanceTimersToNextFrame()
    })
    expect(getByTestId("indicator")).toHaveAttribute("data-ready", "true")
  })

  it("does not enable animation while the active segment is not in the row", () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] })
    const { getByTestId } = render(<Row value="hidden" />)

    act(() => {
      vi.advanceTimersToNextFrame()
    })
    expect(getByTestId("indicator")).toHaveAttribute("data-ready", "false")
  })
})
