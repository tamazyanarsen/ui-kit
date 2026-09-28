import { afterEach, describe, expect, it, vi } from "vitest"
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react"

import { SortableHandle, SortableList, useSortable } from "./index"

// Финальный аудит: автопрокрутка у края не останавливалась. Цикл
// перезапускал себя каждым кадром, а остановка гасила id ПЕРВОГО кадра — уже
// отработавшего. После броска у края список прокручивался бесконечно, по
// циклу на каждый `dragover`, в том числе после размонтирования.

const frames = new Map<number, FrameRequestCallback>()
let nextFrame = 1

function installFrames() {
  frames.clear()
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    const id = nextFrame++
    frames.set(id, cb)
    return id
  })
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frames.delete(id)
  })
}

function tick(count = 1) {
  for (let i = 0; i < count; i++) {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((cb) => cb(0))
  }
}

function dragAt(kind: "dragOver" | "drop", el: Element, clientY: number) {
  const event = createEvent[kind](el)
  Object.defineProperty(event, "clientY", { value: clientY })
  fireEvent(el, event)
}

const ITEMS = [{ id: "a" }, { id: "b" }]

function Demo() {
  const sortable = useSortable({ items: ITEMS, onReorder: () => {} })
  return (
    <SortableList data-testid="list" {...sortable.listProps}>
      {ITEMS.map((item) => (
        <div key={item.id} data-testid={item.id} {...sortable.itemProps(item.id)}>
          <SortableHandle label={`Переместить ${item.id}`} {...sortable.handleProps(item.id)} />
        </div>
      ))}
    </SortableList>
  )
}

/** Взять `a` и дважды провести у нижнего края окна (в jsdom прокручивается окно). */
function dragToBottomEdge() {
  const scrollBy = vi.fn()
  window.scrollBy = scrollBy as unknown as typeof window.scrollBy
  const view = render(<Demo />)
  fireEvent.pointerDown(screen.getByRole("button", { name: "Переместить a" }))
  fireEvent.dragStart(screen.getByTestId("a"))
  const list = screen.getByTestId("list")
  dragAt("dragOver", list, window.innerHeight - 10)
  act(() => tick(2))
  dragAt("dragOver", list, window.innerHeight - 10)
  act(() => tick())
  return { scrollBy, list, ...view }
}

describe("Sortable: автопрокрутка у края", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("останавливается после броска", () => {
    installFrames()
    const { scrollBy, list } = dragToBottomEdge()
    dragAt("drop", list, window.innerHeight - 10)
    fireEvent.dragEnd(screen.getByTestId("a"))

    const before = scrollBy.mock.calls.length
    act(() => tick(10))
    expect(scrollBy.mock.calls.length).toBe(before)
    expect(frames.size).toBe(0)
  })

  it("крутит одним циклом, сколько бы dragover ни пришло", () => {
    installFrames()
    const { scrollBy } = dragToBottomEdge()
    const before = scrollBy.mock.calls.length
    act(() => tick())
    // Один кадр — один шаг прокрутки, а не по шагу на каждый dragover.
    expect(scrollBy.mock.calls.length - before).toBe(1)
  })

  it("гасится при размонтировании", () => {
    installFrames()
    const { scrollBy, unmount } = dragToBottomEdge()
    unmount()
    const before = scrollBy.mock.calls.length
    act(() => tick(5))
    expect(scrollBy.mock.calls.length).toBe(before)
  })
})
