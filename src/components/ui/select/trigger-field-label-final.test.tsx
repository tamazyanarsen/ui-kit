import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Field } from "@base-ui/react/field"

import { Combobox } from "@/components/ui/combobox/root"
import { ComboboxTrigger } from "@/components/ui/combobox/trigger"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"

// Круг проверки после финальных исправлений: триггер передавал
// `aria-labelledby={undefined}`, когда своей подписи нет, и mergeProps Base
// UI затирал им связь с внешним Field.Label — поле теряло имя.

const nameOf = (element: HTMLElement) => {
  const ids = element.getAttribute("aria-labelledby")?.split(" ") ?? []
  return ids.map((id) => document.getElementById(id)?.textContent ?? "").join(" ")
}

describe("триггеры внутри Field.Root без своей подписи", () => {
  it("SelectTrigger берёт имя из Field.Label", () => {
    render(
      <Field.Root>
        <Field.Label>Город</Field.Label>
        <Select items={[{ value: "a", label: "Москва" }]}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      </Field.Root>
    )
    expect(nameOf(screen.getByRole("combobox"))).toBe("Город")
  })

  it("ComboboxTrigger берёт имя из Field.Label", () => {
    render(
      <Field.Root>
        <Field.Label>Город</Field.Label>
        <Combobox items={["Москва"]}>
          <ComboboxTrigger>Москва</ComboboxTrigger>
        </Combobox>
      </Field.Root>
    )
    expect(nameOf(screen.getByRole("combobox"))).toBe("Город")
  })
})
