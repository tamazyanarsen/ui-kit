import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { StatusScreen } from "./status-screen"

// Аудит r9: две кнопки стояли в ряду без переноса — «В центр уведомлений»
// и «Прочитать все (23)» на 375 уходили за край на 35px.

describe("StatusScreen: кнопки не уходят за край", () => {
  it("ряд кнопок переносится", () => {
    render(
      <StatusScreen
        title="Готово"
        showButtons
        primaryButtonLabel="В центр уведомлений"
        secondaryButtonLabel="Прочитать все (23)"
      />
    )
    const row = screen.getByRole("button", { name: "В центр уведомлений" }).parentElement!
    expect(row.className.split(/\s+/)).toContain("flex-wrap")
    // Сверка r9: на десктопе ряд без переноса — в контейнере по содержимому
    // перенос сжимал экран и ронял кнопки в столбик.
    expect(row.className.split(/\s+/)).toContain("desktop:flex-nowrap")
  })
})
