import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import { AutocompleteContent, AutocompleteList, AutocompleteCollection } from "./content"
import { AutocompleteItem } from "./item"

// Аудит 18: неразрывное слово в подписи под полем выходило за его край, а в
// пункте списка давало прокрутку вбок: ширина списка по содержимому, и
// `break-words` min-content не уменьшает — нужен `anywhere`.

const LONG = "Договор_поставки_оборудования_000123456789"

describe("Autocomplete: длинные тексты", () => {
  it("подпись под полем — break-words", () => {
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField label="Поле" error="Ошибка: Договор_000123456789" />
      </Autocomplete>
    )
    expect(screen.getByText("Ошибка: Договор_000123456789")).toHaveClass("break-words")
  })

  it("заголовок и подзаголовок пункта — overflow-wrap:anywhere", async () => {
    render(
      <Autocomplete<string> items={[LONG]}>
        <AutocompleteField label="Поле" />
        <AutocompleteContent>
          <AutocompleteList>
            <AutocompleteCollection>
              {(item: string) => (
                <AutocompleteItem key={item} value={item} subtitle={`ИНН_${item}`}>
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
    const spans = option.querySelectorAll(":scope > span")
    expect(spans).toHaveLength(2)
    for (const span of spans) expect(span).toHaveClass("[overflow-wrap:anywhere]")
  })
})
