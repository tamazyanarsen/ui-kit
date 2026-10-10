import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  useSortable,
  type SortableDropMeta,
  type SortableEntry,
} from "./index"

const ROW_HEIGHT = 56

function withGeometry(items: SortableEntry[]) {
  const original = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function rect(this: Element) {
    const id = this.getAttribute("data-row-id")
    const index = id ? items.findIndex((item) => item.id === id) : -1
    const top = index >= 0 ? index * ROW_HEIGHT : 0
    const height = index >= 0 ? ROW_HEIGHT : items.length * ROW_HEIGHT
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
  onReorder: (from: number, to: number, meta: SortableDropMeta) => void
}) {
  const sortable = useSortable({ items, onReorder })
  return (
    <SortableList data-testid="list" {...sortable.listProps}>
      {items.map((item) => (
        <div
          key={item.id}
          data-row-id={item.id}
          data-testid={`row-${item.id}`}
          {...sortable.itemProps(item.id)}
        >
          <span data-testid={`text-${item.id}`}>{item.id}</span>
          <SortableHandle label={`Переместить ${item.id}`} {...sortable.handleProps(item.id)} />
        </div>
      ))}
      <SortableDropIndicator indicator={sortable.indicator} />
    </SortableList>
  )
}

function dragOverAt(clientY: number) {
  fireEvent(
    screen.getByTestId("list"),
    new MouseEvent("dragover", { bubbles: true, cancelable: true, clientY })
  )
}

function dropAt(clientY: number) {
  fireEvent(
    screen.getByTestId("list"),
    new MouseEvent("drop", { bubbles: true, cancelable: true, clientY })
  )
}

const FLAT: SortableEntry[] = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }]

// Ревью 10.10, п. 4: `dragstart` от потомка невзведённой строки (протянутое
// выделение текста, ссылка, картинка) запускал перенос строки.
describe("useSortable: перенос только со взведённой ручки (ревью 10.10, п. 4)", () => {
  it("протянутое выделение текста не переставляет строку", () => {
    const restore = withGeometry(FLAT)
    const onReorder = vi.fn()
    const { container } = render(<List items={FLAT} onReorder={onReorder} />)

    // Ручку не нажимали — dragstart всплывает от текста строки.
    fireEvent.dragStart(screen.getByTestId("text-a"))
    expect(screen.getByTestId("row-a")).not.toHaveAttribute("data-dragging")

    dragOverAt(3 * ROW_HEIGHT + 40)
    expect(container.querySelector('[data-slot="sortable-drop-indicator"]')).toBeNull()
    dropAt(3 * ROW_HEIGHT + 40)
    expect(onReorder).not.toHaveBeenCalled()
    restore()
  })

  it("со взведённой ручкой перенос работает как раньше", () => {
    const restore = withGeometry(FLAT)
    const onReorder = vi.fn()
    render(<List items={FLAT} onReorder={onReorder} />)

    fireEvent.pointerDown(screen.getByRole("button", { name: "Переместить a" }))
    fireEvent.dragStart(screen.getByTestId("row-a"))
    dragOverAt(3 * ROW_HEIGHT + 40)
    dropAt(3 * ROW_HEIGHT + 40)
    expect(onReorder).toHaveBeenCalledWith(0, 3, { depth: 0 })
    restore()
  })
})

// Ревью 10.10, п. 15: без `onDropInto` и `onExpandGroup` свёрнутая группа
// подсвечивалась как цель «внутрь», а бросок молча ничего не делал.
describe("useSortable: свёрнутая группа без обработчиков (ревью 10.10, п. 15)", () => {
  it("заголовок — обычная строка с линией вставки", () => {
    const items: SortableEntry[] = [{ id: "a" }, { id: "group", group: true, expanded: false }]
    const restore = withGeometry(items)
    const onReorder = vi.fn()
    const { container } = render(<List items={items} onReorder={onReorder} />)

    fireEvent.pointerDown(screen.getByRole("button", { name: "Переместить a" }))
    fireEvent.dragStart(screen.getByTestId("row-a"))
    dragOverAt(ROW_HEIGHT + 40)

    expect(screen.getByTestId("row-group")).not.toHaveAttribute("data-drop-into")
    expect(container.querySelector('[data-slot="sortable-drop-indicator"]')).not.toBeNull()
    dropAt(ROW_HEIGHT + 40)
    expect(onReorder).toHaveBeenCalledWith(0, 1, { depth: 0 })
    restore()
  })
})

// Ревью 10.10, п. 16: стрелка отдавала глубину самой строки, а бросок мышью
// в ту же точку — глубину места. Строка верхнего уровня, поднятая стрелкой
// на место последней строки раскрытой группы, оставалась «на уровне 0».
describe("useSortable: глубина переноса стрелкой (ревью 10.10, п. 16)", () => {
  const GROUPED: SortableEntry[] = [
    { id: "group", group: true, expanded: true },
    { id: "g1", depth: 1 },
    { id: "g2", depth: 1 },
    { id: "top" },
  ]

  it("стрелка вверх под группой ставит строку в группу, как бросок мышью", () => {
    const restore = withGeometry(GROUPED)
    const keyboard = vi.fn()
    const { unmount } = render(<List items={GROUPED} onReorder={keyboard} />)
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить top" }), { key: "ArrowUp" })
    unmount()

    const mouse = vi.fn()
    render(<List items={GROUPED} onReorder={mouse} />)
    fireEvent.pointerDown(screen.getByRole("button", { name: "Переместить top" }))
    fireEvent.dragStart(screen.getByTestId("row-top"))
    // Верхняя половина последней строки группы — то же место, что у стрелки.
    dragOverAt(2 * ROW_HEIGHT + 10)
    dropAt(2 * ROW_HEIGHT + 10)

    expect(mouse).toHaveBeenCalledWith(3, 2, { depth: 1 })
    expect(keyboard).toHaveBeenCalledWith(3, 2, { depth: 1 })
    restore()
  })

  it("в полной группе стрелка встаёт на место последней строки, как мышь", () => {
    const full: SortableEntry[] = [
      { id: "group", group: true, expanded: true, limit: 2 },
      { id: "g1", depth: 1 },
      { id: "g2", depth: 1 },
      { id: "top" },
    ]
    const onReorder = vi.fn()
    render(<List items={full} onReorder={onReorder} />)
    // Место ВМЕСТО последней строки законно (замечание 7 дизайн-чека 08.10):
    // строка входит в группу, вытеснение решает потребитель по `depth`.
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить top" }), {
      key: "ArrowUp",
    })
    expect(onReorder).toHaveBeenCalledWith(3, 2, { depth: 1 })
  })

  it("внутри одного уровня глубина не меняется", () => {
    const onReorder = vi.fn()
    render(<List items={GROUPED} onReorder={onReorder} />)
    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить g2" }), { key: "ArrowUp" })
    expect(onReorder).toHaveBeenCalledWith(2, 1, { depth: 1 })
  })
})
