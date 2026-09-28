import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { useBelowReserve } from "./use-below-reserve"

// Итоговая проверка №4: у залипшей липкой таблицы Chrome включает сдвиг
// прилипания в `offsetTop`. Пересчёт во время прилипания занижал хвост
// страницы на этот сдвиг, срабатывала ветка «хвост меньше свободной
// высоты», и окно таблицы схлопывалось (в Chrome — до 7px, с прыжком
// прокрутки в начало). Низ таблицы теперь считается от нелипкого родителя.

function Block() {
  const ref = React.useRef<HTMLDivElement>(null)
  useBelowReserve(ref, true)
  return (
    <div data-testid="parent">
      <div data-testid="root" ref={ref} />
      <div data-testid="pager" />
    </div>
  )
}

/**
 * Геометрия из воспроизведения в Chrome: блок с 300, внутри таблица 550 и
 * пагинатор 50 (блок 700), естественный низ таблицы — 950, хвост страницы
 * 570, вьюпорт 600. Залипшая таблица сообщает `offsetTop` со сдвигом.
 */
function mockGeometry(rootOffsetTop: number) {
  const byTestId = (el: HTMLElement) => el.dataset.testid
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    if (byTestId(this) === "parent") return 300
    if (byTestId(this) === "root") return rootOffsetTop
    return 0
  })
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    if (byTestId(this) === "parent") return 700
    if (byTestId(this) === "root") return 550
    return 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const height = byTestId(this) === "pager" ? 50 : 0
    return { height, width: 100, top: 0, left: 0, right: 100, bottom: height } as DOMRect
  })
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(1570)
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(600)
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(600)
}

const below = () =>
  (document.querySelector('[data-testid="root"]') as HTMLElement).style.getPropertyValue(
    "--table-below"
  )

describe("useBelowReserve: залипшая таблица", () => {
  afterEach(() => vi.restoreAllMocks())

  it("в естественном положении резервирует только пагинатор", () => {
    mockGeometry(400)
    render(<Block />)
    expect(below()).toBe("50px")
  })

  it("сдвиг прилипания в offsetTop не схлопывает окно", () => {
    // Залипшая: offsetTop 440 вместо 400 — старая мера давала хвост 580 < 600
    // и публиковала 580px, окну оставалось 20px.
    mockGeometry(440)
    render(<Block />)
    expect(below()).toBe("50px")
  })
})
