import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

// Аудит 12: крестик «Очистить» виден у любого выбранного значения, но
// вызывал только необязательный `onClear` — без него (сортировка TableTop)
// значение оставалось на месте.

const ITEMS = [
  { value: "a", label: "Альфа" },
  { value: "b", label: "Бета" },
]

function Options() {
  return (
    <SelectContent>
      {ITEMS.map((o) => (
        <SelectItem key={o.value} value={o.value}>
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  )
}

describe("Select: «Очистить» сбрасывает значение", () => {
  it("неуправляемый Select без onClear очищается", async () => {
    const user = userEvent.setup()
    render(
      <Select items={ITEMS} defaultValue="a">
        <SelectTrigger label="Сортировка">
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <Options />
      </Select>
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveTextContent("Альфа")
    await user.click(screen.getByRole("button", { name: "Очистить" }))
    expect(trigger).toHaveAttribute("data-placeholder")
    expect(trigger).not.toHaveTextContent("Альфа")
  })

  it("управляемый Select получает onValueChange(null), onClear тоже вызывается", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const onValueChange = vi.fn()
    function Harness() {
      const [value, setValue] = useState<string | null>("b")
      return (
        <Select
          items={ITEMS}
          value={value}
          onValueChange={(next) => {
            onValueChange(next)
            setValue(next)
          }}
        >
          <SelectTrigger size="sm" onClear={onClear}>
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <Options />
        </Select>
      )
    }
    render(<Harness />)
    await user.click(screen.getByRole("button", { name: "Очистить" }))
    expect(onValueChange).toHaveBeenCalledWith(null)
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("combobox")).toHaveAttribute("data-placeholder")
  })

  it("выбор из списка в неуправляемом Select работает как раньше", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select items={ITEMS} onValueChange={onValueChange}>
        <SelectTrigger label="Сортировка">
          <SelectValue placeholder="Сортировка" />
        </SelectTrigger>
        <Options />
      </Select>
    )
    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Бета" }))
    expect(onValueChange.mock.calls[0][0]).toBe("b")
    expect(screen.getByRole("combobox")).toHaveTextContent("Бета")
  })
})
