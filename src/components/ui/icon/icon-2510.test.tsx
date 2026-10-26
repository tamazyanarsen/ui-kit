import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Icon, ICON_NAMES, ICON_REGISTRY } from "./icon"

// Правки UI-Kit от 25.10: имя `government` вместо опечатки и новые значки
// набора (номера шагов для шторы избранного в мобильной шапке).
describe("Icon: правки от 25.10", () => {
  it("government — каноническое имя, gouverment — псевдоним того же глифа", () => {
    expect(ICON_NAMES).toContain("government")
    expect(ICON_NAMES).not.toContain("gouverment")
    expect(ICON_REGISTRY.get("gouverment")).toBe(ICON_REGISTRY.get("government"))
  })

  it("government рисует тот же значок, что gouverment", () => {
    const a = render(<Icon name="government" size={24} />).container.innerHTML
    const b = render(<Icon name="gouverment" size={24} />).container.innerHTML
    expect(a.replace(/data-icon-name="[^"]*"/, "")).toBe(
      b.replace(/data-icon-name="[^"]*"/, "")
    )
  })

  it.each(["number-1", "number-2"] as const)("%s есть в наборе в двух начертаниях", (name) => {
    expect(ICON_NAMES).toContain(name)
    for (const size of [16, 24] as const) {
      const { container, unmount } = render(<Icon name={name} size={size} />)
      const svg = container.querySelector("svg")
      expect(svg?.getAttribute("viewBox")).toBe(`0 0 ${size} ${size}`)
      const fills = [...container.querySelectorAll("path")].map((p) => p.getAttribute("fill"))
      expect(fills.length).toBeGreaterThan(0)
      expect(fills.every((fill) => fill === "currentColor")).toBe(true)
      unmount()
    }
  })

  it("number-1 и number-2 — разные глифы", () => {
    expect(ICON_REGISTRY.get("number-1")).not.toBe(ICON_REGISTRY.get("number-2"))
  })
})
