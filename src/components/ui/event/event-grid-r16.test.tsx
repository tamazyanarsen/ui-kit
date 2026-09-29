import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Event } from "./event"

// Аудит 15: контейнерный запрос из r15 (`@container` на обёртке сетки)
// обнулял ширину по содержимому — Event в контейнере по содержимому
// (inline-block, колонка грида auto) сжимался до ~230px и резал имена
// файлов. Колонки теперь считает сама сетка: не больше двух, вторая — от
// 240px на колонку, без `container-type`.

describe("Event: колонки документов без контейнерного запроса", () => {
  it("сетка сама делит ширину, обёртки с container-type нет", () => {
    render(
      <Event
        title="Документ подписан"
        documents={[
          { name: "Платёжное_поручение_123.pdf", meta: "PDF, 1 МБ" },
          { name: "Выписка.pdf", meta: "PDF, 2 МБ" },
        ]}
      />
    )
    const grid = screen.getByText("Платёжное_поручение_123.pdf").closest(".grid") as HTMLElement
    // Проверка правок r16: `auto-fit`, а не `auto-fill` — пустая вторая
    // колонка схлопывается, и один документ занимает всю ширину блока.
    expect(grid.className).toContain("auto-fit")
    expect(grid.className).not.toContain("auto-fill")
    expect(grid.className).toContain("240px")
    expect(grid.className).not.toMatch(/@min-|@container/)
    expect(grid.parentElement!.className).not.toMatch(/@container/)
  })
})
