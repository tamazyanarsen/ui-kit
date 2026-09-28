import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { SortableHandle, SortableList, useSortable, type SortableEntry } from "./index"

// Аудит r7: взвод «строка перетаскивается» снимал только `pointerup` на
// самой ручке. Отпущенная за ручкой кнопка или `pointercancel` (палец начал
// прокрутку) оставляли строку `draggable`, и следующий `dragstart` с её
// текста переносил строку — вопреки правилу макета «захват по иконке».

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

const handle = () => screen.getByRole("button", { name: "Переместить a" })
const row = () => screen.getByTestId("row-a")

describe("useSortable: взвод держится только пока нажата ручка", () => {
  it("отпускание кнопки за ручкой снимает взвод", () => {
    render(<List />)
    fireEvent.pointerDown(handle())
    expect(row()).toHaveAttribute("draggable", "true")
    fireEvent.pointerUp(document.body)
    expect(row()).not.toHaveAttribute("draggable", "true")
  })

  it("pointercancel (прокрутка пальцем) снимает взвод", () => {
    render(<List />)
    fireEvent.pointerDown(handle())
    fireEvent.pointerCancel(handle())
    expect(row()).not.toHaveAttribute("draggable", "true")
  })

  it("pointercancel от старта перетаскивания перенос не обрывает", () => {
    render(<List />)
    fireEvent.pointerDown(handle())
    fireEvent.dragStart(row())
    // Браузер шлёт `pointercancel`, когда нативный перенос уже начался.
    fireEvent.pointerCancel(handle())
    expect(row()).toHaveAttribute("draggable", "true")
    expect(row()).toHaveAttribute("data-dragging", "true")
    fireEvent.dragEnd(row())
    expect(row()).not.toHaveAttribute("draggable", "true")
  })
})
