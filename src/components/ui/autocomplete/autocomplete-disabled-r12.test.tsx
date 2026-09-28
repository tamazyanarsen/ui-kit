import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"

// Аудит 11: вид выключенного поля (коробка, текст, подпись) идёт по
// `aria-disabled`, а Base UI на `<Autocomplete disabled>` ставил полю только
// нативный `disabled` — поле не редактировалось, но выглядело рабочим.

describe("Autocomplete: выключенное поле выглядит выключенным", () => {
  it("поле получает aria-disabled от корня", () => {
    render(
      <Autocomplete<string> items={[]} disabled defaultInputValue="abc">
        <AutocompleteField label="Город" />
      </Autocomplete>
    )
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true")
  })

  it("включённое поле aria-disabled не получает", () => {
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField label="Город" />
      </Autocomplete>
    )
    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-disabled")
  })
})
