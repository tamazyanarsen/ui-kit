import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { ComboboxTrigger } from "@/components/ui/combobox"

import { Select, SelectTrigger, SelectValue } from "./index"

// Аудит 16, формы: значение Select и сводка ComboboxTrigger лежали голым
// текстом во флекс-контейнере — анонимный блок, `text-overflow` до него не
// доходит, и длинное значение срезалось посреди буквы без многоточия.

const LONG = "Расчётный счёт в рублях № 40702810000000001234 основной"
const items = [
  { value: "a", label: LONG },
  { value: "b", label: "Второй счёт" },
]

const clipNode = (text: string) =>
  screen.getByText(text, { selector: '[data-slot="clip-text"]' })

describe("Значение Select и ComboboxTrigger обрезается многоточием", () => {
  it("одно значение — в своём узле с многоточием", () => {
    render(
      <Select items={items} defaultValue="a">
        <SelectTrigger label="Счёт">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    const node = clipNode(LONG)
    expect(node).toHaveClass("min-w-0", "text-ellipsis", "whitespace-nowrap")
    expect(node.closest('[data-slot="select-value"]')).not.toBeNull()
  })

  it("несколько значений — одним узлом через запятую", () => {
    render(
      <Select items={items} multiple defaultValue={["a", "b"]}>
        <SelectTrigger label="Счета">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    expect(clipNode(`${LONG}, Второй счёт`)).toHaveClass("text-ellipsis")
  })

  it("разметка из children-функции проходит как есть", () => {
    render(
      <Select items={items} defaultValue="b">
        <SelectTrigger label="Счёт">
          <SelectValue>{() => <b data-testid="own">своя</b>}</SelectValue>
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByTestId("own").parentElement).toHaveAttribute(
      "data-slot",
      "select-value"
    )
  })

  it("сводка ComboboxTrigger — в своём узле с многоточием", () => {
    render(
      <ComboboxPrimitive.Root items={[]}>
        <ComboboxTrigger label="Организации">Выбрано: ООО «Ромашка», ООО «Василёк»</ComboboxTrigger>
      </ComboboxPrimitive.Root>
    )
    expect(clipNode("Выбрано: ООО «Ромашка», ООО «Василёк»")).toHaveClass("text-ellipsis")
  })
})
