import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import { AutocompleteContent, AutocompleteList, AutocompleteCollection } from "./content"
import { AutocompleteItem } from "./item"

// Аудит r25: `subtitle={0}` (`subtitle && …`) выводил голый «0» в колонку
// пункта — без серой строки подзаголовка.

describe("AutocompleteItem: подзаголовок 0", () => {
  it("рисуется второй строкой пункта", async () => {
    render(
      <Autocomplete<string> items={["Договор"]}>
        <AutocompleteField label="Поле" />
        <AutocompleteContent>
          <AutocompleteList>
            <AutocompleteCollection>
              {(item: string) => (
                <AutocompleteItem key={item} value={item} subtitle={0}>
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
    const rows = option.querySelectorAll(":scope > span")
    expect(rows).toHaveLength(2)
    expect(rows[1]).toHaveTextContent("0")
  })
})
