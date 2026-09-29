import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"

// Раунд 25, класс «{x && …} с числом 0»: подпись 0 выводилась голым текстом
// мимо своей обёртки, комментарий 0 — тоже мимо абзаца.

describe("Select: числа-узлы", () => {
  it("подпись 0 стоит в своём узле и именует поле", () => {
    const { container } = render(
      <Select>
        <SelectTrigger label={0}>
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    const label = container.querySelector("[id$=-label]")
    expect(label?.textContent).toBe("0")
    expect(container.querySelector("[data-slot=select-trigger]")).toHaveAttribute(
      "aria-labelledby",
      label?.id
    )
  })

  it("комментарий 0 лежит в абзаце и описывает поле", () => {
    const { container } = render(
      <Select>
        <SelectTrigger comment={0}>
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    const caption = container.querySelector("p")
    expect(caption?.textContent).toBe("0")
    expect(container.querySelector("[data-slot=select-trigger]")).toHaveAttribute(
      "aria-describedby",
      caption?.id
    )
  })
})
