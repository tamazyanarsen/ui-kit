import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { DataTable, type TableField } from "./index"

// Круг проверки r3: для столбца, которого нет в карте `columnWidths`, в
// ячейку шапки уходила ширина `undefined` — ячейка писала тягу в своё
// состояние и показывала его. Родитель не мог ни отклонить изменение, ни
// сбросить ширины в `{}`.

type Row = { id: string; a: string; b: string }
const rows: Row[] = [{ id: "1", a: "A", b: "B" }]
const fields: TableField<Row>[] = [
  { key: "a", title: "A", width: 200 },
  { key: "b", title: "B", width: 200 },
]

const headCell = (title: string) =>
  Array.from(document.querySelectorAll<HTMLElement>("thead th")).find(
    (cell) => cell.textContent === title
  )!

describe("DataTable: управляемые columnWidths без ключа столбца", () => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")
  afterEach(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, "offsetWidth", original)
    vi.restoreAllMocks()
  })

  function dragB(by: number) {
    // jsdom не считает раскладку: стартовая ширина ячейки — объявленные 200.
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return (this as HTMLElement).tagName === "TH" ? 200 : 0
      },
    })
    HTMLElement.prototype.setPointerCapture ??= () => {}
    HTMLElement.prototype.hasPointerCapture ??= () => false
    const handle = headCell("B").querySelector<HTMLElement>(
      '[data-slot="table-resize-handle"]'
    )!
    fireEvent.pointerDown(handle, { clientX: 0, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: by, pointerId: 1 })
    fireEvent.pointerUp(handle, { pointerId: 1 })
  }

  it("родитель не принял изменение — ширина остаётся по умолчанию", () => {
    const onColumnWidthsChange = vi.fn()
    render(
      <DataTable
        fields={fields}
        rows={rows}
        columnWidths={{}}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    )
    dragB(150)
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ b: 350 })
    expect(headCell("B").style.width).toBe("200px")
  })

  it("сброс ширин в {} возвращает столбец к ширине по умолчанию", () => {
    const { rerender } = render(
      <DataTable
        fields={fields}
        rows={rows}
        columnWidths={{}}
        onColumnWidthsChange={() => {}}
      />
    )
    dragB(150)
    rerender(<DataTable fields={fields} rows={rows} columnWidths={{ b: 350 }} />)
    expect(headCell("B").style.width).toBe("350px")
    rerender(<DataTable fields={fields} rows={rows} columnWidths={{}} />)
    expect(headCell("B").style.width).toBe("200px")
  })
})
