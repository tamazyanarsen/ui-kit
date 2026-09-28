import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TableBlock, TableBlockEmpty } from "./block"
import { TableCell } from "./cell"
import { TableColumnSettings } from "./column-settings"
import { TableHeadCell } from "./head-cell"
import { useHorizontalScrollState } from "./pin"
import { Table, TableBody, TableHeader, TableRow } from "./table"
import { resolveColumns } from "./table-columns"
import { ADDED_HIGHLIGHT_MS, useAddedRows } from "./use-added-rows"

// Регрессии аудита таблиц: хуки и примитивы.

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("useAddedRows", () => {
  it("смена страницы (ни одной старой строки) не подсвечивает строки", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useAddedRows(keys, true),
      { initialProps: { keys: ["a", "b"] } }
    )
    rerender({ keys: ["c", "d"] })
    expect([...result.current]).toEqual([])
  })

  it("строка, вернувшаяся после сброса отбора, не считается новой", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useAddedRows(keys, true),
      { initialProps: { keys: ["a", "b"] } }
    )
    rerender({ keys: ["a"] })
    rerender({ keys: ["a", "b"] })
    expect([...result.current]).toEqual([])
  })

  it("быстрая вторая партия не оставляет первую подсвеченной навсегда", () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ keys }) => useAddedRows(keys, true),
      { initialProps: { keys: ["a"] } }
    )
    rerender({ keys: ["a", "b"] })
    act(() => void vi.advanceTimersByTime(500))
    rerender({ keys: ["a", "b", "c"] })
    expect([...result.current].sort()).toEqual(["b", "c"])

    act(() => void vi.advanceTimersByTime(ADDED_HIGHLIGHT_MS))
    expect([...result.current]).toEqual([])
  })
})

describe("настройка столбцов", () => {
  it("находит столбец с JSX-названием и называет его текстом", async () => {
    const user = userEvent.setup()
    render(
      <TableColumnSettings
        columns={[{ id: "sum", label: <span>Сумма</span>, visible: true }]}
        onColumnsChange={vi.fn()}
      />
    )
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    await user.type(screen.getByPlaceholderText("Поиск"), "сум")

    expect(
      screen.getByRole("checkbox", { name: "Показывать столбец «Сумма»" })
    ).toBeInTheDocument()
  })

  it("столбец без visible виден и в таблице, и в настройке", async () => {
    const user = userEvent.setup()
    const column = { id: "sum", label: "Сумма" }
    expect(resolveColumns([{ key: "sum" }], [column])).toHaveLength(1)

    render(<TableColumnSettings columns={[column]} onColumnsChange={vi.fn()} />)
    await user.click(screen.getByRole("button", { name: "Настроить столбцы" }))
    expect(
      screen.getByRole("checkbox", { name: "Показывать столбец «Сумма»" })
    ).toHaveAttribute("aria-checked", "true")
  })
})

/** ResizeObserver, который помнит, за чем следит. */
function recordObserved() {
  const observed = new Set<Element>()
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe(el: Element) {
        observed.add(el)
      }
      unobserve() {}
      disconnect() {
        observed.clear()
      }
    }
  )
  return observed
}

describe("useHorizontalScrollState", () => {
  it("следит за детьми, которые появились после монтирования", async () => {
    const observed = recordObserved()
    function Strip({ items }: { items: string[] }) {
      const ref = React.useRef<HTMLDivElement>(null)
      useHorizontalScrollState(ref)
      return (
        <div ref={ref}>
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )
    }
    const { rerender } = render(<Strip items={[]} />)
    rerender(<Strip items={["a", "b"]} />)
    await act(async () => {})

    expect(observed.has(screen.getByText("b"))).toBe(true)
    vi.unstubAllGlobals()
  })
})

describe("закреплённая ячейка", () => {
  it("пересчитывает отступ, когда впереди появилась новая колонка", async () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const width = Number((this as HTMLElement).dataset.w ?? 0)
        return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0, toJSON() {} }
      }
    )
    function Row({ extra }: { extra: boolean }) {
      return (
        <table>
          <tbody>
            <tr>
              {extra && <td data-w="40" />}
              <TableCell pin="left" data-testid="pinned" />
            </tr>
          </tbody>
        </table>
      )
    }
    const { rerender } = render(<Row extra={false} />)
    expect(screen.getByTestId("pinned").style.left).toBe("0px")

    rerender(<Row extra />)
    await act(async () => {})
    expect(screen.getByTestId("pinned").style.left).toBe("40px")
  })
})

describe("изменение ширины колонки", () => {
  it("pointercancel завершает перетаскивание", () => {
    const onWidthChange = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <TableHeadCell resizable defaultWidth={100} onWidthChange={onWidthChange}>
              Сумма
            </TableHeadCell>
          </tr>
        </thead>
      </table>
    )
    const handle = document.querySelector<HTMLElement>(
      '[data-slot="table-resize-handle"]'
    )!
    handle.setPointerCapture = vi.fn()
    handle.releasePointerCapture = vi.fn()
    handle.hasPointerCapture = vi.fn(() => true)

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 10 })
    expect(onWidthChange).toHaveBeenCalledTimes(1)

    fireEvent(handle, new Event("pointercancel"))
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 30 })
    expect(onWidthChange).toHaveBeenCalledTimes(1)
  })
})

describe("ref доходит до DOM", () => {
  it("у каркаса таблицы и ячеек", () => {
    const refs = {
      table: React.createRef<HTMLTableElement>(),
      body: React.createRef<HTMLTableSectionElement>(),
      row: React.createRef<HTMLTableRowElement>(),
      cell: React.createRef<HTMLTableDataCellElement>(),
    }
    render(
      <Table ref={refs.table}>
        <TableBody ref={refs.body}>
          <TableRow ref={refs.row}>
            <TableCell ref={refs.cell} pin="left" />
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(refs.table.current?.tagName).toBe("TABLE")
    expect(refs.body.current?.tagName).toBe("TBODY")
    expect(refs.row.current?.tagName).toBe("TR")
    expect(refs.cell.current?.tagName).toBe("TD")
  })

  it("у шапки и блока", () => {
    const header = React.createRef<HTMLTableSectionElement>()
    const head = React.createRef<HTMLTableHeaderCellElement>()
    const block = React.createRef<HTMLDivElement>()
    const empty = React.createRef<HTMLDivElement>()
    render(
      <TableBlock ref={block}>
        <Table>
          <TableHeader ref={header}>
            <tr>
              <TableHeadCell ref={head} pin="left">Сумма</TableHeadCell>
            </tr>
          </TableHeader>
        </Table>
        <TableBlockEmpty ref={empty} />
      </TableBlock>
    )

    expect(header.current?.tagName).toBe("THEAD")
    expect(head.current?.tagName).toBe("TH")
    expect(block.current).toBeInstanceOf(HTMLDivElement)
    expect(empty.current).toBeInstanceOf(HTMLDivElement)
  })
})
