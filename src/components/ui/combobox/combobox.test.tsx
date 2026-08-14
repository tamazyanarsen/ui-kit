import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"
import { ComboboxContent, ComboboxList, ComboboxCollection } from "./content"
import { ComboboxItem } from "./item"
import { ComboboxFooter } from "./footer"
import { useComboboxSelection } from "./use-combobox-selection"

interface Doc {
  value: string
  label: string
}

const DOCS: Doc[] = [
  { value: "doc-1", label: "Паспорт РФ" },
  { value: "doc-2", label: "СНИЛС" },
  { value: "doc-3", label: "ИНН" },
]

function Harness() {
  const sel = useComboboxSelection<Doc>([])

  return (
    <Combobox
      open={sel.open}
      onOpenChange={sel.setOpen}
      value={sel.draft}
      onValueChange={sel.setDraft}
      items={DOCS}
      itemToStringLabel={(d: Doc) => d.label}
    >
      <ComboboxTrigger
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0
          ? `Выбрано документов: ${sel.committed.length}`
          : "Выберите документы"}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(doc: Doc) => (
              <ComboboxItem key={doc.value} value={doc}>
                {doc.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
        <ComboboxFooter
          applyLabel={`Выбрать: ${sel.draft.length}`}
          onReset={sel.reset}
          onApply={sel.apply}
        />
      </ComboboxContent>
    </Combobox>
  )
}

function openTrigger(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByText("Выберите документы"))
}

describe("Combobox", () => {
  it("renders the trigger's placeholder text", () => {
    render(<Harness />)
    expect(screen.getByText("Выберите документы")).toBeInTheDocument()
  })

  it("opens the list of options on click", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    expect(screen.queryByText("Паспорт РФ")).not.toBeInTheDocument()

    await openTrigger(user)

    expect(await screen.findByText("Паспорт РФ")).toBeInTheDocument()
  })

  it("only commits the selection to the trigger once Применить is clicked", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await openTrigger(user)
    await user.click(await screen.findByText("СНИЛС"))

    // Still just a draft — the trigger hasn't picked up the selection yet.
    expect(screen.getByText("Выберите документы")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Выбрать: 1" }))

    expect(screen.getByText("Выбрано документов: 1")).toBeInTheDocument()
  })

  it("discards the draft when Сбросить is clicked", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await openTrigger(user)
    await user.click(await screen.findByText("ИНН"))
    expect(screen.getByRole("button", { name: "Выбрать: 1" })).toBeEnabled()

    await user.click(screen.getByRole("button", { name: "Сбросить" }))

    // Счётчик обнулился — черновик действительно сброшен.
    const apply = screen.getByRole("button", { name: "Выбрать: 0" })
    expect(apply).toBeInTheDocument()
    // Дизайн-чек №22: обе кнопки подвала остаются активными и на пустом
    // выборе. Раньше здесь проверялось обратное (`toBeDisabled`) — это и
    // было зафиксированное неверное поведение.
    expect(apply).toBeEnabled()
    expect(screen.getByRole("button", { name: "Сбросить" })).toBeEnabled()
  })

  it("clears a committed selection from the trigger's clear button", async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await openTrigger(user)
    await user.click(await screen.findByText("ИНН"))
    await user.click(screen.getByRole("button", { name: "Выбрать: 1" }))
    expect(screen.getByText("Выбрано документов: 1")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Очистить" }))

    expect(screen.getByText("Выберите документы")).toBeInTheDocument()
  })
})
