import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tabs } from "./tabs"

// Третий раунд аудита: место под триггер «…» и зазор перед ним. В jsdom
// вьюпорт мобильный — зазор 24, глиф 16.

const items = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    value: String(index),
    label: `Tab ${index}`,
  }))

/** Контейнер ленты шириной `width`, каждая вкладка мерной копии — `tab`. */
function mockRow(width: number, tab = 100) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "tabs" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const w = this.dataset.slot === "tabs-item" ? tab : 0
    return { width: w, height: 40, top: 0, left: 0, right: w, bottom: 40 } as DOMRect
  })
}

describe("Tabs: место под «…»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("при showMore триггер учитывается и тогда, когда вкладки помещаются впритык", () => {
    // 5 × 100 + 4 × 24 = 596 ≤ 600, но рядом всегда стоит «…» (24 + 16):
    // ряду нужно 636, поэтому одна вкладка обязана уйти в список.
    mockRow(600)
    render(<Tabs items={items(5)} />)
    expect(screen.getAllByRole("tab")).toHaveLength(4)
  })

  it("без showMore резерв при переполнении включает зазор перед «…»", () => {
    // Три вкладки + два зазора + зазор и глиф триггера = 388 > 382.
    mockRow(382)
    render(<Tabs items={items(4)} showMore={false} />)
    expect(screen.getAllByRole("tab")).toHaveLength(2)
  })

  it("ряд по ширине содержимого не теряет вкладку на округлении", () => {
    // Ряд `w-fit` (ячейка матрицы): контейнер равен самому содержимому.
    // 2 × 50.4 + 24 + (24 + 16) = 164.8, а целый `clientWidth` — 164.
    // Без допуска вторая вкладка уезжала в «…», ряд сужался и не возвращался.
    mockRow(164, 50.4)
    render(<Tabs items={items(2)} />)
    expect(screen.getAllByRole("tab")).toHaveLength(2)
  })

  it("при showMore={false} и помещающемся ряде раскладка прежняя", () => {
    mockRow(600)
    render(<Tabs items={items(5)} showMore={false} />)
    expect(screen.getAllByRole("tab")).toHaveLength(5)
    expect(screen.queryByRole("button", { name: "Ещё" })).not.toBeInTheDocument()
  })
})

describe("Tabs: зазор перед «…»", () => {
  it("при items=[] многоточие стоит в начале ряда, без зазора", () => {
    const { container } = render(<Tabs items={[]} />)
    const row = container.querySelector<HTMLElement>('[data-slot="tabs-row"]')!
    const trigger = screen.getByRole("button", { name: "Ещё" })
    expect(row.style.gap).toBe("")
    expect(trigger.style.marginLeft).toBe("")
  })

  it("при вкладках зазор до «…» тот же, что между вкладками", () => {
    render(<Tabs items={items(2)} />)
    expect(screen.getByRole("button", { name: "Ещё" }).style.marginLeft).toBe("24px")
  })
})
