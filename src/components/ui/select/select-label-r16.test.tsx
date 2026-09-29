import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Select, SelectTrigger, SelectValue } from "./index"

// Аудит 15: при `clearable={false}` крестика нет, но подпись с выбранным
// значением всё равно держала под него место (`right-16`) и обрезалась
// на 24px раньше, чем могла.

const items = [{ value: "a", label: "Альфа" }]

function renderSelect(clearable: boolean) {
  render(
    <Select items={items} defaultValue="a">
      <SelectTrigger label="Длинная подпись поля" clearable={clearable}>
        <SelectValue />
      </SelectTrigger>
    </Select>
  )
  return screen.getByText("Длинная подпись поля")
}

describe("Select: подпись без крестика не держит под него место", () => {
  it("clearable={false} — граница right-10 и при выбранном значении", () => {
    const label = renderSelect(false)
    expect(label).toHaveClass("group-[&:not([data-placeholder])]/trigger:right-10")
    expect(label).not.toHaveClass("group-[&:not([data-placeholder])]/trigger:right-16")
  })

  it("с крестиком место под него остаётся", () => {
    const label = renderSelect(true)
    expect(label).toHaveClass("group-[&:not([data-placeholder])]/trigger:right-16")
  })

  // Проверка правок r16: у выключенного поля и поля только для чтения
  // крестика тоже нет, а подпись держала под него место.
  it.each([
    ["disabled", { disabled: true }, "data-disabled"],
    ["readOnly", { readOnly: true }, "data-readonly"],
  ] as const)("%s — граница right-10", (_, rootProps, attr) => {
    render(
      <Select items={items} defaultValue="a" {...rootProps}>
        <SelectTrigger label="Подпись поля">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    const label = screen.getByText("Подпись поля")
    expect(label.closest('[data-slot="select-trigger"]')).toHaveAttribute(attr)
    expect(label).toHaveClass(`group-[&:not([data-placeholder])[${attr}]]/trigger:right-10`)
  })
})
