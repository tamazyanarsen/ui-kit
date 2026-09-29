import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { NotificationItem, NotificationPanel } from "./notification"

// r25: число 0 в подписях, ряд «кнопка / время» при времени 0 и пустые
// элементы массива `items`.

describe("NotificationItem с числом 0", () => {
  it("статус 0 рисуется внутри абзаца", () => {
    render(<NotificationItem title="Т" status={0} />)
    expect(screen.getByText("0").tagName).toBe("P")
  })

  it("описание 0 рисуется внутри абзаца", () => {
    render(<NotificationItem title="Т" description={0} />)
    expect(screen.getByText("0").tagName).toBe("P")
  })

  it("время 0 без кнопки рисуется в своей строке, а не голым нулём", () => {
    render(<NotificationItem title="Т" timestamp={0} />)
    expect(screen.getByText("0").className).toContain("text-p2-medium")
  })
})

describe("NotificationPanel", () => {
  it("false и null среди items не дают пустых строк и не падают", () => {
    const items = [
      { title: "Первое" },
      null,
      false,
      { title: "Второе" },
    ] as unknown as { title: string }[]
    const { container } = render(<NotificationPanel items={items} />)
    expect(
      container.querySelectorAll('[data-slot="notification-item"]')
    ).toHaveLength(2)
  })
})
