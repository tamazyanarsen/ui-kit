import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Chips } from "./chips"

// «Show Icon Left»: иконка 16×16 стоит первой в строке значения, перед текстом.
describe("Chips — иконка слева", () => {
  it("рисует иконку слева от значения", () => {
    const { container } = render(
      <Chips type="filter-white" iconLeft={<svg data-testid="l" />} icon={<svg data-testid="r" />}>
        Фильтр
      </Chips>
    )
    const row = container.querySelector("[data-slot=chips-icon-left]")!.parentElement!
    expect(row.firstElementChild).toBe(container.querySelector("[data-slot=chips-icon-left]"))
    expect(row.querySelector("[data-testid=r]")).not.toBeNull()
  })

  it("без iconLeft слот не создаётся, 0 тоже считается значением", () => {
    const { container, rerender } = render(<Chips>Фильтр</Chips>)
    expect(container.querySelector("[data-slot=chips-icon-left]")).toBeNull()
    rerender(<Chips iconLeft={0}>Фильтр</Chips>)
    expect(container.querySelector("[data-slot=chips-icon-left]")).not.toBeNull()
  })

  it("в типе с подписью иконка остаётся в строке значения, а не над ней", () => {
    const { container } = render(
      <Chips type="filter-subtitle-white" subtitle="Подпись" iconLeft={<svg />}>
        Фильтр
      </Chips>
    )
    const icon = container.querySelector("[data-slot=chips-icon-left]")!
    expect(icon.parentElement!.textContent).toContain("Фильтр")
    expect(icon.parentElement!.textContent).not.toContain("Подпись")
  })
})
