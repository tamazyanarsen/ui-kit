import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Event } from "./event"

// Аудит 14: сетка документов делилась на две колонки медиазапросом `sm:`
// (от 640px экрана) — единственным в ките. В мобильной форме и узком
// контейнере колонки по 156px обрезали имя файла до ~10 знаков.

describe("Event: колонки документов по ширине блока", () => {
  it("две колонки — контейнерным запросом, а не медиазапросом или формой кита", () => {
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
    // Сверка r15: `desktop:` в десктопной форме в узком контейнере всё равно
    // давал две колонки по ~155px — считаем по ширине самого блока.
    expect(grid).toHaveClass("@min-[480px]/event-docs:grid-cols-2")
    expect(grid.parentElement).toHaveClass("@container/event-docs")
    expect(grid).not.toHaveClass("sm:grid-cols-2")
    expect(grid).not.toHaveClass("desktop:grid-cols-2")
  })
})
