import { describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { TableHeadCell } from "./head-cell"

// Ревью 10.10, п. 6: отменённый жест (`pointercancel`, потеря захвата без
// отпускания) фиксировал промежуточную ширину колонки.
function setup(props: React.ComponentProps<typeof TableHeadCell>) {
  render(
    <table>
      <thead>
        <tr>
          <TableHeadCell resizable {...props}>
            Сумма
          </TableHeadCell>
        </tr>
      </thead>
    </table>
  )
  const handle = document.querySelector<HTMLElement>('[data-slot="table-resize-handle"]')!
  handle.setPointerCapture = vi.fn()
  handle.releasePointerCapture = vi.fn()
  handle.hasPointerCapture = vi.fn(() => true)
  const cell = handle.closest("th")!
  // jsdom не считает раскладку: исходная ширина ячейки — 200.
  Object.defineProperty(cell, "offsetWidth", { configurable: true, get: () => 200 })
  return { handle, cell }
}

describe("изменение ширины колонки: отмена жеста (ревью 10.10, п. 6)", () => {
  it.each(["pointercancel", "lostpointercapture"])(
    "%s не фиксирует ширину и возвращает исходную",
    (type) => {
      const onWidthCommit = vi.fn()
      const { handle, cell } = setup({ defaultWidth: 200, onWidthCommit })

      fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 })
      fireEvent.pointerMove(handle, { pointerId: 1, clientX: 80 })
      expect(cell.style.width).toBe("280px")

      fireEvent(handle, new Event(type))
      expect(onWidthCommit).not.toHaveBeenCalled()
      expect(cell.style.width).toBe("200px")
    }
  )

  it("отпускание по-прежнему фиксирует ширину", () => {
    const onWidthCommit = vi.fn()
    const { handle, cell } = setup({ defaultWidth: 200, onWidthCommit })

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 80 })
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 80 })
    // `lostpointercapture` следом за отпусканием — тот же конец жеста.
    fireEvent(handle, new Event("lostpointercapture"))

    expect(onWidthCommit).toHaveBeenCalledTimes(1)
    expect(onWidthCommit).toHaveBeenCalledWith(280)
    expect(cell.style.width).toBe("280px")
  })

  it("управляемому родителю отмена возвращает исходную ширину", () => {
    const onWidthChange = vi.fn()
    const { handle } = setup({ width: 200, onWidthChange })

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 80 })
    fireEvent(handle, new Event("pointercancel"))

    expect(onWidthChange).toHaveBeenLastCalledWith(200)
  })
})
