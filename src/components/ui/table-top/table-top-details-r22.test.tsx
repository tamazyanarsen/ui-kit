import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableTopDetails } from "./table-top"

// Аудит 21: стрелка ленты «Сводки» лежит НА ленте (поле 8 + кнопка 32), а
// перелистывание подводило кромку следующей пары к самой кромке ленты —
// значение пары оказывалось под стрелкой («…740740 [›] ₽»). Пара, частично
// закрытая стрелкой, при этом считалась поместившейся.

const PAIR = 180
const GAP = 16
const TRACK = 600

function mockRibbon() {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "table-top-details-track" ? 1200 : 0
  })
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "table-top-details-track" ? TRACK : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.dataset.slot === "table-top-details-track") {
      return { left: 0, right: TRACK, width: TRACK, top: 0, bottom: 32, height: 32 } as DOMRect
    }
    if (this.dataset.slot === "table-top-details-item") {
      const index = [...this.parentElement!.children].indexOf(this)
      const left = index * (PAIR + GAP)
      return { left, right: left + PAIR, width: PAIR, top: 0, bottom: 32, height: 32 } as DOMRect
    }
    return { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 } as DOMRect
  })
  const scrollBy = vi.fn()
  ;(HTMLElement.prototype as unknown as { scrollBy: unknown }).scrollBy = scrollBy
  return scrollBy
}

const items = Array.from({ length: 10 }, (_, i) => ({
  label: `Показатель номер ${i + 1}:`,
  value: "1234567,00 ₽",
}))

describe("TableTopDetails: перелистанная пара не лежит под стрелкой", () => {
  afterEach(() => vi.restoreAllMocks())

  it("пара под зоной стрелки считается непоместившейся и подводится к кромке зоны", async () => {
    const scrollBy = mockRibbon()
    const user = userEvent.setup()
    render(<TableTopDetails items={items} />)
    // Третья пара — 392…572: целиком в ленте (600), но её хвост под правой
    // стрелкой (зона 560…600). Её и нужно довести до 560 — сдвиг 12.
    await user.click(screen.getByRole("button", { name: "Прокрутить сводку вперёд" }))
    expect(scrollBy).toHaveBeenCalledTimes(1)
    expect(scrollBy.mock.calls[0][0]).toMatchObject({ left: 572 - (TRACK - 40) })
  })
})
