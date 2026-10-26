import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/utils"

// Правки UI-Kit от 25.10 (m32 каркаса, p41 кита): компоненты набирают
// текст адаптивными утилитами вместо пары «ступень вниз»
// (`text-p2-medium desktop:text-p1-medium` → `text-p1-medium-adaptive`).
describe("Адаптивные утилиты вместо «ступени вниз»", () => {
  it("cn() не теряет адаптивный размер рядом с цветом", () => {
    expect(cn("text-p1-medium-adaptive", "text-[var(--x)]")).toBe(
      "text-p1-medium-adaptive text-[var(--x)]"
    )
    expect(cn("text-h3-adaptive text-[var(--x)]")).toBe("text-h3-adaptive text-[var(--x)]")
  })

  it("размер потребителя через className вытесняет адаптивный целиком", () => {
    expect(cn("text-p1-medium-adaptive", "text-p2-medium")).toBe("text-p2-medium")
    expect(cn("text-p2-medium", "text-p1-medium-adaptive")).toBe("text-p1-medium-adaptive")
    expect(cn("text-h2-adaptive", "text-h4-mobile")).toBe("text-h4-mobile")
  })

  it("десктопная поправка потребителя уживается с адаптивной утилитой", () => {
    // `desktop:text-…` — другой модификатор, twMerge оставляет оба; в CSS
    // вариантные утилиты идут после базовых, поэтому побеждает поправка.
    expect(cn("text-p1-medium-adaptive", "desktop:text-p2-medium")).toBe(
      "text-p1-medium-adaptive desktop:text-p2-medium"
    )
  })

  it("Button md и lg — P1 Medium адаптивный, sm — P2 Medium адаптивный", () => {
    render(
      <>
        <Button>md</Button>
        <Button size="lg">lg</Button>
        <Button size="sm">sm</Button>
      </>
    )
    for (const name of ["md", "lg"]) {
      const button = screen.getByRole("button", { name })
      expect(button).toHaveClass("text-p1-medium-adaptive")
      expect(button.className).not.toMatch(/(^|\s)(text-p2-medium|desktop:text-p1-medium)(\s|$)/)
    }
    const sm = screen.getByRole("button", { name: "sm" })
    expect(sm).toHaveClass("text-p2-medium-adaptive")
    expect(sm.className).not.toMatch(/(^|\s)(text-p3-medium|desktop:text-p2-medium)(\s|$)/)
  })

  it("Tag — P2 Medium адаптивный", () => {
    render(<Tag>Метка</Tag>)
    const tag = screen.getByText("Метка").closest("[data-slot=tag]") as HTMLElement
    expect(tag.className).toContain("text-p2-medium-adaptive")
    expect(tag.className).not.toContain("desktop:text-p2-medium")
  })
})
