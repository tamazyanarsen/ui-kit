import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import type * as React from "react"

import { ViewportScope } from "@/lib/viewport"

import { ButtonMenuBlack } from "./black"

// Сверки ниже — про десктопную форму панели: с v1.1.0 у неё есть Mobile,
// а jsdom без медиазапроса видит именно мобильную.
const desktop = {
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <ViewportScope viewport="desktop">{children}</ViewportScope>
  ),
}

// Аудит r25: пары «подпись/значение» собирают условиями
// (`[cond && {…}]`), а `null`/`false` среди них роняли рендер на
// `item.className`.

describe("ButtonMenuBlack: пустые элементы info", () => {
  it("null и false отбрасываются, остальные рисуются", () => {
    const { container } = render(
      <ButtonMenuBlack info={[null, { label: "Выбрано", value: "3 документа" }, false]} />,
      desktop
    )
    const info = container.querySelector('[data-slot="button-menu-black-info"]')
    expect(info?.children).toHaveLength(1)
    expect(info).toHaveTextContent("3 документа")
  })

  it("одни пустые элементы — блока информации нет", () => {
    const { container } = render(<ButtonMenuBlack info={[null, false]} />, desktop)
    expect(container.querySelector('[data-slot="button-menu-black-info"]')).toBeNull()
  })
})
