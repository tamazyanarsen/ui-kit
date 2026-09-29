import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ViewportScope } from "@/lib/viewport"

import { BlockWidgetHead } from "./head"

// Аудит r25: `subtitle`, `description` и `status` со значением 0 (сумма,
// счётчик) не рисовались в своих узлах: `&&` выводил голый «0» в строку
// заголовка, а `status ? … : null` терял значение совсем.

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe("BlockWidgetHead: нулевые значения", () => {
  it("десктоп: подзаголовок 0 — вторым узлом строки заголовка", () => {
    const { container } = render(
      <ViewportScope viewport="desktop">
        <BlockWidgetHead title="Счёт" subtitle={0} />
      </ViewportScope>
    )
    const cells = slot(container, "block-widget-title-block").querySelectorAll("span.truncate")
    expect(cells).toHaveLength(2)
    expect(cells[1]).toHaveTextContent("0")
  })

  it("мобайл: подзаголовок 0 — отдельной строкой под заголовком", () => {
    const { container } = render(
      <ViewportScope viewport="mobile">
        <BlockWidgetHead title="Счёт" subtitle={0} />
      </ViewportScope>
    )
    const cells = slot(container, "block-widget-title-block").querySelectorAll("span.truncate")
    expect(cells).toHaveLength(2)
    expect(cells[1]).toHaveTextContent("0")
  })

  it("описание 0 — абзацем", () => {
    const { container } = render(<BlockWidgetHead title="Счёт" description={0} />)
    expect(slot(container, "block-widget-title-block").querySelector("p")).toHaveTextContent("0")
  })

  it("приписка 0 — в узле статуса", () => {
    const { container } = render(<BlockWidgetHead title="Счёт" status={0} />)
    expect(slot(container, "block-widget-status")).toHaveTextContent("0")
  })

  it("пустые значения узлов не рисуют", () => {
    const { container } = render(
      <BlockWidgetHead title="Счёт" subtitle="" description="" status="" />
    )
    expect(slot(container, "block-widget-status")).toBeNull()
    expect(container.querySelector("p")).toBeNull()
  })
})
