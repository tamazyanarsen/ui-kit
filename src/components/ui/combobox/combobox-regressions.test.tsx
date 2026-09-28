import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Autocomplete } from "@/components/ui/autocomplete/root"
import { AutocompleteField } from "@/components/ui/autocomplete/field"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"

describe("ComboboxTrigger regressions", () => {
  it("disables the clear button of a disabled trigger", () => {
    const onClear = vi.fn()
    render(
      <Combobox items={[]}>
        <ComboboxTrigger disabled onClear={onClear}>
          Выбрано: 2
        </ComboboxTrigger>
      </Combobox>
    )
    expect(screen.getByRole("button", { name: "Очистить", hidden: true })).toBeDisabled()
  })

  it("forwards ref and keeps the comment when error is true", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Combobox items={[]}>
        <ComboboxTrigger ref={ref} comment="Подсказка" error>
          Выбрано: 2
        </ComboboxTrigger>
      </Combobox>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(screen.getByText("Подсказка")).toBeInTheDocument()
  })
})

describe("AutocompleteField regressions", () => {
  it("turns label into the accessible name and placeholder at size sm", () => {
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField size="sm" label="Город" />
      </Autocomplete>
    )
    const field = screen.getByLabelText("Город")
    expect(field).toHaveAttribute("placeholder", "Город")
  })
})
