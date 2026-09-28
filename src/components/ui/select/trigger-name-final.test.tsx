import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Combobox } from "@/components/ui/combobox/root"
import { ComboboxTrigger } from "@/components/ui/combobox/trigger"

import { Select, SelectValue } from "./root"
import { SelectTrigger } from "./trigger"

// Финальный аудит: подпись `label` у триггеров была голым `<span>` без
// связи с полем. Роль combobox имя из содержимого не берёт, и скринридер
// объявлял «поле со списком» без названия.

describe("SelectTrigger: доступное имя из label", () => {
  it.each(["sm", "lg"] as const)("размер %s — имя равно подписи", (size) => {
    render(
      <Select items={[{ value: "a", label: "Яблоко" }]}>
        <SelectTrigger size={size} label="Фрукт">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByRole("combobox", { name: "Фрукт" })).toBeInTheDocument()
  })

  it("aria-label потребителя главнее подписи", () => {
    render(
      <Select items={[{ value: "a", label: "Яблоко" }]}>
        <SelectTrigger label="Фрукт" aria-label="Любимый фрукт">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByRole("combobox", { name: "Любимый фрукт" })).toBeInTheDocument()
  })
})

describe("ComboboxTrigger: доступное имя из label", () => {
  it.each(["sm", "lg"] as const)("размер %s — имя равно подписи", (size) => {
    render(
      <Combobox items={[]}>
        <ComboboxTrigger size={size} label="Документы" placeholder>
          Выберите документы
        </ComboboxTrigger>
      </Combobox>
    )
    expect(screen.getByRole("combobox", { name: "Документы" })).toBeInTheDocument()
  })
})
