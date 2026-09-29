import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ButtonMenuBlack } from "./black"

// Аудит r25: пары «подпись/значение» собирают условиями
// (`[cond && {…}]`), а `null`/`false` среди них роняли рендер на
// `item.className`.

describe("ButtonMenuBlack: пустые элементы info", () => {
  it("null и false отбрасываются, остальные рисуются", () => {
    const { container } = render(
      <ButtonMenuBlack info={[null, { label: "Выбрано", value: "3 документа" }, false]} />
    )
    const info = container.querySelector('[data-slot="button-menu-black-info"]')
    expect(info?.children).toHaveLength(1)
    expect(info).toHaveTextContent("3 документа")
  })

  it("одни пустые элементы — блока информации нет", () => {
    const { container } = render(<ButtonMenuBlack info={[null, false]} />)
    expect(container.querySelector('[data-slot="button-menu-black-info"]')).toBeNull()
  })
})
