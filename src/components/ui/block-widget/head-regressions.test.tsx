import * as React from "react"
import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ViewportScope, type Viewport } from "@/lib/viewport"

import { BlockWidget } from "./block-widget"
import { BlockWidgetHead } from "./head"

let mounts = 0

function StatefulAction() {
  React.useEffect(() => {
    mounts += 1
  }, [])
  return <button type="button">Действие</button>
}

function Harness({ viewport }: { viewport: Viewport }) {
  return (
    <ViewportScope viewport={viewport}>
      <BlockWidget>
        <BlockWidgetHead title="Счета" status="Обновлено" action={<StatefulAction />} />
      </BlockWidget>
    </ViewportScope>
  )
}

describe("BlockWidgetHead: переход через брейкпоинт", () => {
  it("action не перемонтируется при смене Desktop ↔ Mobile", () => {
    mounts = 0
    const { rerender } = render(<Harness viewport="desktop" />)
    const button = screen.getByRole("button", { name: "Действие" })

    rerender(<Harness viewport="mobile" />)
    rerender(<Harness viewport="desktop" />)

    expect(mounts).toBe(1)
    expect(screen.getByRole("button", { name: "Действие" })).toBe(button)
  })

  it("приписка и кнопка лежат в одной группе внутри шапки", () => {
    const { container } = render(<Harness viewport="mobile" />)
    const head = container.querySelector('[data-slot="block-widget-head"]')
    const trailing = head?.querySelector('[data-slot="block-widget-trailing"]')
    expect(trailing).toContainElement(screen.getByRole("button", { name: "Действие" }))
    expect(trailing).toHaveTextContent("Обновлено")
  })
})
