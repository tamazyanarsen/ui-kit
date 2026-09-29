import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableTopDetails } from "./table-top"

// Раунд 27: пара шире видимой зоны между стрелками подводилась кромкой
// целиком, и её середина проскакивала, ни разу не показавшись. Шаг листания
// не должен быть длиннее самой зоны.

const TRACK = 300
const ZONE = TRACK - 80
const PAIR = 700

function mockRibbon(scrollLeft: number) {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "table-top-details-track" ? 1000 : 0
  })
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "table-top-details-track" ? TRACK : 0
  })
  vi.spyOn(HTMLElement.prototype, "scrollLeft", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "table-top-details-track" ? scrollLeft : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.dataset.slot === "table-top-details-track") {
      return { left: 0, right: TRACK, width: TRACK, top: 0, bottom: 32, height: 32 } as DOMRect
    }
    if (this.dataset.slot === "table-top-details-item") {
      // Первая пара широкая, начинается в -scrollLeft.
      const left = -scrollLeft
      return { left, right: left + PAIR, width: PAIR, top: 0, bottom: 32, height: 32 } as DOMRect
    }
    return { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 } as DOMRect
  })
  const scrollBy = vi.fn()
  ;(HTMLElement.prototype as unknown as { scrollBy: unknown }).scrollBy = scrollBy
  return scrollBy
}

const items = [{ label: "Очень длинная подпись", value: "1 ₽" }]

describe("TableTopDetails: пара шире зоны", () => {
  afterEach(() => vi.restoreAllMocks())

  it("вперёд: шаг не длиннее зоны", async () => {
    const scrollBy = mockRibbon(0)
    render(<TableTopDetails items={items} />)
    await userEvent.setup().click(screen.getByRole("button", { name: "Прокрутить сводку вперёд" }))
    expect(scrollBy.mock.calls[0][0].left).toBe(ZONE)
  })

  it("назад: шаг не длиннее зоны", async () => {
    // Пара начинается в -500: её левый край далеко за зоной.
    const scrollBy = mockRibbon(500)
    render(<TableTopDetails items={items} />)
    await userEvent.setup().click(screen.getByRole("button", { name: "Прокрутить сводку назад" }))
    expect(scrollBy.mock.calls[0][0].left).toBe(-ZONE)
  })
})
