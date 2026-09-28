import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { NotificationItem } from "./notification"

// Аудит r6: `{sum && …}` при `sum={0}` рисовал голый «0» без абзаца и цвета.

describe("NotificationItem: сумма 0", () => {
  it("рисуется в своём абзаце", () => {
    render(<NotificationItem title="Платёж" sum={0} />)
    const sum = screen.getByText("0")
    expect(sum.tagName).toBe("P")
    expect(sum.className).toContain("text-p2-medium")
  })
})
