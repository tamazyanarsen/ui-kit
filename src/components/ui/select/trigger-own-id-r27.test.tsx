import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index"
import { Combobox, ComboboxContent, ComboboxItem, ComboboxList, ComboboxTrigger } from "../combobox"
import { Autocomplete, AutocompleteContent, AutocompleteField, AutocompleteItem, AutocompleteList } from "../autocomplete"
import { Tooltip } from "../tooltip"

// Круг 27: у триггеров с собственным `id` (потребитель дал id) id остаётся на
// элементе, попап открывается, подпись и комментарий связаны по `<id>-label`
// и `<id>-caption`. Форма ловушки r26: Tooltip вокруг триггера с id.

describe("Триггеры с собственным id", () => {
  it("SelectTrigger: id на месте, список открывается, aria связаны", async () => {
    render(
      <Select defaultValue="a">
        <SelectTrigger id="my-sel" label="Метка" comment="Пояснение"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="a">А</SelectItem><SelectItem value="b">Б</SelectItem></SelectContent>
      </Select>
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger.id).toBe("my-sel")
    expect(trigger.getAttribute("aria-labelledby")).toBe("my-sel-label")
    expect(trigger.getAttribute("aria-describedby")).toBe("my-sel-caption")
    expect(document.getElementById("my-sel-label")?.textContent).toBe("Метка")
    await userEvent.setup().click(trigger)
    expect(await screen.findAllByRole("option")).toHaveLength(2)
  })

  it("ComboboxTrigger: id на месте, список открывается", async () => {
    render(
      <Combobox items={["x", "y"]}>
        <ComboboxTrigger id="my-cb" label="Метка" comment="Пояснение">v</ComboboxTrigger>
        <ComboboxContent><ComboboxList>{(d: string) => <ComboboxItem key={d} value={d}>{d}</ComboboxItem>}</ComboboxList></ComboboxContent>
      </Combobox>
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger.id).toBe("my-cb")
    expect(trigger.getAttribute("aria-describedby")).toBe("my-cb-caption")
    await userEvent.setup().click(trigger)
    expect(await screen.findAllByRole("option")).toHaveLength(2)
  })

  it("AutocompleteField: id на месте, список открывается по набору", async () => {
    render(
      <Autocomplete items={["Москва", "Минск"]}>
        <AutocompleteField id="my-ac" label="Город" comment="Пояснение" />
        <AutocompleteContent><AutocompleteList>{(c: string) => <AutocompleteItem key={c} value={c}>{c}</AutocompleteItem>}</AutocompleteList></AutocompleteContent>
      </Autocomplete>
    )
    const field = screen.getByRole("combobox")
    expect(field.id).toBe("my-ac")
    expect(field.getAttribute("aria-describedby")).toBe("my-ac-caption")
    await userEvent.setup().type(field, "М")
    expect(await screen.findAllByRole("option")).toHaveLength(2)
  })

  it("Tooltip вокруг SelectTrigger с id: список по-прежнему открывается", async () => {
    render(
      <Select defaultValue="a">
        <Tooltip content="подсказка"><SelectTrigger id="tt-sel" label="Метка"><SelectValue /></SelectTrigger></Tooltip>
        <SelectContent><SelectItem value="a">А</SelectItem><SelectItem value="b">Б</SelectItem></SelectContent>
      </Select>
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger.id).toBe("tt-sel")
    await userEvent.setup().click(trigger)
    expect(await screen.findAllByRole("option")).toHaveLength(2)
  })
})
