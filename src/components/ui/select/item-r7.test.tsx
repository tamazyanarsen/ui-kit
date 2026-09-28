import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

// Аудит 6: текст пункта был `shrink-0` — длинная подпись шла под галочку и
// срезалась краем списка без многоточия. Раскладку jsdom не считает,
// поэтому проверяется то, что её задаёт: текст может сжиматься и обрезается
// многоточием в своём узле.

const LONG = "Расчётный счёт в рублях № 40702810000000001234"

describe("SelectItem: длинная подпись обрезается многоточием", () => {
  it("текст пункта сжимается и получает многоточие", async () => {
    const user = userEvent.setup()
    render(
      <Select items={[{ value: "a", label: LONG }]}>
        <SelectTrigger label="Счёт">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">{LONG}</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: LONG })
    const text = [...option.querySelectorAll("span")].find(
      (node) => node.textContent === LONG && node.children.length === 0
    )
    expect(text).toBeDefined()
    expect(text).toHaveClass("min-w-0", "text-ellipsis", "overflow-clip")
    expect(text!.parentElement).toHaveClass("min-w-0")
    expect(text!.parentElement).not.toHaveClass("shrink-0")
  })
})
