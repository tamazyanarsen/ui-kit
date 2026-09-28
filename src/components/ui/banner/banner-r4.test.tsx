import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Banner } from "./banner"

// Итоговая проверка №3: в `compact` строка-описание уходила в голый `<p>`,
// и маркер `bullet` у неё пропадал — в desktop и mobile он есть.

const bullets = (root: HTMLElement) =>
  root.querySelectorAll('span[aria-hidden="true"].w-1').length

describe("Banner: маркер у строки-описания", () => {
  it.each(["compact", "desktop", "mobile"] as const)("%s рисует маркер", (size) => {
    const { container } = render(
      <Banner size={size} title="Новое" description="Строка описания" bullet />
    )
    expect(bullets(container)).toBe(1)
  })

  it("compact без bullet по-прежнему без маркера", () => {
    const { container } = render(
      <Banner size="compact" title="Новое" description="Строка описания" />
    )
    expect(bullets(container)).toBe(0)
  })
})
