import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { SortableHandle, SortableList, useSortable, type SortableEntry } from "./index"

// Раунд 26: бросок, после которого строка пересоздаётся (её перенесли внутрь
// группы), не присылает `dragend` в React — узла уже нет. Флаг «перенос
// идёт» оставался взведённым навсегда, и после этого отпущенная за ручкой
// кнопка больше не снимала взвод: строка оставалась `draggable`.

const ITEMS: SortableEntry[] = [{ id: "a" }, { id: "b" }]

function List() {
  const sortable = useSortable({ items: ITEMS, onReorder: vi.fn() })
  return (
    <SortableList {...sortable.listProps}>
      {ITEMS.map((item) => (
        <div key={item.id} data-testid={`row-${item.id}`} {...sortable.itemProps(item.id)}>
          {item.id}
          <SortableHandle label={`Переместить ${item.id}`} {...sortable.handleProps(item.id)} />
        </div>
      ))}
    </SortableList>
  )
}

describe("useSortable: взвод после броска без dragend", () => {
  it("после дропа отпускание за ручкой снова снимает взвод", () => {
    render(<List />)
    const row = screen.getByTestId("row-a")
    const handle = screen.getByRole("button", { name: "Переместить a" })

    fireEvent.pointerDown(handle)
    fireEvent.dragStart(row)
    fireEvent.dragOver(screen.getByTestId("row-b"), { clientY: 5 })
    // Бросок: `dragend` не приходит.
    fireEvent.drop(screen.getByTestId("row-b"))

    fireEvent.pointerDown(handle)
    expect(row).toHaveAttribute("draggable", "true")
    fireEvent.pointerUp(document.body)
    expect(row).not.toHaveAttribute("draggable", "true")
  })
})
