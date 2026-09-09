import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  sortableRowClass,
  useSortable,
  type SortableEntry,
} from "./index"

// jsdom не считает раскладку: `getBoundingClientRect` у него всегда нули, и
// хук не смог бы понять, над какой строкой курсор. Поэтому строкам
// подставляются заранее известные прямоугольники — 56px, как в макете.
const ROW_HEIGHT = 56

function withGeometry(items: SortableEntry[]) {
  const original = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function rect(this: Element) {
    const id = this.getAttribute("data-row-id")
    if (id) {
      const index = items.findIndex((item) => item.id === id)
      return {
        top: index * ROW_HEIGHT,
        bottom: (index + 1) * ROW_HEIGHT,
        height: ROW_HEIGHT,
        left: 0,
        right: 400,
        width: 400,
        x: 0,
        y: index * ROW_HEIGHT,
        toJSON: () => ({}),
      } as DOMRect
    }
    return {
      top: 0,
      bottom: items.length * ROW_HEIGHT,
      height: items.length * ROW_HEIGHT,
      left: 0,
      right: 400,
      width: 400,
      x: 0,
      y: 0,
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
  onExpandGroup,
}: {
  items: SortableEntry[]
  onReorder: (from: number, to: number) => void
  onExpandGroup?: (id: string) => void
}) {
  const sortable = useSortable({ items, onReorder, onExpandGroup })
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
          <SortableHandle
            label={`Переместить ${item.id}`}
            {...sortable.handleProps(item.id)}
          />
        </div>
      ))}
      <SortableDropIndicator indicator={sortable.indicator} />
    </SortableList>
  )
}

const FLAT: SortableEntry[] = [
  { id: "a" },
  { id: "b" },
  { id: "c" },
  { id: "d" },
]

// ⚠️ `fireEvent.dragOver(el, { clientY })` НЕ доносит координату: jsdom не
// реализует `DragEvent`, testing-library собирает обычный `Event`, и `clientY`
// у него молча отбрасывается. Поэтому событие создаётся вручную из
// `MouseEvent` — у него координаты в конструкторе есть, а React читает их
// одинаково.
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

function startDrag(id: string) {
  fireEvent.pointerDown(screen.getByRole("button", { name: `Переместить ${id}` }))
  fireEvent.dragStart(screen.getByTestId(`row-${id}`))
}

describe("useSortable", () => {
  it("взводит перетаскивание только по ручке", () => {
    const restore = withGeometry(FLAT)
    render(<List items={FLAT} onReorder={vi.fn()} />)

    expect(screen.getByTestId("row-a")).not.toHaveAttribute("draggable", "true")
    fireEvent.pointerDown(screen.getByRole("button", { name: "Переместить a" }))
    expect(screen.getByTestId("row-a")).toHaveAttribute("draggable", "true")
    restore()
  })

  it("красит взятую строку и показывает линию вставки", () => {
    const restore = withGeometry(FLAT)
    const { container } = render(<List items={FLAT} onReorder={vi.fn()} />)

    startDrag("a")
    expect(screen.getByTestId("row-a")).toHaveAttribute("data-dragging", "true")

    // Нижняя половина строки `c` — линия садится на её нижнюю границу.
    dragOverAt(2 * ROW_HEIGHT + 50)
    const indicator = container.querySelector<HTMLElement>(
      '[data-slot="sortable-drop-indicator"]'
    )
    expect(indicator).not.toBeNull()
    expect(indicator!.style.top).toBe(`${3 * ROW_HEIGHT - 1}px`)
    restore()
  })

  it("вставляет по границе, над половиной которой стоит курсор", () => {
    const restore = withGeometry(FLAT)
    const onReorder = vi.fn()
    render(<List items={FLAT} onReorder={onReorder} />)

    startDrag("a")
    // Нижняя половина `c` (индекс 2) — вставка после неё.
    dragOverAt(2 * ROW_HEIGHT + 50)
    dropAt(2 * ROW_HEIGHT + 50)

    expect(onReorder).toHaveBeenCalledWith(0, 2)
    restore()
  })

  it("наследует глубину строки, над которой стоит курсор", () => {
    const nested: SortableEntry[] = [
      { id: "a" },
      { id: "group", group: true, expanded: true },
      { id: "child", depth: 1 },
      { id: "after" },
    ]
    const restore = withGeometry(nested)
    const { container } = render(<List items={nested} onReorder={vi.fn()} />)
    startDrag("a")

    const read = () =>
      container.querySelector<HTMLElement>('[data-slot="sortable-drop-indicator"]')!

    // Нижняя половина последней строки группы — короткая линия.
    dragOverAt(2 * ROW_HEIGHT + 50)
    const nestedTop = read().style.top
    expect(read().style.left).toContain("* 1")

    // Верхняя половина строки под группой — линия обычная, но на том же
    // уровне (прямое требование макета).
    dragOverAt(3 * ROW_HEIGHT + 5)
    expect(read().style.left).toContain("* 0")
    expect(read().style.top).toBe(nestedTop)
    restore()
  })

  it("подсвечивает свёрнутую группу и раскрывает её через 0,5 с", () => {
    vi.useFakeTimers()
    const collapsed: SortableEntry[] = [
      { id: "a" },
      { id: "group", group: true, expanded: false },
    ]
    const restore = withGeometry(collapsed)
    const onExpandGroup = vi.fn()
    const { container } = render(
      <List items={collapsed} onReorder={vi.fn()} onExpandGroup={onExpandGroup} />
    )

    startDrag("a")
    dragOverAt(ROW_HEIGHT + 10)

    expect(screen.getByTestId("row-group")).toHaveAttribute("data-drop-into", "true")
    // Линии над группой нет — бросок идёт ВНУТРЬ неё.
    expect(
      container.querySelector('[data-slot="sortable-drop-indicator"]')
    ).toBeNull()

    expect(onExpandGroup).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(onExpandGroup).toHaveBeenCalledWith("group")

    restore()
    vi.useRealTimers()
  })

  it("двигает строку стрелками с клавиатуры", () => {
    const restore = withGeometry(FLAT)
    const onReorder = vi.fn()
    render(<List items={FLAT} onReorder={onReorder} />)

    fireEvent.keyDown(screen.getByRole("button", { name: "Переместить b" }), {
      key: "ArrowUp",
    })
    expect(onReorder).toHaveBeenCalledWith(1, 0)
    restore()
  })
})
