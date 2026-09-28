import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CardBox } from "./card-box"

// Аудит r6: `title={false}` (условная разметка) и `title=""` считались
// заголовком — рисовалась пустая шапка, а у `small` терялся верхний отступ.

describe("CardBox: пустой заголовок — это «без заголовка»", () => {
  it.each([false, ""])("large с title=%j не рисует пустой h2", (title) => {
    const { container } = render(
      <CardBox title={title}>
        <p>Контент</p>
      </CardBox>
    )
    expect(container.querySelector("h2")).toBeNull()
  })

  it.each([false, ""])("small с title=%j даёт контенту верхний отступ", (title) => {
    const { container } = render(
      <CardBox type="small" title={title}>
        <p>Контент</p>
      </CardBox>
    )
    expect(container.querySelector("h2")).toBeNull()
    const area =
      screen.getByText("Контент").closest('[data-slot="scrollbar"]') ??
      screen.getByText("Контент").parentElement!
    expect(area.className).toMatch(/\bpt-4\b/)
  })

  it("table с title=false не рисует пустую шапку", () => {
    const { container } = render(
      <CardBox type="table" title={false}>
        <p>Контент</p>
      </CardBox>
    )
    expect(container.querySelector("h2")).toBeNull()
  })
})
