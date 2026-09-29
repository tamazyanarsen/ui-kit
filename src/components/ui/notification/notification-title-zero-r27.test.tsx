import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { NotificationPanel } from "./notification"

// r27: `title && …` с числом 0 выводил голый «0» в панели без обёртки заголовка.

describe("NotificationPanel: title-число", () => {
  it("ноль лежит в заголовке, а не голым текстом", () => {
    const { container } = render(<NotificationPanel title={0} items={[]} />)
    const panel = container.querySelector("[data-slot=notification-panel]")!
    const p = panel.querySelector("p.text-h3")
    expect(p?.textContent).toBe("0")
    // Ни одного текстового узла «0» прямо в корне панели.
    expect(Array.from(panel.childNodes).some((n) => n.nodeType === 3)).toBe(false)
  })

  it("пустая строка заголовок не рисует", () => {
    const { container } = render(<NotificationPanel title="" items={[]} />)
    expect(container.querySelector("p.text-h3")).toBeNull()
  })
})
