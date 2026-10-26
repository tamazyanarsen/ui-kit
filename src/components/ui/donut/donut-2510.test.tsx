import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Donut } from "./donut"
import { DONUT, donutSegments, sectorPath } from "./donut-geometry"

// Правки UI-Kit от 25.10, пункт «Кольцевая диаграмма (бублик)».

const DATA = [
  { name: "Депозиты", value: 2_000_000 },
  { name: "Счета", value: 1_000_000 },
  { name: "Ноль", value: 0 },
  { name: "НСО", value: 1_000_000 },
]

/** Числа пути по порядку: пары координат после M / L / A (последние две у A). */
function points(path: string): [number, number][] {
  const out: [number, number][] = []
  const tokens = path.trim().split(/\s+/)
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t === "M" || t === "L") out.push([+tokens[i + 1], +tokens[i + 2]])
    if (t === "A") out.push([+tokens[i + 6], +tokens[i + 7]])
  }
  return out
}

/** Расстояние от точки до прямой через центр под углом (по часовой от верха). */
function distToRadius([x, y]: [number, number], angle: number) {
  const dx = Math.sin(angle)
  const dy = -Math.cos(angle)
  return Math.abs((x - 50) * dy - (y - 50) * dx)
}

describe("Donut: геометрия", () => {
  it("нулевые не рисуются, сегменты в порядке данных", () => {
    const segments = donutSegments(DATA.map((d) => d.value))
    expect(segments.map((s) => s.index)).toEqual([0, 1, 3])
  })

  it("один ненулевой — сплошное кольцо", () => {
    const segments = donutSegments([0, 5, 0])
    expect(segments).toHaveLength(1)
    expect(segments[0].ring).toBe(true)
  })

  it("зазор с параллельными краями: обе точки края на одном расстоянии от радиуса стыка", () => {
    // Сегмент 0..90°: край у 0° — прямая на половине зазора плюс радиус скругления.
    const [o0, , i1, i0] = points(sectorPath(0, Math.PI / 2))
    const offset = DONUT.GAP / 2 + DONUT.RAD
    expect(distToRadius(o0, 0)).toBeCloseTo(offset, 2)
    expect(distToRadius(i0, 0)).toBeCloseTo(offset, 2)
    expect(distToRadius(i1, Math.PI / 2)).toBeCloseTo(offset, 2)
  })

  it("старт сверху, по часовой: первая точка правее верхней точки центра", () => {
    const [o0] = points(sectorPath(0, Math.PI / 2))
    expect(o0[0]).toBeGreaterThan(50)
    expect(o0[1]).toBeLessThan(5)
  })

  it("узкий сегмент — край в точку, без перекрученной фигуры и NaN", () => {
    const narrow = sectorPath(0, 0.08)
    expect(narrow).not.toMatch(/NaN/)
    // Внутренней дуги нет: одна дуга (внешняя) и вершина.
    expect(narrow.match(/A /g)).toHaveLength(1)
    const tiny = sectorPath(0, 0.001)
    expect(tiny).not.toMatch(/NaN|A /)
  })
})

describe("Donut: компонент", () => {
  it("role=img и aria-label «подпись: значение»", () => {
    render(<Donut data={DATA} label="Портфель" value="4 000 000,00 ₽" />)
    expect(screen.getByRole("img", { name: "Портфель: 4 000 000,00 ₽" })).toBeInTheDocument()
  })

  it("середина прозрачная: в SVG только сегменты, без белого круга", () => {
    const { container } = render(<Donut data={DATA} />)
    expect(container.querySelectorAll("circle")).toHaveLength(0)
    expect(container.querySelectorAll('[data-slot="donut-segment"]')).toHaveLength(3)
  })

  it("скругление — обводка того же цвета 2 × радиус с round join; цвет плавно 280 мс", () => {
    const { container } = render(<Donut data={DATA} />)
    const path = container.querySelector('[data-slot="donut-segment"]') as SVGPathElement
    expect(path.getAttribute("stroke-width")).toBe(String(DONUT.RAD * 2))
    expect(path.getAttribute("stroke-linejoin")).toBe("round")
    expect(path.getAttribute("stroke")).toBe("var(--chart-blue)")
    expect(path.style.transition).toContain("var(--duration-release)")
  })

  it("цвета по умолчанию — палитра графиков по порядку данных", () => {
    const { container } = render(<Donut data={DATA} />)
    const fills = Array.from(container.querySelectorAll<SVGPathElement>('[data-slot="donut-segment"]')).map(
      (p) => p.style.fill
    )
    expect(fills).toEqual(["var(--chart-blue)", "var(--chart-lavender)", "var(--chart-mint)"])
  })

  it("подсветка: остальные смешаны с фоном, 35 % цвета", () => {
    const { container } = render(<Donut data={DATA} activeIndex={1} />)
    const [first, second] = container.querySelectorAll<SVGPathElement>('[data-slot="donut-segment"]')
    expect(first.getAttribute("stroke")).toBe("color-mix(in srgb, var(--chart-blue) 35%, var(--chart-surface))")
    expect(second.getAttribute("stroke")).toBe("var(--chart-lavender)")
  })

  it("пара стилей центра по размеру: 224 — P2 + P1, 300 — P1 + H2", () => {
    const { rerender } = render(<Donut data={DATA} label="Баланс" value="1" size={224} />)
    expect(screen.getByText("Баланс").className).toContain("text-p2-medium-adaptive")
    expect(screen.getByText("1").className).toContain("text-p1-medium-adaptive")
    rerender(<Donut data={DATA} label="Баланс" value="1" size={300} />)
    expect(screen.getByText("Баланс").className).toContain("text-p1-medium-adaptive")
    expect(screen.getByText("1").className).toContain("text-h2-adaptive")
  })
})
