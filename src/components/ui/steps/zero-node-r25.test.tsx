import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Steps } from "./steps"

// Раунд 25, класс «{x && …} с числом 0»: `statusText` 0 выводился голым
// текстом в карточке шага, а не строкой статуса.

describe("Steps: statusText-число", () => {
  it("ноль лежит в своей строке статуса", () => {
    const { container } = render(
      <Steps steps={[{ title: "Шаг", description: "Описание", statusText: 0 }]} />
    )
    const lines = container.querySelectorAll("[data-slot=step] p")
    expect(lines.length).toBe(3)
    expect(lines[2].textContent).toBe("0")
  })
})
