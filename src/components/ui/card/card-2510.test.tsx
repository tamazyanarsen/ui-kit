import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Card } from "./card"

// Правки UI-Kit от 25.10, «Нажимаемые серые карточки»: при нажатии «…»
// карточка не подсвечивается и не сжимается; сжатие — 0,98; наведение —
// только у настоящего курсора.

const asTest = (selector: string) => selector.replace(/:active/g, "[data-active]")

function variantSelector(className: string, utility: string): string {
  const token = className
    .split(/\s+/)
    .find((cls) => cls.includes("[&:active") && cls.endsWith(`]:${utility}`))
  expect(token, `класс с ${utility}`).toBeDefined()
  const start = token!.indexOf("[&")
  const variant = token!.slice(start + 1, token!.length - utility.length - 2)
  return asTest(variant.replace("&", "[data-slot=card]"))
}

function renderCard() {
  render(
    <Card
      title="Карта"
      onClick={() => {}}
      menuItems={[{ text: "Переименовать" }]}
    />
  )
  return document.querySelector<HTMLElement>("[data-slot='card']")!
}

describe("Card: нажатие серой карточки", () => {
  it("нажатие «…» не подсвечивает и не сжимает карточку", () => {
    const root = renderCard()
    const fill = variantSelector(root.className, "bg-[var(--card-bg-active)]")
    const scale = variantSelector(root.className, "scale-[.98]")

    root.setAttribute("data-active", "")
    expect(root.matches(fill)).toBe(true)
    expect(root.matches(scale)).toBe(true)

    const more = root.querySelector("button:not([data-slot='press-target'])")!
    more.setAttribute("data-pressing", "")
    expect(root.matches(fill)).toBe(false)
    expect(root.matches(scale)).toBe(false)
  })

  it("наведение — только у настоящего курсора", () => {
    const root = renderCard()
    expect(root.className).toContain("[@media(pointer:fine)]:hover:bg-[var(--card-bg-hover)]")
    expect(root.className).not.toMatch(/(^|\s)hover:bg-/)
    expect(screen.getByText("Карта")).toBeInTheDocument()
  })

  it("без onClick — ни нажатия, ни сжатия", () => {
    render(<Card title="Карта" />)
    const root = document.querySelector<HTMLElement>("[data-slot='card']")!
    expect(root.className).not.toContain("scale-[.98]")
    expect(root.className).toContain("transition-colors")
  })
})
