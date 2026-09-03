import * as React from "react"

import {
  CONTROL_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  MIN_SCROLLABLE_REST,
} from "./geometry"
import type { TablePin } from "./pin"
import type { TableHeadCellType } from "./types"

/**
 * Предел ширины ЗАКРЕПЛЁННОЙ колонки: остаток под подвижные столбцы не
 * меньше {@link MIN_SCROLLABLE_REST}.
 *
 * Считается в момент начала перетаскивания, а не пропом: он зависит от
 * ширины окна прокрутки и от того, сколько уже занимают ОСТАЛЬНЫЕ ячейки
 * того же закрепа, — снаружи эти числа не известны.
 *
 * У обычной колонки предела нет: `null` означает «тяни сколько угодно».
 */
function pinnedMaxWidth(cell: HTMLElement): number | null {
  const container = cell.closest<HTMLElement>("[data-slot='table-container']")
  if (!container) return null
  const pinnedCells = Array.from(
    container.querySelectorAll<HTMLElement>("thead th[data-pin]")
  )
  const otherPinned = pinnedCells.reduce(
    (sum, other) => sum + (other === cell ? 0 : other.offsetWidth),
    0
  )
  return Math.max(
    MIN_COLUMN_WIDTH,
    container.clientWidth - otherPinned - MIN_SCROLLABLE_REST
  )
}

interface ColumnResizeOptions {
  type: TableHeadCellType
  /** Закреплённая колонка — только у неё есть верхний предел ширины. */
  pin?: TablePin
  /** Controlled width. Uncontrolled when only `defaultWidth` is given. */
  width?: number
  defaultWidth?: number
  onWidthChange?: (width: number) => void
  minWidth?: number
}

/**
 * Тянем правую границу ячейки — «при наведении на правую границу ячейки
 * курсор меняется на вертикальную черту с двунаправленной стрелкой».
 *
 * Ширина живёт либо у вызывающей стороны (`width`), либо внутри
 * (`defaultWidth`); если не задана ни та, ни другая — берётся фиксированная
 * ширина служебного столбца, см. {@link CONTROL_COLUMN_WIDTH}.
 */
function useColumnResize({
  type,
  pin,
  width,
  defaultWidth,
  onWidthChange,
  minWidth = MIN_COLUMN_WIDTH,
}: ColumnResizeOptions) {
  const [uncontrolledWidth, setUncontrolledWidth] = React.useState(defaultWidth)
  const resolvedWidth = width ?? uncontrolledWidth ?? CONTROL_COLUMN_WIDTH[type]

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const cell = event.currentTarget.parentElement as HTMLElement | null
    if (!cell) return

    const startX = event.clientX
    const startWidth = cell.offsetWidth
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    const maxWidth = pin ? pinnedMaxWidth(cell) : null

    const onMove = (moveEvent: PointerEvent) => {
      const dragged = Math.max(minWidth, startWidth + moveEvent.clientX - startX)
      const next = maxWidth === null ? dragged : Math.min(dragged, maxWidth)
      if (width === undefined) setUncontrolledWidth(next)
      onWidthChange?.(next)
    }
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove)
      handle.removeEventListener("pointerup", onUp)
      handle.releasePointerCapture(event.pointerId)
    }
    handle.addEventListener("pointermove", onMove)
    handle.addEventListener("pointerup", onUp)
  }

  return { resolvedWidth, startResize }
}

export { useColumnResize }
