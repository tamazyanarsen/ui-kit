import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"
import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxList,
  ComboboxSearchInput,
} from "./content"
import { ComboboxItem } from "./item"

// Финальный аудит: крестик в строке поиска был `Combobox.Clear` Base UI.
// В множественном выборе он виден только при непустом выборе и стирает
// разом и строку поиска, и все отмеченные пункты.

const ITEMS = ["Альфа", "Бета", "Гамма"]

function Harness({ onValue }: { onValue: (value: string[]) => void }) {
  const [value, setValue] = React.useState<string[]>([])
  return (
    <Combobox
      items={ITEMS}
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValue(next)
      }}
    >
      <ComboboxTrigger>Выбор</ComboboxTrigger>
      <ComboboxContent>
        <ComboboxSearchInput placeholder="Поиск" />
        <ComboboxList>
          <ComboboxCollection>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

describe("ComboboxSearchInput: крестик очистки поиска", () => {
  it("появляется, как только в поиске есть текст, даже без выбора", async () => {
    const user = userEvent.setup()
    render(<Harness onValue={() => {}} />)
    await user.click(screen.getByRole("combobox"))
    const search = await screen.findByPlaceholderText("Поиск")

    expect(screen.queryByRole("button", { name: "Очистить поиск" })).toBeNull()
    await user.type(search, "а")
    expect(screen.getByRole("button", { name: "Очистить поиск" })).toBeInTheDocument()
  })

  it("стирает только текст поиска, отмеченные пункты остаются", async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} />)
    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Альфа" }))
    expect(onValue).toHaveBeenLastCalledWith(["Альфа"])

    const search = screen.getByPlaceholderText("Поиск")
    await user.type(search, "Бе")
    await user.click(screen.getByRole("button", { name: "Очистить поиск" }))

    expect(search).toHaveValue("")
    expect(onValue).toHaveBeenLastCalledWith(["Альфа"])
    expect(screen.queryByRole("button", { name: "Очистить поиск" })).toBeNull()
  })
})
