import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ProgressBar } from "./progress-bar"

describe("ProgressBar", () => {
  it("renders the title and label", () => {
    render(<ProgressBar title="Шаг 2 из 4" label="50%" />)
    expect(screen.getByText("Шаг 2 из 4")).toBeInTheDocument()
    expect(screen.getByText("50%")).toBeInTheDocument()
  })

  it("renders the subtitle and description when given", () => {
    render(
      <ProgressBar title="Заголовок" subtitle="Подзаголовок" description="Описание" />
    )
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
    expect(screen.getByText("Описание")).toBeInTheDocument()
  })

  it("fills the timeline track proportionally to value", () => {
    const { container } = render(<ProgressBar variant="timeline" title="Заголовок" value={40} />)
    const fill = container.querySelector('[aria-hidden="true"].rounded-full')
    expect(fill).toHaveStyle({ width: "40%" })
  })

  it("clamps the timeline value to [0, 100]", () => {
    const { container } = render(<ProgressBar variant="timeline" title="Заголовок" value={140} />)
    const fill = container.querySelector('[aria-hidden="true"].rounded-full')
    expect(fill).toHaveStyle({ width: "100%" })
  })

  it("auto-picks the timeline color from the value's range", () => {
    const { container, rerender } = render(
      <ProgressBar variant="timeline" title="Заголовок" value={30} />
    )
    let fill = container.querySelector('[aria-hidden="true"].rounded-full') as HTMLElement
    expect(fill.style.backgroundColor).toBe("var(--progress-green)")

    rerender(<ProgressBar variant="timeline" title="Заголовок" value={70} />)
    fill = container.querySelector('[aria-hidden="true"].rounded-full') as HTMLElement
    expect(fill.style.backgroundColor).toBe("var(--progress-amber)")

    rerender(<ProgressBar variant="timeline" title="Заголовок" value={100} />)
    fill = container.querySelector('[aria-hidden="true"].rounded-full') as HTMLElement
    expect(fill.style.backgroundColor).toBe("var(--progress-red)")
  })
})
