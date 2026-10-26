import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"
import { ComboboxContent, ComboboxList, ComboboxCollection } from "./content"
import { ComboboxGroupRow, ComboboxItem } from "./item"

// Правки UI-Kit от 25.10: строки списка Combobox — общая строка menu-row,
// сжатие к центру одной обёрткой, выключенная не гасит указатель
// (курсор not-allowed).

function expectListRow(row: HTMLElement) {
  expect(row).toHaveClass("menu-row", "press-scale-content")
  expect(row.className).not.toContain("--press-origin")
  expect(row.className).not.toContain("cursor-default")
  expect(row.className).not.toContain("pointer-events-none")
  expect(row.children).toHaveLength(1)
}

describe("Combobox: строки списка", () => {
  it("ComboboxItem", async () => {
    const user = userEvent.setup()
    render(
      <Combobox items={["Паспорт РФ"]}>
        <ComboboxTrigger>Документ</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxCollection>
              {(item: string) => (
                <ComboboxItem key={item} value={item} disabled>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
    await user.click(screen.getByRole("combobox"))
    expectListRow(await screen.findByRole("option"))
  })

  it("ComboboxGroupRow", () => {
    const { container } = render(
      <ComboboxGroupRow label="Группа" state="unchecked" onToggle={() => {}} disabled />
    )
    const row = container.querySelector('[data-slot="combobox-group-row"]') as HTMLElement
    expectListRow(row)
  })
})
