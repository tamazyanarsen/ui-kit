import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Card } from "./card"

// Аудит r25: `titleSuffix`, `tag` и `subtitle` со значением 0 рисовали голый
// «0» прямо во флексе строки — без «•», без плашки Tag и без своей колонки.

describe("Card: нулевые значения слотов", () => {
  it("titleSuffix 0 — с точкой-разделителем", () => {
    render(<Card title="Счёт" titleSuffix={0} showThumbnail={false} />)
    expect(screen.getByText("• 0")).toBeInTheDocument()
  })

  it("tag 0 — в плашке Tag", () => {
    const { container } = render(<Card title="Счёт" tag={0} showThumbnail={false} />)
    expect(container.querySelector('[data-slot="tag"]')).toHaveTextContent("0")
  })

  it("subtitle 0 — в своей строке с многоточием", () => {
    render(<Card title="Счёт" subtitle={0} showThumbnail={false} />)
    const subtitle = screen.getByText("0")
    expect(subtitle.tagName).toBe("SPAN")
    expect(subtitle).toHaveClass("truncate")
  })
})
