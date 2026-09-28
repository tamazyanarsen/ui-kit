import { afterEach, describe, expect, it, vi } from "vitest"
import { createEvent, fireEvent, render } from "@testing-library/react"

import { DataTable } from "./data-table"
import { parseDate } from "./field-format"
import { TableHeadCell } from "./head-cell"
import { Table, TableHeader, TableRow } from "./table"

// Финальный аудит таблиц: регрессии на каждое исправление.

describe("parseDate: русская запись даты", () => {
  it("«01.02.2026» — 1 февраля, а не 2 января", () => {
    const date = parseDate("01.02.2026")!
    expect([date.getDate(), date.getMonth(), date.getFullYear()]).toEqual([1, 1, 2026])
  })

  it("«31.12.2026» разбирается, а несуществующий день — нет", () => {
    expect(parseDate("31.12.2026")?.getDate()).toBe(31)
    expect(parseDate("31.02.2026")).toBeNull()
  })

  it("со временем и без запятой, и с ней", () => {
    const date = parseDate("05.03.2026, 14:05")!
    expect([date.getDate(), date.getMonth(), date.getHours(), date.getMinutes()]).toEqual([
      5, 2, 14, 5,
    ])
    expect(parseDate("05.03.2026 14:05")?.getHours()).toBe(14)
  })

  it("прочие строки остаются как есть, ISO по-прежнему разбирается", () => {
    expect(parseDate("02/01/2026")).toBeNull()
    expect(parseDate("Jan 5 2026")).toBeNull()
    expect(parseDate("2026-08-25")?.getDate()).toBe(25)
    expect(parseDate("2026-08-25T14:05:00")?.getHours()).toBe(14)
  })

  it("колонка date показывает «01.02.2026» без перестановки", () => {
    const { container } = render(
      <DataTable
        fields={[{ key: "d", title: "Дата", type: "date" }]}
        rows={[{ id: "1", d: "01.02.2026" }]}
      />
    )
    expect(container.querySelector("tbody td")?.textContent).toContain("01.02.2026")
  })
})

describe("DataTable: столбец иерархии", () => {
  type Row = { id: string; n: number; name: string; children?: Row[] }
  const rows: Row[] = [{ id: "1", n: 1, name: "Корень", children: [{ id: "2", n: 2, name: "Лист" }] }]

  it("при первом столбце «№» шеврон встаёт на первый текстовый", () => {
    const { container } = render(
      <DataTable<Row>
        fields={[
          { key: "n", title: "№", type: "number" },
          { key: "name", title: "Имя" },
        ]}
        rows={rows}
        getChildren={(row) => row.children}
      />
    )
    expect(container.querySelectorAll("tbody button").length).toBeGreaterThan(0)
  })

  it("объявленная иерархия на числовом столбце уступает текстовому", () => {
    const { container } = render(
      <DataTable<Row>
        fields={[
          { key: "n", title: "№", type: "number", hierarchy: true },
          { key: "name", title: "Имя" },
        ]}
        rows={rows}
        getChildren={(row) => row.children}
      />
    )
    expect(container.querySelectorAll("tbody button").length).toBeGreaterThan(0)
  })
})

describe("TableHeadCell: ширина из style", () => {
  it("не затирается, когда width/defaultWidth не заданы", () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell style={{ width: 200 }}>Колонка</TableHeadCell>
          </TableRow>
        </TableHeader>
      </Table>
    )
    expect(container.querySelector<HTMLElement>("th")!.style.width).toBe("200px")
  })
})

describe("Ширина первой колонки при захвате границы", () => {
  const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")
  afterEach(() => {
    if (offsetWidth) Object.defineProperty(HTMLElement.prototype, "offsetWidth", offsetWidth)
    vi.restoreAllMocks()
  })

  function grab(handle: Element, x: number) {
    for (const kind of ["pointerDown", "pointerMove"] as const) {
      const event = createEvent[kind](handle, { pointerId: 1 })
      Object.defineProperty(event, "clientX", { value: x })
      Object.defineProperty(event, "pointerId", { value: 1 })
      fireEvent(handle, event)
    }
    fireEvent.pointerUp(handle)
  }

  it("захват без движения не расширяет колонку на поле строки", () => {
    // Коробка ячейки в jsdom — ровно объявленная ширина из style.
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return parseFloat((this as HTMLElement).style.width) || 0
      },
    })
    HTMLElement.prototype.setPointerCapture = vi.fn()
    HTMLElement.prototype.releasePointerCapture = vi.fn()
    HTMLElement.prototype.hasPointerCapture = vi.fn(() => false)
    const { container } = render(
      <DataTable
        fields={[
          { key: "a", title: "A", width: 200 },
          { key: "b", title: "B", width: 200 },
        ]}
        rows={[{ id: "1", a: "x", b: "y" }]}
      />
    )
    const first = container.querySelector<HTMLElement>("thead th")!
    const before = first.style.width
    grab(first.querySelector("[data-slot='table-resize-handle']")!, 100)
    grab(first.querySelector("[data-slot='table-resize-handle']")!, 100)
    expect(first.style.width).toBe(before)
  })
})

describe("Закреплённые ячейки: наблюдатели", () => {
  afterEach(() => vi.unstubAllGlobals())

  function countObservers(rowCount: number, pinned: boolean) {
    let resize = 0
    let mutation = 0
    const RealMO = globalThis.MutationObserver
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor() {
          resize++
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
    vi.stubGlobal(
      "MutationObserver",
      class extends RealMO {
        constructor(cb: MutationCallback) {
          super(cb)
          mutation++
        }
      }
    )
    const rows = Array.from({ length: rowCount }, (_, i) => ({ id: String(i), a: "x", b: "y", c: "z" }))
    const view = render(
      <DataTable
        selectable
        fields={[
          { key: "a", title: "A", pin: pinned ? "left" : undefined },
          { key: "b", title: "B" },
          { key: "c", title: "C", pin: pinned ? "right" : undefined },
        ]}
        rows={rows}
      />
    )
    view.unmount()
    vi.unstubAllGlobals()
    return { resize, mutation }
  }

  // Считается только добавка закрепа: «с закрепом» минус «без». Прочие
  // наблюдатели (обрезка подписей и т. п.) к закрепу отношения не имеют.
  function pinOverhead(rowCount: number) {
    const withPin = countObservers(rowCount, true)
    const without = countObservers(rowCount, false)
    return {
      resize: withPin.resize - without.resize,
      mutation: withPin.mutation - without.mutation,
    }
  }

  it("число наблюдателей закрепа не растёт с числом строк", () => {
    expect(pinOverhead(60)).toEqual(pinOverhead(5))
  })
})
