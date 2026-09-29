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
    // Ширина по содержимому — рядом (w-max), а не запретом переноса на
    // десктопе: см. informer-buttons-r23 / status-screen-buttons-r23.
    expect(row.className.split(/\s+/)).toContain("w-max")
  })
})
