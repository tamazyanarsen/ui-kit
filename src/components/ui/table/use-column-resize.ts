import * as React from "react"

import { CONTROL_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from "./geometry"
import type { TableHeadCellType } from "./types"

interface ColumnResizeOptions {
  type: TableHeadCellType
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

    const onMove = (moveEvent: PointerEvent) => {
      const next = Math.max(minWidth, startWidth + moveEvent.clientX - startX)
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
