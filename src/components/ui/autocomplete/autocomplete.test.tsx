import { useMemo, useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import { AutocompleteContent, AutocompleteList, AutocompleteCollection } from "./content"
import { AutocompleteItem } from "./item"

const FRUITS = ["Apple", "Banana", "Cherry"]

function Harness({ onValueChange }: { onValueChange?: (value: string | null) => void }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return FRUITS.filter((f) => f.toLowerCase().includes(query.trim().toLowerCase()))
  }, [query])

  return (
    <Autocomplete<string>
      inputValue={query}
      onInputValueChange={setQuery}
      items={results}
      value={selected}
      onValueChange={(value) => {
        setSelected(value)
        onValueChange?.(value)
      }}
    >
      <AutocompleteField label="Фрукт" />
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteCollection>
            {(fruit: string) => <AutocompleteItem key={fruit} value={fruit}>{fruit}</AutocompleteItem>}
          </AutocompleteCollection>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}

describe("Autocomplete", () => {
  it("renders the field with its label", () => {
    render(<Harness />)
    expect(screen.getByLabelText("Фрукт")).toBeInTheDocument()
  })

  it("shows only items matching the typed query", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.type(screen.getByLabelText("Фрукт"), "an")

    await waitFor(() => {
      expect(screen.getByText("Banana")).toBeInTheDocument()
    })
    expect(screen.queryByText("Apple")).not.toBeInTheDocument()
    expect(screen.queryByText("Cherry")).not.toBeInTheDocument()
  })

  it("calls onValueChange when a result is picked", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Harness onValueChange={onValueChange} />)

    await user.type(screen.getByLabelText("Фрукт"), "Cherry")
    const option = await screen.findByText("Cherry")
    await user.click(option)

    expect(onValueChange).toHaveBeenCalledWith("Cherry")
  })

  it("clears the field once a value is selected and Clear is clicked", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Harness onValueChange={onValueChange} />)

    const field = screen.getByLabelText("Фрукт")
    await user.type(field, "Apple")
    await user.click(await screen.findByText("Apple"))

    // Clear only renders once something is actually selected (Base UI's
    // single-selection Combobox.Clear is keyed off the committed value, not
    // the raw input text).
    await user.click(screen.getByRole("button", { name: "Очистить поле" }))

    expect(onValueChange).toHaveBeenLastCalledWith(null)
    expect(field).toHaveValue("")
  })
})
