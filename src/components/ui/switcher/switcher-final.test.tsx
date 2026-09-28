import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Switcher } from "./switcher"

// Финальный аудит: неуправляемое значение при асинхронных пунктах,
// объявление выбора и обрезка мерной копии.

const TWO = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
]

// Видимые сегменты (мерная копия под aria-hidden в выборку не попадает).
const pressed = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.dataset.active === "true")
    .map((button) => button.textContent)

describe("Switcher: неуправляемое значение", () => {
  it("пункты пришли после пустого массива — выбран первый", () => {
    const { rerender } = render(<Switcher items={[]} />)
    rerender(<Switcher items={TWO} />)
    expect(pressed()).toEqual(["Все"])
  })

  it("набор заменили — выбор откатывается на первый пункт нового набора", () => {
    const { rerender } = render(<Switcher items={TWO} />)
    rerender(
      <Switcher
        items={[
          { value: "x", label: "Икс", disabled: true },
          { value: "y", label: "Игрек" },
        ]}
      />
    )
    // Первый доступный, а не просто первый: выключенный выбрать нельзя.
    expect(pressed()).toEqual(["Игрек"])
  })
})

describe("Switcher: выбор виден вспомогательным технологиям", () => {
  it("выбранный сегмент — aria-pressed=true, остальные — false", () => {
    render(<Switcher items={TWO} defaultValue="active" />)
    expect(screen.getByRole("button", { name: "Активные" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Все" })).toHaveAttribute("aria-pressed", "false")
  })
})

describe("Switcher: мерная копия", () => {
  it("лежит в обрезающей обёртке и не раздвигает прокрутку страницы", () => {
    const { container } = render(<Switcher items={TWO} />)
    const copy = container.querySelector('[aria-hidden="true"] [data-slot="switcher-item"]')!
    const layer = copy.closest('[aria-hidden="true"]')!
    expect(layer.className).toContain("overflow-hidden")
    expect(layer.className).toContain("inset-0")
  })
})
