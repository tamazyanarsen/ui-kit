import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"

// Аудит 7: подпись `Счёт {n}` — это два ребёнка, и каждый получал свой узел
// с многоточием: вместо пробела выходил зазор `gap-2`, а длинная подпись
// резалась двумя многоточиями.

describe("SelectItem: текст и число — один узел", () => {
  it("«Счёт {n}» рисуется одним узлом", async () => {
    const user = userEvent.setup()
    const n = 5
    render(
      <Select items={[{ value: "a", label: "Счёт 5" }]}>
        <SelectTrigger label="Счёт">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Счёт {n}</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: "Счёт 5" })
    const clipped = option.querySelectorAll("span.text-ellipsis")
    expect(clipped).toHaveLength(1)
    expect(clipped[0].textContent).toBe("Счёт 5")
  })

  it("значок между кусками текста остаётся на своём месте", async () => {
    const user = userEvent.setup()
    render(
      <Select items={[{ value: "a", label: "А Б" }]}>
        <SelectTrigger label="Счёт">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">
            А<svg data-testid="icon" />Б
          </SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox"))
    await screen.findByRole("option")
    const icon = screen.getByTestId("icon")
    expect(icon.previousElementSibling?.textContent).toBe("А")
    expect(icon.nextElementSibling?.textContent).toBe("Б")
  })
})
