import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Steps } from "./steps"

// Правки UI-Kit от 25.10: лента шагов прокручивается вбок и режет кольцо
// фокуса карточки сверху и снизу — запас `--ring-room` по вертикали.
describe("Steps: запас под кольцо фокуса", () => {
  it("у ленты поле и отрицательное поле по вертикали", () => {
    render(<Steps steps={[{ title: "Шаг 1", description: "а" }]} />)
    const strip = document.querySelector<HTMLElement>('[data-slot="steps-strip"]')!
    const classes = strip.className.split(/\s+/)
    expect(classes).toContain("py-(--ring-room)")
    expect(classes).toContain("-my-(--ring-room)")
  })
})
