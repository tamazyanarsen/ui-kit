import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useCollapseExit } from "./use-collapse-exit"

function Closable({ onClose }: { onClose: () => void }) {
  const { ref, exit } = useCollapseExit<HTMLDivElement>(onClose)
  return (
    <div ref={ref}>
      <button type="button" onClick={exit}>
        Закрыть
      </button>
    </div>
  )
}

describe("useCollapseExit", () => {
  const original = HTMLElement.prototype.animate

  afterEach(() => {
    HTMLElement.prototype.animate = original
  })

  it("без Web Animations (jsdom) зовёт onClose сразу", async () => {
    const onClose = vi.fn()
    render(<Closable onClose={onClose} />)
    await userEvent.click(screen.getByRole("button"))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("с анимацией откладывает onClose до конца схлопывания", async () => {
    let finish: () => void = () => {}
    const finished = new Promise<void>((resolve) => {
      finish = resolve
    })
    const animate = vi.fn(() => ({ finished, cancel: vi.fn() }))
    HTMLElement.prototype.animate = animate as unknown as typeof original

    const onClose = vi.fn()
    render(<Closable onClose={onClose} />)
    await userEvent.click(screen.getByRole("button"))
    // Повторный щелчок во время ухода второй анимации не запускает
    // (`fireEvent`: userEvent честно отказывается жать узел с
    // `pointer-events: none`, который хук ставит на время ухода).
    fireEvent.click(screen.getByRole("button"))

    expect(onClose).not.toHaveBeenCalled()
    // Две анимации: размер (с полями) и угасание.
    expect(animate).toHaveBeenCalledTimes(2)
    const [sizeFrames] = animate.mock.calls[0] as unknown as [Keyframe[]]
    expect(sizeFrames[1]).toMatchObject({ height: "0px", paddingTop: "0px" })

    await act(async () => {
      finish()
      await finished
    })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
