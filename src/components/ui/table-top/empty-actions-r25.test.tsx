import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TableTopSummary } from "./table-top"

// Раунд 25. `actions={[]}` (кнопки собраны `.map` по пустому списку) считался
// истинным, и рядом с текстом рисовалась пустая обёртка с зазором. Ноль —
// настоящее содержимое и обёртку получает.

const wrappers = (container: HTMLElement) =>
  container.querySelectorAll("[data-slot=table-top-summary] > div")

describe("TableTopSummary: пустые actions", () => {
  it("пустой массив, false, null и пустая строка обёртку не рисуют", () => {
    for (const actions of [[], false, null, ""]) {
      const { container, unmount } = render(<TableTopSummary info="Строк: 5" actions={actions} />)
      expect(wrappers(container).length).toBe(1)
      unmount()
    }
  })

  it("число 0 — содержимое", () => {
    const { container } = render(<TableTopSummary info="Строк" actions={0} />)
    expect(wrappers(container).length).toBe(2)
    expect(wrappers(container)[1].textContent).toBe("0")
  })
})
