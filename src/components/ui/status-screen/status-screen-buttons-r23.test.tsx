import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ViewportScope } from "@/lib/viewport"

import { StatusScreen } from "./status-screen"

// Аудит 22: у StatusScreen тот же запрет переноса на десктопе, что у
// Informer: в колонке 288 на экране 1280 кнопки выходили за неё на 85px.
// Ряд — шириной по содержимому, но не шире колонки.

describe("StatusScreen: ряд кнопок в десктопной форме", () => {
  it("переносится и не шире колонки, ширина — по содержимому", () => {
    render(
      <ViewportScope viewport="desktop">
        <StatusScreen
          status="success"
          title="Готово"
          showButtons
          primaryButtonLabel="В центр уведомлений"
          secondaryButtonLabel="Прочитать все (23)"
        />
      </ViewportScope>
    )
    const row = screen.getByRole("button", { name: "В центр уведомлений" }).parentElement!
    const classes = row.className.split(/\s+/)
    expect(classes).toEqual(expect.arrayContaining(["flex-wrap", "w-max", "max-w-full"]))
    expect(classes).not.toContain("desktop:flex-nowrap")
  })
})
