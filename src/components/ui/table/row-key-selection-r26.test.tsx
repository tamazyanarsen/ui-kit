import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DataTable } from "./data-table"
import type { TableField } from "./field-types"

// Раунд 26: r24 научил строку не открываться кликом после протяжки по тексту,
// но проверка выделения стояла и на клике, который строка делает сама по
// Enter/Space. Выделенный в строке текст оставался после протяжки, и строку с
// фокусом нельзя было открыть с клавиатуры, пока выделение не снято.

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

describe("DataTable: Enter на строке при выделенном тексте", () => {
  afterEach(() => vi.restoreAllMocks())

  it("Enter и Space открывают строку, хотя в ней выделен текст", () => {
    const onRowClick = vi.fn()
    render(<DataTable fields={FIELDS} rows={ROWS} onRowClick={onRowClick} />)
    mockSelection(screen.getByText(ROWS[0].name).firstChild)
    const row = screen.getAllByRole("row")[1]
    fireEvent.keyDown(row, { key: "Enter" })
    fireEvent.keyDown(row, { key: " " })
    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(row).not.toHaveAttribute("data-key-activation")
  })

  it("клик мышью при выделенном тексте по-прежнему не открывает строку", () => {
    const onRowClick = vi.fn()
    render(<DataTable fields={FIELDS} rows={ROWS} onRowClick={onRowClick} />)
    mockSelection(screen.getByText(ROWS[0].name).firstChild)
    fireEvent.click(screen.getByText(ROWS[0].name))
    expect(onRowClick).not.toHaveBeenCalled()
  })
})
