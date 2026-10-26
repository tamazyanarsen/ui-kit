import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useCollapseExit } from "./use-collapse-exit"
import { useSmoothHeight } from "./use-smooth-height"

// Правки UI-Kit от 25.10, «Высоты перестраиваются с анимацией»: контейнер с
// высотой по содержимому меняет её за 300 мс по мягкой кривой; не
// анимируется при ресайзе окна, reduced-motion и во время схлопывания.

let notify: () => void = () => {}
let height = 200
const animate = vi.fn()
const originalAnimate = HTMLElement.prototype.animate
const originalRO = globalThis.ResizeObserver
const originalMatchMedia = window.matchMedia

beforeEach(() => {
  height = 200
  animate.mockReset()
  animate.mockImplementation(() => ({ cancel: vi.fn(), onfinish: null, oncancel: null }))
  HTMLElement.prototype.animate = animate as unknown as typeof originalAnimate
  globalThis.ResizeObserver = class {
    constructor(callback: () => void) {
      notify = callback
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => height)
})

afterEach(() => {
  HTMLElement.prototype.animate = originalAnimate
  globalThis.ResizeObserver = originalRO
  window.matchMedia = originalMatchMedia
  document.documentElement.removeAttribute("data-collapsing")
  vi.restoreAllMocks()
})

function Box() {
  const ref = useSmoothHeight<HTMLDivElement>()
  return <div ref={ref} data-testid="box" />
}

function grow(to: number) {
  height = to
  act(() => notify())
}

describe("useSmoothHeight", () => {
  it("смена высоты — анимация от прежней к новой, 300 мс, мягкая кривая", () => {
    render(<Box />)
    grow(400)
    expect(animate).toHaveBeenCalledTimes(1)
    const [frames, options] = animate.mock.calls[0]
    expect(frames).toEqual([{ height: "200px" }, { height: "400px" }])
    expect(options).toMatchObject({ duration: 300, easing: "cubic-bezier(0.32, 0.72, 0, 1)" })
  })

  it("первое появление не анимируется", () => {
    render(<Box />)
    act(() => notify())
    expect(animate).not.toHaveBeenCalled()
  })

  it("сразу после resize окна — без анимации", () => {
    render(<Box />)
    window.dispatchEvent(new Event("resize"))
    grow(400)
    expect(animate).not.toHaveBeenCalled()
  })

  it("prefers-reduced-motion — без анимации", () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia
    render(<Box />)
    grow(400)
    expect(animate).not.toHaveBeenCalled()
  })

  it("во время схлопывания (data-collapsing на <html>) — без анимации", () => {
    render(<Box />)
    document.documentElement.setAttribute("data-collapsing", "")
    grow(400)
    expect(animate).not.toHaveBeenCalled()
  })
})

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

describe("useCollapseExit: признак data-collapsing", () => {
  it("стоит на <html> на время ухода и снимается в конце", async () => {
    let finish: () => void = () => {}
    const finished = new Promise<void>((resolve) => {
      finish = resolve
    })
    animate.mockImplementation(() => ({ finished, cancel: vi.fn() }))
    render(<Closable onClose={() => {}} />)
    await userEvent.click(screen.getByRole("button"))
    expect(document.documentElement).toHaveAttribute("data-collapsing")
    await act(async () => {
      finish()
      await finished
    })
    expect(document.documentElement).not.toHaveAttribute("data-collapsing")
  })
})
