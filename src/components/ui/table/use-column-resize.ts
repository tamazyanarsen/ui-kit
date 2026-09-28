import * as React from "react"

import {
  CONTROL_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  MIN_SCROLLABLE_REST,
  ROW_EDGE_PADDING,
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
  /** Управляемая ширина. Неуправляемая, если задан только `defaultWidth`. */
  width?: number
  defaultWidth?: number
  onWidthChange?: (width: number) => void
  /**
   * Итог жеста — один раз, при отпускании. В отличие от `onWidthChange`
   * (на каждый `pointermove`) не будит вызывающего на каждом пикселе.
   */
  onWidthCommit?: (width: number) => void
  minWidth?: number
  /** Первая колонка строки: в её коробке лежит ещё и поле строки. */
  edge?: boolean
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
  onWidthCommit,
  minWidth = MIN_COLUMN_WIDTH,
  edge = false,
}: ColumnResizeOptions) {
  const [uncontrolledWidth, setUncontrolledWidth] = React.useState(defaultWidth)
  // Ширина ВО ВРЕМЯ жеста — своё состояние ячейки шапки. Перерисовывается
  // только она: при `table-layout: fixed` ширину столбца задаёт ячейка
  // первой строки, тело таблицы следует за ней само. Раньше каждый
  // `pointermove` уходил в модель DataTable и перерисовывал все ячейки
  // тела (300 строк × 5 шагов — 1500 вызовов `render`).
  const [dragWidth, setDragWidth] = React.useState<number | null>(null)
  // ⚠️ Родитель, который держит `width` И слушает каждое движение
  // (`onWidthChange`), управляет шириной и во время жеста: он вправе её
  // ограничить или отклонить, и ячейка обязана показать ЕГО число. Раньше
  // своя ширина жеста перебивала управляемую — колонка тянулась шире
  // предела родителя и отскакивала только при отпускании. Своя ширина
  // остаётся тому, кто ждёт лишь итог (`onWidthCommit`, так делает
  // DataTable), и неуправляемой ячейке.
  const liveControlled = width !== undefined && onWidthChange !== undefined
  const resolvedWidth =
    (liveControlled ? null : dragWidth) ??
    width ??
    uncontrolledWidth ??
    CONTROL_COLUMN_WIDTH[type]

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const cell = event.currentTarget.parentElement as HTMLElement | null
    if (!cell) return

    const startX = event.clientX
    // Замер коробки ячейки, а хранится ОБЪЯВЛЕННАЯ ширина: у первой колонки
    // в коробку входит поле строки (`edgeColumnWidth` прибавляет его при
    // отрисовке). Без вычета каждый захват границы — даже без движения —
    // расширял колонку на эти 8.
    const edgePadding = edge ? ROW_EDGE_PADDING : 0
    const startWidth = cell.offsetWidth - edgePadding
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    const pinnedMax = pin ? pinnedMaxWidth(cell) : null
    const maxWidth = pinnedMax === null ? null : pinnedMax - edgePadding

    let last: number | null = null
    const onMove = (moveEvent: PointerEvent) => {
      const dragged = Math.max(minWidth, startWidth + moveEvent.clientX - startX)
      const next = maxWidth === null ? dragged : Math.min(dragged, maxWidth)
      last = next
      setDragWidth(next)
      onWidthChange?.(next)
    }
    // Перетаскивание заканчивается не только отпусканием: системный жест
    // или потеря захвата присылают `pointercancel` / `lostpointercapture`.
    // Без них `pointermove` оставался висеть на ручке, и следующее движение
    // над ней БЕЗ нажатия продолжало менять ширину колонки.
    let finished = false
    const onUp = () => {
      // `pointerup` и следом `lostpointercapture` — один конец жеста.
      if (finished) return
      finished = true
      // Итог — в состояние (неуправляемая) и наружу одним вызовом; снятие
      // `dragWidth` в том же обработчике, то есть в той же пачке обновлений:
      // промежуточного кадра со старой шириной нет. Управляемую ширину,
      // которую родитель не принял, ячейка после этого честно возвращает.
      if (last !== null) {
        if (width === undefined) setUncontrolledWidth(last)
        onWidthCommit?.(last)
      }
      setDragWidth(null)
      handle.removeEventListener("pointermove", onMove)
      handle.removeEventListener("pointerup", onUp)
      handle.removeEventListener("pointercancel", onUp)
      handle.removeEventListener("lostpointercapture", onUp)
      if (handle.hasPointerCapture?.(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId)
      }
    }
    handle.addEventListener("pointermove", onMove)
    handle.addEventListener("pointerup", onUp)
    handle.addEventListener("pointercancel", onUp)
    handle.addEventListener("lostpointercapture", onUp)
  }

  return { resolvedWidth, startResize }
}

export { useColumnResize }
