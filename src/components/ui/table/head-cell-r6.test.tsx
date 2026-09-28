import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { TableHeadCell } from "./head-cell"

// Итоговая проверка №5 — три дефекта ячейки шапки.

function Head({ children }: { children: React.ReactNode }) {
  return (
    <table>
      <thead>
        <tr>{children}</tr>
      </thead>
    </table>
  )
}

function grabHandle() {
  const handle = document.querySelector<HTMLElement>('[data-slot="table-resize-handle"]')!
  handle.setPointerCapture = vi.fn()
  handle.releasePointerCapture = vi.fn()
  handle.hasPointerCapture = vi.fn(() => true)
  return handle
}

const cellWidth = () =>
  document.querySelector<HTMLElement>('[data-slot="table-head-cell"]')!.style.width

describe("TableHeadCell: управляемая ширина во время тяги", () => {
  // Родитель ограничивает колонку 220-ю. Своя ширина жеста перебивала его
  // число, и колонка тянулась до 300, отскакивая только при отпускании.
  it("родитель с onWidthChange ограничивает ширину прямо во время жеста", () => {
    function Clamped() {
      const [width, setWidth] = React.useState(150)
      return (
        <Head>
          <TableHeadCell
            resizable
            width={width}
            onWidthChange={(next) => setWidth(Math.min(next, 220))}
          >
            Имя
          </TableHeadCell>
        </Head>
      )
    }
    render(<Clamped />)
    const handle = grabHandle()
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 300 })
    expect(cellWidth()).toBe("220px")
  })

  // Путь DataTable: ширина управляемая, но в модель уходит только итог
  // жеста — во время тяги ячейка показывает свою ширину.
  it("с одним onWidthCommit ячейка тянется сама и отдаёт итог при отпускании", () => {
    const onWidthCommit = vi.fn()
    render(
      <Head>
        <TableHeadCell resizable width={150} onWidthCommit={onWidthCommit}>
          Имя
        </TableHeadCell>
      </Head>
    )
    const handle = grabHandle()
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 0 })
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 300 })
    expect(cellWidth()).toBe("300px")
    expect(onWidthCommit).not.toHaveBeenCalled()
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 300 })
    expect(onWidthCommit).toHaveBeenCalledWith(300)
  })
})

describe("TableHeadCell: ручка ширины целиком в своей ячейке", () => {
  // У каждой ячейки шапки свой z-index, и соседняя ячейка рисовалась поверх
  // вылезшей за край половины ручки — из 9px хватались только 4.
  it("ручка не вылезает за правый край ячейки", () => {
    render(
      <Head>
        <TableHeadCell resizable defaultWidth={150}>
          Имя
        </TableHeadCell>
      </Head>
    )
    const handle = document.querySelector<HTMLElement>('[data-slot="table-resize-handle"]')!
    expect(handle.className).toMatch(/(^|\s)right-0(\s|$)/)
    expect(handle.className).not.toMatch(/-right-/)
  })
})

describe("TableHeadCell: значок колонки Icon по центру", () => {
  // В колонке шире 32 значок шапки стоял у левого края, а значки строк —
  // по центру.
  it("обёртка значка центрирует его, как в теле", () => {
    render(
      <Head>
        <TableHeadCell type="icon" icon={<svg data-testid="glyph" />} />
      </Head>
    )
    const wrapper = document.querySelector('[data-testid="glyph"]')!.parentElement!
    expect(wrapper.className).toContain("justify-center")
  })
})
