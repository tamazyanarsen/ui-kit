import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Tooltip } from "./tooltip"

// Правки UI-Kit от 25.10: тултип по умолчанию НАД элементом (`direction`
// называет сторону хвостика: `down-center` — хвостик снизу), у верхнего
// края окна переворачивается вниз, как выпадающие списки.
//
// Раскладку jsdom не считает, поэтому геометрия подставлена: окно
// 1400×785, тултип 256×60, значок 16×16.

const VIEW_W = 1400
const VIEW_H = 785
let anchorTop = 400

beforeEach(() => {
  const html = document.documentElement
  Object.defineProperty(html, "clientWidth", { configurable: true, value: VIEW_W })
  Object.defineProperty(html, "clientHeight", { configurable: true, value: VIEW_H })
  const inPopup = (el: HTMLElement) => el.closest("[data-side]") || el.hasAttribute("data-side")
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return inPopup(this) ? 256 : 16
  })
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return inPopup(this) ? 60 : 16
  })
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
    this: Element
  ) {
    if (this.matches("button")) {
      return DOMRect.fromRect({ x: 600, y: anchorTop, width: 16, height: 16 })
    }
    if (this.hasAttribute("data-side")) {
      return DOMRect.fromRect({ x: 0, y: 0, width: 256, height: 60 })
    }
    return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  delete (document.documentElement as unknown as Record<string, unknown>).clientWidth
  delete (document.documentElement as unknown as Record<string, unknown>).clientHeight
})

async function hoverAndGetPositioner() {
  const user = userEvent.setup()
  await user.hover(screen.getByRole("button", { name: "i" }))
  const text = await screen.findByText("Подсказка")
  return text.closest("[data-side]:not([data-slot])") as HTMLElement
}

describe("Tooltip: сторона по умолчанию", () => {
  it("над элементом (data-side=top), хвостик снизу", async () => {
    anchorTop = 400
    render(
      <Tooltip content="Подсказка">
        <button type="button">i</button>
      </Tooltip>
    )
    const positioner = await hoverAndGetPositioner()
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "top"))
  })

  it("у верхнего края окна переворачивается вниз", async () => {
    anchorTop = 10
    render(
      <Tooltip content="Подсказка">
        <button type="button">i</button>
      </Tooltip>
    )
    const positioner = await hoverAndGetPositioner()
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "bottom"))
  })

  it("явный top-center по-прежнему ставит тултип под элементом", async () => {
    anchorTop = 400
    render(
      <Tooltip content="Подсказка" direction="top-center">
        <button type="button">i</button>
      </Tooltip>
    )
    const positioner = await hoverAndGetPositioner()
    await waitFor(() => expect(positioner).toHaveAttribute("data-side", "bottom"))
  })
})
