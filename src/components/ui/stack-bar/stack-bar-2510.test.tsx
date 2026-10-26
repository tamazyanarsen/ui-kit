import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { StackBar } from "./stack-bar"

// Правки UI-Kit от 25.10, пункт «Полоса (stack bar)».

const DATA = [
  { name: "Депозиты", value: 2_000_000 },
  { name: "Счета", value: 0 },
  { name: "НСО", value: 1_000_000 },
  { name: "Облигации", value: 500_000, color: "red" },
]

function segments(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-slot="stack-bar-segment"]'))
}

describe("StackBar", () => {
  it("role=img и aria-label «подпись: итог»", () => {
    render(<StackBar data={DATA} label="Портфель" total="3 500 000 ₽" />)
    expect(screen.getByRole("img", { name: "Портфель: 3 500 000 ₽" })).toBeInTheDocument()
  })

  it("сегменты по значениям в порядке данных, нулевые не рисуются", () => {
    const { container } = render(<StackBar data={DATA} />)
    const parts = segments(container)
    expect(parts.map((p) => p.dataset.name)).toEqual(["Депозиты", "НСО", "Облигации"])
    expect(parts.map((p) => p.style.flexGrow)).toEqual(["2000000", "1000000", "500000"])
  })

  it("полоса 16, зазор 3, скругление 4 у сегмента, минимум 4", () => {
    const { container } = render(<StackBar data={DATA} />)
    const track = container.querySelector('[data-slot="stack-bar-track"]') as HTMLElement
    expect(track.className).toContain("h-4")
    expect((container.querySelector('[data-slot="stack-bar-fill"]') as HTMLElement).className).toContain("gap-[3px]")
    expect(track.className).not.toMatch(/rounded/)
    const [first] = segments(container)
    expect(first.className).toContain("rounded-[4px]")
    expect(first.className).toContain("min-w-1")
    expect(first.className).toContain("basis-0")
  })

  it("цвета: палитра графиков по месту в данных, свой цвет — как задан", () => {
    const { container } = render(<StackBar data={DATA} />)
    const colors = segments(container).map((p) => p.style.backgroundColor)
    expect(colors[0]).toBe("var(--chart-blue)")
    // Нулевая часть место в палитре сохраняет: цвет не «съезжает» у легенды.
    expect(colors[1]).toBe("var(--chart-grey)")
    expect(colors[2]).toBe("red")
  })

  it("разворот целиком: сегменты лежат в одной заливке, а не растут каждый отдельно", () => {
    const { container } = render(<StackBar data={DATA} />)
    const fill = container.querySelector('[data-slot="stack-bar-fill"]') as HTMLElement
    expect(fill).not.toBeNull()
    expect(segments(container).every((s) => s.parentElement === fill)).toBe(true)
    expect(segments(container).some((s) => s.style.getPropertyValue("--stack-bar-delay"))).toBe(false)
    const track = container.querySelector('[data-slot="stack-bar-track"]') as HTMLElement
    expect(track.className).toContain("overflow-hidden")
  })

  it("смена данных — полоса монтируется заново (рост перезапускается)", () => {
    const { container, rerender } = render(<StackBar data={DATA} />)
    const before = container.querySelector('[data-slot="stack-bar-track"]')
    rerender(<StackBar data={DATA} />)
    expect(container.querySelector('[data-slot="stack-bar-track"]')).toBe(before)
    rerender(<StackBar data={[...DATA.slice(0, 3)]} />)
    expect(container.querySelector('[data-slot="stack-bar-track"]')).not.toBe(before)
  })

  it("строка над полосой: на десктопе в строку, в мобильном итог под подписью", () => {
    const { container } = render(<StackBar data={DATA} label="Портфель" total="1" />)
    const head = container.querySelector('[data-slot="stack-bar-head"]') as HTMLElement
    expect(head.className).toContain("flex-col")
    expect(head.className).toContain("desktop:flex-row")
    expect(head.className).toContain("text-p1-medium-adaptive")
    expect(screen.getByText("Портфель").className).toContain("text-[var(--chart-label-fg)]")
    expect(screen.getByText("Портфель").className).toContain("desktop:text-[var(--chart-value-fg)]")
    expect((container.firstChild as HTMLElement).className).toContain("gap-4")
  })
})
