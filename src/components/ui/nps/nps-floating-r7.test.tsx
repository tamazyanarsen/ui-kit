import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Nps } from "./nps"

// Аудит r7: плавающая карточка 360px с отступом 40px на экране 375 уходила
// за левый край на 40px. На мобильном — поля 16px и ширина не больше
// видимой области; от 768px всё как было (геометрия сверена в Chrome).

describe("Nps floating: не шире узкого экрана", () => {
  it("на мобильном ширина ограничена, отступы 16px; на десктопе прежние", () => {
    const { container } = render(<Nps floating />)
    const card = container.firstElementChild as HTMLElement
    const classes = card.className.split(/\s+/)
    expect(classes).toEqual(
      expect.arrayContaining([
        "fixed",
        "right-4",
        "bottom-[calc(1rem+var(--floating-bottom,0px))]",
        "max-w-[calc(100%_-_32px)]",
        "desktop:right-10",
        "desktop:bottom-[calc(2.5rem+var(--floating-bottom,0px))]",
        "desktop:max-w-none",
      ])
    )
    expect(classes).not.toContain("right-10")
  })

  it("без floating ограничения нет", () => {
    const { container } = render(<Nps />)
    const card = container.firstElementChild as HTMLElement
    expect(card.className).not.toContain("max-w-[calc(100%_-_32px)]")
  })
})
