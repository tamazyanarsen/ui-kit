import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { TableTopDetails } from "./table-top"

// Правки UI-Kit от 25.10: лента пар прокручивается вбок — запас под кольцо
// фокуса `--ring-room` по вертикали, раскладка на месте.
describe("TableTopDetails: запас под кольцо фокуса", () => {
  it("у ленты поле и отрицательное поле по вертикали", () => {
    render(<TableTopDetails items={[{ label: "Подпись:", value: "1" }]} />)
    const track = document.querySelector<HTMLElement>(
      '[data-slot="table-top-details-track"]'
    )!
    const classes = track.className.split(/\s+/)
    expect(classes).toContain("py-(--ring-room)")
    expect(classes).toContain("-my-(--ring-room)")
  })
})
