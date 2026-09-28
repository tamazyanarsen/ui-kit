import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"

// Аудит 12: крестик ComboboxTrigger без `onClear` был виден, но ничего не
// делал. Значение этого поля — сводка потребителя, сбросить её сама кнопка
// не может, поэтому без обработчика кнопки нет.

describe("ComboboxTrigger: «Очистить» только вместе с onClear", () => {
  it("без onClear кнопки нет", () => {
    render(
      <Combobox items={["a"]}>
        <ComboboxTrigger>Выбрано документов: 1</ComboboxTrigger>
      </Combobox>
    )
    expect(screen.queryByRole("button", { name: "Очистить" })).toBeNull()
  })

  it("с onClear кнопка на месте", () => {
    render(
      <Combobox items={["a"]}>
        <ComboboxTrigger onClear={() => {}}>Выбрано документов: 1</ComboboxTrigger>
      </Combobox>
    )
    expect(screen.getByRole("button", { name: "Очистить" })).toBeInTheDocument()
  })
})
