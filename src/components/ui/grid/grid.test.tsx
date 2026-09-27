import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { GRID_COLUMNS, Grid, GridCol, GridRow, gridSpanWidth } from "./grid"

describe("Grid", () => {
  it("рисует полосу и пробрасывает нативные пропсы", () => {
    render(
      <Grid data-testid="bar" id="page">
        содержимое
      </Grid>
    )
    const bar = screen.getByTestId("bar")
    expect(bar).toHaveAttribute("id", "page")
    expect(bar).toHaveTextContent("содержимое")
  })

  it("колонка по умолчанию занимает все 12", () => {
    render(
      <GridRow>
        <GridCol data-testid="col">колонка</GridCol>
      </GridRow>
    )
    expect(screen.getByTestId("col")).toBeInTheDocument()
  })
})

describe("gridSpanWidth", () => {
  // Формула та же, что у сетки: 12 колонок и 11 желобов делят полосу,
  // N колонок забирают N долей и N−1 желобов.
  it("на всю ширину отдаёт 100%", () => {
    expect(gridSpanWidth(GRID_COLUMNS)).toBe("100%")
  })

  it("для части колонок считает через желоба", () => {
    expect(gridSpanWidth(6)).toBe(
      "calc((100% - 11 * var(--grid-gutter)) / 12 * 6 + var(--grid-gutter) * 5)"
    )
  })

  it("зажимает значение в границы 1…12", () => {
    expect(gridSpanWidth(0)).toBe(gridSpanWidth(1))
    expect(gridSpanWidth(99)).toBe("100%")
  })

  it("округляет дробное число колонок", () => {
    expect(gridSpanWidth(5.6)).toBe(gridSpanWidth(6))
  })
})
