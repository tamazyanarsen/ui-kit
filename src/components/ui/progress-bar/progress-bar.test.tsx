import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ProgressBar } from "./progress-bar"

describe("ProgressBar", () => {
  it("renders the title and the top-row description", () => {
    render(<ProgressBar title="Шаг 2 из 4" description="50%" />)
    expect(screen.getByText("Шаг 2 из 4")).toBeInTheDocument()
    expect(screen.getByText("50%")).toBeInTheDocument()
  })

  it("hides the top-row description when showDescription is false", () => {
    render(<ProgressBar title="Заголовок" description="50%" showDescription={false} />)
    expect(screen.queryByText("50%")).not.toBeInTheDocument()
  })

  it("renders the Status Line group when given", () => {
    render(
      <ProgressBar
        title="Заголовок"
        subtitle="Подзаголовок"
        statusDescription="Описание"
      />
    )
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
    expect(screen.getByText("Описание")).toBeInTheDocument()
  })

  it("hides the whole Status Line group when showStatus is false", () => {
    render(
      <ProgressBar
        title="Заголовок"
        subtitle="Подзаголовок"
        statusDescription="Описание"
        showStatus={false}
      />
    )
    expect(screen.queryByText("Подзаголовок")).not.toBeInTheDocument()
    expect(screen.queryByText("Описание")).not.toBeInTheDocument()
  })

  it("shows only the slots selected by statusLine", () => {
    const { rerender } = render(
      <ProgressBar
        title="Заголовок"
        subtitle="Подзаголовок"
        statusDescription="Описание"
        statusLine="subtitle"
      />
    )
    expect(screen.getByText("Подзаголовок")).toBeInTheDocument()
    expect(screen.queryByText("Описание")).not.toBeInTheDocument()

    rerender(
      <ProgressBar
        title="Заголовок"
        subtitle="Подзаголовок"
        statusDescription="Описание"
        statusLine="description"
      />
    )
    expect(screen.queryByText("Подзаголовок")).not.toBeInTheDocument()
    expect(screen.getByText("Описание")).toBeInTheDocument()
  })

  it("hides the bar itself when showTimeline is false", () => {
    const { container } = render(
      <ProgressBar variant="timeline" title="Заголовок" value={40} showTimeline={false} />
    )
    expect(container.querySelector('[aria-hidden="true"].rounded-full')).toBeNull()
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

  it("uses the Process blue when statusTimeline overrides the range", () => {
    const { container } = render(
      <ProgressBar
        variant="timeline"
        title="Заголовок"
        value={70}
        statusTimeline="process"
      />
    )
    const fill = container.querySelector('[aria-hidden="true"].rounded-full') as HTMLElement
    expect(fill.style.backgroundColor).toBe("var(--progress-step-fill)")
  })
})
