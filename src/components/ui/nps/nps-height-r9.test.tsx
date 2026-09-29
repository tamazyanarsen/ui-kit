import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Nps } from "./nps"

// Аудит r9: раскрытая плавающая NPS (оценка + чипсы + комментарий) выше
// 600px, а высоты у неё не было ограничено — на невысоком экране верх
// карточки с крестиком уходил за экран, закрыть опрос было нечем.

describe("Nps: плавающая карточка не выше видимой области", () => {
  it("высота ограничена экраном без полей и занятого низа, остальное прокручивается", () => {
    const { container } = render(<Nps floating defaultValue={4} onClose={() => {}} />)
    const classes = (container.firstElementChild as HTMLElement).className.split(/\s+/)
    expect(classes).toContain(
      "max-h-[calc(100dvh_-_2rem_-_var(--floating-bottom,0px))]"
    )
    expect(classes).toContain(
      "desktop:max-h-[calc(100dvh_-_5rem_-_var(--floating-bottom,0px))]"
    )
    expect(classes).toContain("overflow-y-auto")
  })

  it("встроенная карточка высоту не ограничивает", () => {
    const { container } = render(<Nps defaultValue={4} />)
    const card = container.querySelector('[data-slot="nps"]') as HTMLElement
    expect(card.className).not.toMatch(/max-h-/)
  })
})
