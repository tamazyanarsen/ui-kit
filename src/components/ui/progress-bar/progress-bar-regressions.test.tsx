import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ProgressBar } from "./progress-bar"

describe("ProgressBar: регрессии", () => {
  it("шкала шагов — progressbar с именем и значением", () => {
    render(<ProgressBar title="Оформление" totalSteps={4} currentStep={2} />)
    const bar = screen.getByRole("progressbar", { name: "Оформление" })
    expect(bar).toHaveAttribute("aria-valuemin", "1")
    expect(bar).toHaveAttribute("aria-valuemax", "4")
    expect(bar).toHaveAttribute("aria-valuenow", "2")
    expect(bar).toHaveAttribute("aria-valuetext", "Шаг 2 из 4")
  })

  it("timeline — progressbar 0–100", () => {
    render(<ProgressBar variant="timeline" title="Лимит" value={42} />)
    const bar = screen.getByRole("progressbar", { name: "Лимит" })
    expect(bar).toHaveAttribute("aria-valuenow", "42")
  })

  it("NaN не заливает полосу целиком", () => {
    const { container } = render(
      <ProgressBar variant="timeline" title="Лимит" value={Number("x")} />
    )
    const fill = container.querySelector('[role="progressbar"] > div') as HTMLElement
    expect(fill.style.width).toBe("0%")
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0")
  })

  it("NaN в шагах сводится к первому шагу, а не к «NaN NaN 0%»", () => {
    render(<ProgressBar title="Шаги" totalSteps={Number.NaN} currentStep={Number.NaN} />)
    const bar = screen.getByRole("progressbar")
    expect(bar).toHaveAttribute("aria-valuemax", "2")
    expect(bar).toHaveAttribute("aria-valuenow", "1")
    for (const part of bar.children) {
      expect((part as HTMLElement).style.flex).not.toContain("NaN")
    }
  })
})
