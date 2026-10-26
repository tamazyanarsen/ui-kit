import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import { AutocompleteContent, AutocompleteList, AutocompleteCollection } from "./content"
import { AutocompleteItem } from "./item"

// Правки UI-Kit от 25.10: строка результата — общая строка списка menu-row,
// содержимое в одной обёртке сжимается к центру строки.

describe("AutocompleteItem: строка списка", () => {
  it("menu-row, одна обёртка с полями, без опоры слева", async () => {
    render(
      <Autocomplete<string> items={["Договор"]}>
        <AutocompleteField label="Поле" />
        <AutocompleteContent>
          <AutocompleteList>
            <AutocompleteCollection>
              {(item: string) => (
                <AutocompleteItem key={item} value={item} subtitle="ИНН 7700">
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteCollection>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    )
    await userEvent.type(screen.getByRole("combobox"), "Д")
    const option = await screen.findByRole("option")
    expect(option).toHaveClass("menu-row", "press-scale-content")
    expect(option.className).not.toContain("--press-origin")
    expect(option.className).not.toContain("cursor-default")
    expect(option.className).not.toContain("pointer-events-none")
    expect(option).not.toHaveClass("p-4")
    expect(option.children).toHaveLength(1)
    expect(option.firstElementChild).toHaveClass("p-4")
  })
})
