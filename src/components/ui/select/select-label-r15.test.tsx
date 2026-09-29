import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"
import { SelectContent } from "./content"
import { SelectItem } from "./item"
import { Combobox } from "@/components/ui/combobox/root"
import { ComboboxTrigger } from "@/components/ui/combobox/trigger"
import { Autocomplete } from "@/components/ui/autocomplete/root"
import { AutocompleteField } from "@/components/ui/autocomplete/field"

// Аудит 14: у подписей Select, Combobox и Autocomplete не было правой
// границы — абсолютная подпись росла под свой текст, `truncate` не об что
// было обрезать, и длинная подпись уходила под шеврон и за край поля (до
// 749px при поле 343). У Input граница есть.

const LONG = "Очень длинная подпись поля, которая никак не помещается в строку"
const classes = (el: Element) => el.className.split(/\s+/)

describe("Подпись Select/Combobox/Autocomplete ограничена справа", () => {
  it("Select L: плавающая подпись до шеврона, при значении — до крестика", () => {
    render(
      <Select items={[{ value: "a", label: "А" }]}>
        <SelectTrigger label={LONG}>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">А</SelectItem>
        </SelectContent>
      </Select>
    )
    const label = classes(screen.getByText(LONG))
    expect(label).toContain("right-10")
    expect(label).toContain("group-[&:not([data-placeholder])]/trigger:right-16")
  })

  it("Select S: статичная подпись до шеврона", () => {
    render(
      <Select items={[{ value: "a", label: "А" }]}>
        <SelectTrigger size="sm" label={LONG}>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">А</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(classes(screen.getByText(LONG))).toContain("right-10")
  })

  it("Combobox: та же граница", () => {
    render(
      <Combobox items={["a"]}>
        <ComboboxTrigger label={LONG}>Выбрано: 1</ComboboxTrigger>
      </Combobox>
    )
    expect(classes(screen.getByText(LONG))).toContain("right-10")
  })

  it("Autocomplete: до крестика, без значков — до края", () => {
    const { unmount } = render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField label={LONG} />
      </Autocomplete>
    )
    expect(classes(screen.getByText(LONG))).toContain("right-10")
    unmount()
    render(
      <Autocomplete<string> items={[]}>
        <AutocompleteField label={LONG} clearable={false} />
      </Autocomplete>
    )
    expect(classes(screen.getByText(LONG))).toContain("right-4")
  })
})
