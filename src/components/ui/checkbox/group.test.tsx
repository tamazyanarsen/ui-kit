import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CheckboxGroup } from "./group"

const ITEMS = [
  { value: "a", label: "Первый" },
  { value: "b", label: "Второй" },
  { value: "c", label: "Третий", disabled: true },
]

function box(name: string) {
  return screen.getByRole("checkbox", { name })
}

describe("CheckboxGroup", () => {
  it("toggles one option without touching the others", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<CheckboxGroup items={ITEMS} onValueChange={onValueChange} />)

    await user.click(box("Первый"))
    expect(onValueChange).toHaveBeenLastCalledWith(["a"])

    await user.click(box("Второй"))
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"])

    await user.click(box("Первый"))
    expect(onValueChange).toHaveBeenLastCalledWith(["b"])
  })

  it("drives the parent through unchecked → indeterminate → checked", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string[]>([])
      return (
        <CheckboxGroup
          items={ITEMS}
          value={value}
          onValueChange={setValue}
          selectAllLabel="Выбрать все"
        />
      )
    }
    render(<Controlled />)

    const all = box("Выбрать все")
    expect(all).not.toHaveAttribute("data-checked")
    expect(all).not.toHaveAttribute("data-indeterminate")

    await user.click(box("Первый"))
    expect(box("Выбрать все")).toHaveAttribute("data-indeterminate")

    await user.click(box("Второй"))
    expect(box("Выбрать все")).toHaveAttribute("data-checked")
    expect(box("Выбрать все")).not.toHaveAttribute("data-indeterminate")
  })

  it("select-all covers every enabled option and clears them again", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string[]>([])
      return (
        <CheckboxGroup
          items={ITEMS}
          value={value}
          onValueChange={setValue}
          selectAllLabel="Выбрать все"
        />
      )
    }
    render(<Controlled />)

    await user.click(box("Выбрать все"))
    expect(box("Первый")).toHaveAttribute("data-checked")
    expect(box("Второй")).toHaveAttribute("data-checked")
    // A disabled option is never flipped by the parent...
    expect(box("Третий")).not.toHaveAttribute("data-checked")
    // ...and does not stop the parent from reading as fully checked.
    expect(box("Выбрать все")).toHaveAttribute("data-checked")

    await user.click(box("Выбрать все"))
    expect(box("Первый")).not.toHaveAttribute("data-checked")
    expect(box("Второй")).not.toHaveAttribute("data-checked")
  })

  it("disables the whole group at once", () => {
    render(<CheckboxGroup items={ITEMS} disabled selectAllLabel="Выбрать все" />)
    for (const name of ["Выбрать все", "Первый", "Второй", "Третий"]) {
      expect(box(name)).toHaveAttribute("data-disabled")
    }
  })
})
