import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TEST_ROWS } from "@/test/table-fixtures"

import { TableCell } from "./cell"
import { DataTable } from "./data-table"

afterEach(() => {
  vi.restoreAllMocks()
})

// Ревью 10.10, п. 19: поле-флажок без `onCheckedChange` выглядело рабочим
// (наведение, курсор-рука), а клик ничего не делал.
describe("DataTable: флажок без обработчика (ревью 10.10, п. 19)", () => {
  it("только для чтения и не переключается", async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        fields={[{ key: "ok", title: "Признак", type: "checkbox", checked: () => true }]}
        rows={[TEST_ROWS[1]]}
      />
    )
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("aria-readonly", "true")
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it("с обработчиком остаётся рабочим", () => {
    render(
      <DataTable
        fields={[{ key: "ok", title: "Признак", type: "checkbox", onCheckedChange: () => {} }]}
        rows={[TEST_ROWS[1]]}
      />
    )
    expect(screen.getByRole("checkbox")).not.toHaveAttribute("aria-readonly")
  })
})

// Ревью 10.10, п. 20: `onCopy` из `cellProps` подменял чистку копирования
// числа, и сумма уходила в буфер с переносом перед «₽».
describe("TableCell: onCopy потребителя и копирование числа (ревью 10.10, п. 20)", () => {
  function copyFrom(cell: HTMLElement) {
    vi.spyOn(window, "getSelection").mockReturnValue({
      toString: () => "1 250 000,00\n ₽",
    } as Selection)
    const setData = vi.fn()
    fireEvent.copy(cell, { clipboardData: { setData } })
    return setData
  }

  function renderCell(onCopy?: (event: React.ClipboardEvent<HTMLTableCellElement>) => void) {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell type="number" unit="₽" onCopy={onCopy}>
              1 250 000,00
            </TableCell>
          </tr>
        </tbody>
      </table>
    )
    return document.querySelector<HTMLElement>('[data-slot="table-cell"]')!
  }

  it("зовутся оба: и потребитель, и чистка", () => {
    const onCopy = vi.fn()
    const setData = copyFrom(renderCell(onCopy))
    expect(onCopy).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith("text/plain", "1 250 000,00 ₽")
  })

  it("потребитель, отменивший копирование, распоряжается буфером сам", () => {
    const setData = copyFrom(renderCell((event) => event.preventDefault()))
    expect(setData).not.toHaveBeenCalled()
  })
})
