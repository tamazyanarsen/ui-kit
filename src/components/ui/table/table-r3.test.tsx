import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render } from "@testing-library/react"

import { DataTable, type TableColumn, type TableField } from "./index"

// Итоговая проверка кита, третий заход: закреп, клавиатура строки и ширины.

type Row = { id: string; a: string; b: string; c: string }
const rows: Row[] = [{ id: "1", a: "A", b: "B", c: "C" }]

const headCell = (title: string) =>
  Array.from(document.querySelectorAll<HTMLElement>("thead th")).find(
    (cell) => cell.textContent === title
  )!

describe("закреп: линия-разделитель при смене pin у соседа", () => {
  const fields = (pinB: boolean): TableField<Row>[] => [
    { key: "a", title: "A", pin: "left" },
    { key: "b", title: "B", pin: pinB ? "left" : undefined },
    { key: "c", title: "C" },
  ]
  const hasDivider = (title: string) =>
    Boolean(headCell(title).querySelector('[data-slot="table-pin-divider"]'))
  // Наблюдатель реестра отвечает микрозадачей — ждём её.
  const flush = () => act(async () => {})

  it("снятый закреп у соседа отдаёт линию оставшейся колонке", async () => {
    const { rerender } = render(<DataTable fields={fields(true)} rows={rows} />)
    expect(hasDivider("B")).toBe(true)
    rerender(<DataTable fields={fields(false)} rows={rows} />)
    await flush()
    expect(hasDivider("A")).toBe(true)
    expect(hasDivider("B")).toBe(false)
  })

  it("новый закреп у соседа забирает линию у прежнего края", async () => {
    const { rerender } = render(<DataTable fields={fields(false)} rows={rows} />)
    expect(hasDivider("A")).toBe(true)
    rerender(<DataTable fields={fields(true)} rows={rows} />)
    await flush()
    expect(hasDivider("B")).toBe(true)
    expect(hasDivider("A")).toBe(false)
  })
})

describe("кликабельная строка: удержание пробела", () => {
  it("автоповтор пробела не открывает карточку снова", () => {
    const onRowClick = vi.fn()
    render(
      <DataTable
        fields={[{ key: "a", title: "A" }] as TableField<Row>[]}
        rows={rows}
        onRowClick={onRowClick}
      />
    )
    const row = document.querySelector<HTMLElement>("tbody tr[data-clickable]")!
    fireEvent.keyDown(row, { key: " " })
    const repeated = fireEvent.keyDown(row, { key: " ", repeat: true })
    fireEvent.keyDown(row, { key: " ", repeat: true })
    expect(onRowClick).toHaveBeenCalledTimes(1)
    // Прокрутку страницы автоповтор по-прежнему не вызывает.
    expect(repeated).toBe(false)
  })
})

describe("ширина, заданная тягой", () => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")
  afterEach(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, "offsetWidth", original)
  })

  const fields: TableField<Row>[] = [
    { key: "a", title: "A", width: 200 },
    { key: "b", title: "B", width: 200 },
  ]
  const columns = (bVisible: boolean): TableColumn[] => [
    { id: "a", label: "A" },
    { id: "b", label: "B", visible: bVisible },
  ]

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

  it("переживает «скрыть → показать» в настройке столбцов", () => {
    const { rerender } = render(
      <DataTable fields={fields} rows={rows} columnSettings={columns(true)} />
    )
    dragB(150)
    expect(headCell("B").style.width).toBe("350px")
    rerender(<DataTable fields={fields} rows={rows} columnSettings={columns(false)} />)
    rerender(<DataTable fields={fields} rows={rows} columnSettings={columns(true)} />)
    expect(headCell("B").style.width).toBe("350px")
  })

  it("сообщается наружу и берётся из управляемых columnWidths", () => {
    const onColumnWidthsChange = vi.fn()
    const { rerender } = render(
      <DataTable
        fields={fields}
        rows={rows}
        columnWidths={{ b: 260 }}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    )
    expect(headCell("B").style.width).toBe("260px")
    dragB(40)
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ b: 240 })
    // Управляемо: пока родитель не принял ширину, она прежняя.
    expect(headCell("B").style.width).toBe("260px")
    rerender(
      <DataTable
        fields={fields}
        rows={rows}
        columnWidths={{ b: 240 }}
        onColumnWidthsChange={onColumnWidthsChange}
      />
    )
    expect(headCell("B").style.width).toBe("240px")
  })
})
