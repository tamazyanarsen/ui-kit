import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { RangeInput } from "./range-input"

// Раунд 25, класс «{x && …} с числом 0»: подпись 0 выводилась голым текстом
// мимо своей обёртки, комментарий 0 не рисовался.

describe("RangeInput: числа-узлы", () => {
  it("подпись 0 стоит в своём узле", () => {
    const { container } = render(<RangeInput label={0} defaultValue={5} />)
    expect(container.querySelector("[data-slot=range-input-label]")?.textContent).toBe("0")
  })

  it("комментарий 0 рисуется абзацем", () => {
    const { container } = render(<RangeInput comment={0} defaultValue={5} />)
    const caption = container.querySelector("p")
    expect(caption?.textContent).toBe("0")
    expect(container.querySelector("input")).toHaveAttribute("aria-describedby", caption?.id)
  })
})
