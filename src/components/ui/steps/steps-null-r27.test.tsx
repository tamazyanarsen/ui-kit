import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Steps } from "./steps"

// r27: `[cond && step]` даёт в списке false/null; Steps падал на
// `findIndex` (чтение `state` у null) и на разборе шага.

describe("Steps: пустые элементы списка", () => {
  it("null и false среди шагов отбрасываются, остальные рисуются", () => {
    const steps = [
      { title: "Первый", description: "а" },
      null,
      false,
      { title: "Второй", description: "б", state: "active" },
    ] as unknown as Parameters<typeof Steps>[0]["steps"]
    const { container } = render(<Steps steps={steps} />)
    const cards = container.querySelectorAll("[data-slot=step]")
    expect(cards).toHaveLength(2)
    expect(cards[1]).toHaveAttribute("data-state", "active")
  })
})
