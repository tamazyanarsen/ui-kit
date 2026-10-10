import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DropdownSearch } from "./dropdown-search"

// Ревью 10.10, п. 21: крестик неуправляемого поиска писал пустое значение в
// узел мимо React — `onChange` не звался, и список оставался
// отфильтрованным.
describe("DropdownSearch: крестик зовёт onChange (ревью 10.10, п. 21)", () => {
  it("неуправляемый: фильтр по onChange сбрасывается", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [query, setQuery] = React.useState("")
      return (
        <>
          <DropdownSearch
            defaultValue=""
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => {}}
          />
          <output>{query || "пусто"}</output>
        </>
      )
    }
    render(<Harness />)
    await user.type(screen.getByRole("searchbox"), "мос")
    expect(screen.getByRole("status")).toHaveTextContent("мос")

    await user.click(screen.getByRole("button", { name: "Очистить поиск" }))
    expect(screen.getByRole("status")).toHaveTextContent("пусто")
    expect(screen.getByRole("searchbox")).toHaveValue("")
    expect(screen.getByRole("searchbox")).toHaveFocus()
  })

  it("управляемый: onChange с пустым полем и onClear", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    const seen: string[] = []
    function Harness() {
      const [query, setQuery] = React.useState("банк")
      return (
        <DropdownSearch
          value={query}
          onChange={(event) => {
            seen.push(event.target.value)
            setQuery(event.target.value)
          }}
          onClear={onClear}
        />
      )
    }
    render(<Harness />)
    await user.click(screen.getByRole("button", { name: "Очистить поиск" }))
    expect(seen).toEqual([""])
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("searchbox")).toHaveValue("")
  })
})
