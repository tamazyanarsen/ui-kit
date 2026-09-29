import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { NotificationItem } from "./notification"

// Аудит 23: вне панели (NotificationItem экспортируется сам по себе) ряд
// кнопки и времени не переносился — на телефоне время уходило за край на
// 3–58px. Раскладку jsdom не считает — проверяется перенос ряда.

describe("NotificationItem: ряд кнопки и времени", () => {
  it("переносится, время встаёт под кнопку", () => {
    render(
      <NotificationItem
        title="Платёж исполнен"
        buttonLabel="Перейти к документу"
        timestamp="12.09.2026, 14:35"
      />
    )
    const row = screen.getByRole("button", { name: "Перейти к документу" }).parentElement!
    expect(row).toHaveClass("flex-wrap", "gap-y-2")
  })
})
