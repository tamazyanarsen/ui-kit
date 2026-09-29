import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Card } from "./card"

// r27: menuItems из одних false/null (`[can && item]`) рисовал кнопку «…» с
// пустым меню.

describe("Card: пустые пункты меню", () => {
  it("без настоящих пунктов кнопки меню нет", () => {
    const { container } = render(<Card title="Счёт" menuItems={[false, null] as never} />)
    expect(container.querySelectorAll("button")).toHaveLength(0)
  })

  it("с настоящим пунктом кнопка есть", () => {
    const items = [false, { label: "Закрыть", onClick: () => {} }] as never
    const { container } = render(<Card title="Счёт" menuItems={items} />)
    expect(container.querySelectorAll("button")).toHaveLength(1)
  })
})
