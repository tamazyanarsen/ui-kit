import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Аудит 23: протяжка мышью по тексту кликабельной строки DataTable (номер
// счёта — скопировать) заканчивалась `click` и открывала строку. У карточек
// это закрыли в r17 (press.ts), а строка таблицы шла своим обработчиком.

type Row = { id: string; name: string }
const FIELDS: TableField<Row>[] = [{ key: "name", title: "Документ", type: "text" }]
const ROWS: Row[] = [{ id: "a", name: "Платёжное поручение 40702810000000001234" }]

function mockSelection(node: Node | null) {
  vi.spyOn(window, "getSelection").mockReturnValue({
    isCollapsed: node === null,
    rangeCount: node === null ? 0 : 1,
    getRangeAt: () => ({
      intersectsNode: (other: Node) => other.contains(node!) || node!.contains(other),
    }),
  } as unknown as Selection)
}

describe("DataTable: выделение текста в строке — не переход", () => {
  afterEach(() => vi.restoreAllMocks())

  it("клик после протяжки по тексту строки onRowClick не вызывает", () => {
    const onRowClick = vi.fn()
    render(<DataTable fields={FIELDS} rows={ROWS} onRowClick={onRowClick} />)
    const text = screen.getByText(ROWS[0].name)
    mockSelection(text.firstChild)
    fireEvent.click(text)
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("обычный клик по строке по-прежнему открывает её", () => {
    const onRowClick = vi.fn()
    render(<DataTable fields={FIELDS} rows={ROWS} onRowClick={onRowClick} />)
    mockSelection(null)
    fireEvent.click(screen.getByText(ROWS[0].name))
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})
