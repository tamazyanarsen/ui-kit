import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Tag } from "./tag"

// Правки UI-Kit от 25.10, «Tag — текст выше середины»: на десктопе текст
// на 1px ниже (pt 2px при высоте 22), значок возвращается `translate: 0 -1px`.

describe("Tag: текст по середине на десктопе", () => {
  it("десктоп не снимает верхний отступ 2px (было desktop:pt-0)", () => {
    render(<Tag>Активен</Tag>)
    const tag = screen.getByText("Активен")
    expect(tag).toHaveClass("pt-[2px]", "desktop:h-[22px]")
    expect(tag).not.toHaveClass("desktop:pt-0")
  })

  it("значок на десктопе поднят на 1px, в мобильной форме — нет", () => {
    render(<Tag icon="clock">В обработке</Tag>)
    const tag = screen.getByText("В обработке")
    const cls = tag.className.split(" ")
    expect(cls).toContain("desktop:[&>:is([data-slot=icon],svg)]:[translate:0_-1px]")
    // Без префикса desktop: сдвига нет — мобильный значок остаётся на месте.
    expect(cls.some((c) => c.includes("translate") && !c.startsWith("desktop:"))).toBe(false)
  })
})
