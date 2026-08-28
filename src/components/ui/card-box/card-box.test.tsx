import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CardBox } from "./card-box"

describe("CardBox", () => {
  it("renders the title and the content", () => {
    render(<CardBox title="Заголовок">Контент</CardBox>)
    expect(screen.getByRole("heading", { name: "Заголовок" })).toBeInTheDocument()
    expect(screen.getByText("Контент")).toBeInTheDocument()
  })

  it("omits the title when showTitle is false", () => {
    render(
      <CardBox title="Заголовок" showTitle={false}>
        Контент
      </CardBox>
    )
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(screen.getByText("Контент")).toBeInTheDocument()
  })

  it("omits the title when none is given", () => {
    render(<CardBox>Контент</CardBox>)
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
  })

  it("marks the type on the root so consumers can target it", () => {
    const { container, rerender } = render(<CardBox type="table">x</CardBox>)
    expect(container.querySelector('[data-slot="card-box"]')).toHaveAttribute(
      "data-type",
      "table"
    )

    rerender(<CardBox type="small">x</CardBox>)
    expect(container.querySelector('[data-slot="card-box"]')).toHaveAttribute(
      "data-type",
      "small"
    )
  })

  it("applies the max-height limit of the small type", () => {
    const { container } = render(
      <CardBox type="small" maxHeight={320}>
        x
      </CardBox>
    )
    const root = container.querySelector('[data-slot="card-box"]')
    expect(root).toHaveStyle({ "--card-box-max-h": "320px" })
  })

  it("forces the scroll dividers when showScrollbar is true", () => {
    const { container } = render(
      <CardBox type="small" title="Заголовок" showScrollbar>
        x
      </CardBox>
    )
    // Верхний разделитель живёт на шапке отдельной линией, нижний — рамкой
    // на полосе внизу.
    expect(
      container.querySelectorAll(".bg-\\[var\\(--card-box-divider\\)\\]")
    ).toHaveLength(1)
    expect(
      container.querySelectorAll(".border-t-\\[var\\(--card-box-divider\\)\\]")
    ).toHaveLength(1)
  })
})
