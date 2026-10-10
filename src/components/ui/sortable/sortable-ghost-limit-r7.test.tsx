import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { exceedsGroupLimit, landingDepth } from "./landing"
import { SortableDropIndicator, SortableList, useSortable, type SortableEntry } from "./index"

// Дизайн-чек 08.10, замечание 7: без фантома у курсора и без «ложного
// прогноза» под последней строкой полной группы.

const FULL: SortableEntry[] = [
  { id: "fav", group: true, expanded: true, limit: 2 },
  { id: "f1", depth: 1 },
  { id: "f2", depth: 1 },
  { id: "rest", group: true, expanded: true },
  { id: "r1", depth: 1 },
]

describe("лимит группы", () => {
  it("гасит место под последней строкой полной группы", () => {
    // Нижняя половина f2 — линия вложенная, место вставки 3.
    expect(landingDepth(FULL, "r1", 3, 1)).toBe(1)
    expect(exceedsGroupLimit(FULL, "r1", 3, 1)).toBe(true)
  })

  it("оставляет место вместо последней строки", () => {
    expect(exceedsGroupLimit(FULL, "r1", 2, 1)).toBe(false)
    expect(exceedsGroupLimit(FULL, "r1", 1, 1)).toBe(false)
  })

  it("не мешает перестановке внутри той же группы", () => {
    expect(exceedsGroupLimit(FULL, "f1", 3, 1)).toBe(false)
  })

  it("верх раскрытой группы под заголовком — внутри группы", () => {
    expect(landingDepth(FULL, "r1", 1, 0)).toBe(1)
    expect(landingDepth(FULL, "f1", 3, 0)).toBe(0)
  })
})

function List({ items }: { items: SortableEntry[] }) {
  const sortable = useSortable({ items, onReorder: vi.fn() })
  return (
    <SortableList {...sortable.listProps}>
      {items.map((item) => (
        <div key={item.id} data-testid={`row-${item.id}`} {...sortable.itemProps(item.id)}>
          <button type="button" aria-label={item.id} {...sortable.handleProps(item.id)} />
        </div>
      ))}
      <SortableDropIndicator indicator={sortable.indicator} />
    </SortableList>
  )
}

describe("фантом", () => {
  it("подменяет картинку перетаскивания прозрачным пикселем", () => {
    render(<List items={[{ id: "a" }, { id: "b" }]} />)
    const setDragImage = vi.fn()
    fireEvent.pointerDown(screen.getByRole("button", { name: "a" }))
    fireEvent.dragStart(screen.getByTestId("row-a"), {
      dataTransfer: { setData: vi.fn(), setDragImage },
    })
    expect(setDragImage).toHaveBeenCalledTimes(1)
    const [image] = setDragImage.mock.calls[0]
    expect((image as HTMLImageElement).src).toMatch(/^data:image\/gif/)
  })
})
