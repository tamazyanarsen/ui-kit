import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  sortableRowClass,
  useSortable,
  type SortableEntry,
} from "./index"

// Покрытие правки «locked нельзя сдвинуть перетаскиванием»: раньше бросок
// проверял только `to !== from`, и строка, перенесённая ЧЕРЕЗ закреплённую,
// выдавливала её с места, а линия вставки рисовалась над запрещённым местом.

// jsdom не считает раскладку — строкам подставляются прямоугольники по 56px,
// как в `sortable.test.tsx`.
const ROW_HEIGHT = 56

function withGeometry(items: SortableEntry[]) {
  const original = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function rect(this: Element) {
    const id = this.getAttribute("data-row-id")
    const index = id ? items.findIndex((item) => item.id === id) : 0
    const height = id ? ROW_HEIGHT : items.length * ROW_HEIGHT
    const top = index * ROW_HEIGHT
    return {
      top,
      bottom: top + height,
      height,
      left: 0,
      right: 400,
      width: 400,
      x: 0,
      y: top,
      toJSON: () => ({}),
    } as DOMRect
  }
  return () => {
    Element.prototype.getBoundingClientRect = original
  }
}

function List({
  items,
  onReorder,
}: {
  items: SortableEntry[]
  onReorder: (from: number, to: number) => void
}) {
  const sortable = useSortable({ items, onReorder })
  return (
    <SortableList data-testid="list" {...sortable.listProps}>
      {items.map((item) => (
        <div
          key={item.id}
          data-row-id={item.id}
          data-testid={`row-${item.id}`}
          className={sortableRowClass()}
          {...sortable.itemProps(item.id)}
        >
          {item.id}
          <SortableHandle label={`Переместить ${item.id}`} {...sortable.handleProps(item.id)} />
        </div>
      ))}
      <SortableDropIndicator indicator={sortable.indicator} />
    </SortableList>
  )
}

// `b` закреплена и стоит между `a` и остальными.
const WITH_LOCKED: SortableEntry[] = [
  { id: "a" },
  { id: "b", locked: true },
  { id: "c" },
  { id: "d" },
]

// ⚠️ Координату несёт только `MouseEvent`: `fireEvent.dragOver` её теряет
// (см. комментарий в `sortable.test.tsx`).
function fireAt(type: "dragover" | "drop", clientY: number) {
  fireEvent(
    screen.getByTestId("list"),
    new MouseEvent(type, { bubbles: true, cancelable: true, clientY })
  )
}

function startDrag(id: string) {
  fireEvent.pointerDown(screen.getByRole("button", { name: `Переместить ${id}` }))
  fireEvent.dragStart(screen.getByTestId(`row-${id}`))
}

const indicator = (container: HTMLElement) =>
  container.querySelector('[data-slot="sortable-drop-indicator"]')

describe("useSortable: перенос через закреплённую строку", () => {
  it("бросок за закреплённую строку не зовёт onReorder и не рисует линию", () => {
    const restore = withGeometry(WITH_LOCKED)
    const onReorder = vi.fn()
    const { container } = render(<List items={WITH_LOCKED} onReorder={onReorder} />)

    startDrag("a")
    // Нижняя половина `c`: перенос `a` на индекс 2 сдвинул бы `b` на 0.
    fireAt("dragover", 2 * ROW_HEIGHT + 50)
    expect(indicator(container)).toBeNull()
    fireAt("drop", 2 * ROW_HEIGHT + 50)

    expect(onReorder).not.toHaveBeenCalled()
    restore()
  })

  it("перенос ниже закреплённой строки по-прежнему работает", () => {
    const restore = withGeometry(WITH_LOCKED)
    const onReorder = vi.fn()
    const { container } = render(<List items={WITH_LOCKED} onReorder={onReorder} />)

    startDrag("c")
    // Нижняя половина `d`: `c` уходит в конец, `b` остаётся на месте.
    fireAt("dragover", 3 * ROW_HEIGHT + 50)
    expect(indicator(container)).not.toBeNull()
    fireAt("drop", 3 * ROW_HEIGHT + 50)

    expect(onReorder).toHaveBeenCalledWith(2, 3)
    restore()
  })
})
