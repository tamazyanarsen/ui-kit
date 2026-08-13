import * as React from "react"

// Column pinning — "Прокрутки и закрепления" (Проектирование таблиц ЕЛК,
// node 70279:7616). The spec pins a table on three sides:
//
//   • the header row (always, once it reaches the top of the viewport),
//   • the leading columns (situational, "сохранять в поле зрения первые
//     столбцы для таблиц с большим количеством столбцов"),
//   • the trailing action column (situational, "Действия всегда размещаются
//     с правой стороны — независимо от того, поместился ли остальной контент
//     по горизонтали").
//
// All three are `position: sticky` on the cells themselves rather than
// overlay layers: a real `<table>` keeps its column widths in one shared
// layout, so a floated copy of the pinned columns would have to be measured
// and re-synced on every resize.
//
// The horizontal scrollbar "располагается между закреплёнными столбцами",
// and each pinned block casts the kit's Universal shadow *only while there
// is content hidden behind it* — "Если горизонтальная прокрутка находится в
// крайнем левом положении — не отображается левая подложка с тенью. Если в
// крайнем правом положении — не отображается правая подложка".

type TablePin = "left" | "right"

interface TableScrollState {
  /** Scrolled off the left edge, so the left pinned block covers content. */
  scrolledFromStart: boolean
  /** Not yet at the right edge, so the right pinned block covers content. */
  scrolledFromEnd: boolean
}

const TableScrollContext = React.createContext<TableScrollState>({
  scrolledFromStart: false,
  scrolledFromEnd: false,
})

function useTableScrollState(): TableScrollState {
  return React.useContext(TableScrollContext)
}

/** Tracks whether a scroll container has content hidden on either side. */
function useHorizontalScrollState(
  ref: React.RefObject<HTMLElement | null>
): TableScrollState {
  const [state, setState] = React.useState<TableScrollState>({
    scrolledFromStart: false,
    scrolledFromEnd: false,
  })

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      // 1px of slack: sub-pixel layout leaves `scrollLeft` a fraction short
      // of the true maximum, which would keep the right shadow permanently
      // lit at the end of the track.
      const max = el.scrollWidth - el.clientWidth
      setState((prev) => {
        const next = {
          scrolledFromStart: el.scrollLeft > 1,
          scrolledFromEnd: max > 1 && el.scrollLeft < max - 1,
        }
        return prev.scrolledFromStart === next.scrolledFromStart &&
          prev.scrolledFromEnd === next.scrolledFromEnd
          ? prev
          : next
      })
    }

    measure()
    el.addEventListener("scroll", measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      el.removeEventListener("scroll", measure)
      observer.disconnect()
    }
  }, [ref])

  return state
}

interface PinnedCellState {
  /** `left`/`right` inset for the sticky cell, in px. */
  offset: number
  /** True on the cell at the inner edge of its pinned block — the one that
   * carries the shadow, so a multi-column pin casts a single shadow. */
  edge: boolean
}

/**
 * Measures a pinned cell's sticky inset from its own siblings.
 *
 * `offsetLeft` is unreliable here (a stuck cell reports its shifted box in
 * some engines, which would feed back into its own offset), so the inset is
 * summed from the widths of the cells the pinned block is anchored past —
 * everything before it for a left pin, everything after it for a right pin.
 * That holds because the spec's pinned blocks are always contiguous runs at
 * the start and end of the row.
 */
function usePinnedCell<T extends HTMLTableCellElement>(
  pin: TablePin | undefined
): { ref: React.RefObject<T>; offset: number; edge: boolean } {
  const ref = React.useRef<T>(null)
  const [state, setState] = React.useState<PinnedCellState>({
    offset: 0,
    edge: true,
  })

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!pin || !el) return

    const measure = () => {
      let offset = 0
      let edge: boolean

      if (pin === "left") {
        let sibling = el.previousElementSibling as HTMLElement | null
        while (sibling) {
          // Fractional width, not `offsetWidth`: a rounded integer leaves a
          // sub-pixel gap between two adjacent pinned cells, through which
          // the scrolling columns show as a 1px sliver.
          offset += sibling.getBoundingClientRect().width
          sibling = sibling.previousElementSibling as HTMLElement | null
        }
        const next = el.nextElementSibling as HTMLElement | null
        edge = !next || next.dataset.pin !== "left"
      } else {
        let sibling = el.nextElementSibling as HTMLElement | null
        while (sibling) {
          // Fractional width, not `offsetWidth`: a rounded integer leaves a
          // sub-pixel gap between two adjacent pinned cells, through which
          // the scrolling columns show as a 1px sliver.
          offset += sibling.getBoundingClientRect().width
          sibling = sibling.nextElementSibling as HTMLElement | null
        }
        const previous = el.previousElementSibling as HTMLElement | null
        edge = !previous || previous.dataset.pin !== "right"
      }

      setState((prev) =>
        prev.offset === offset && prev.edge === edge ? prev : { offset, edge }
      )
    }

    measure()

    // Observe every cell in the row: a column resize anywhere ahead of (or
    // behind) this one moves it.
    const observer = new ResizeObserver(measure)
    const row = el.parentElement
    if (row) {
      for (const child of Array.from(row.children)) observer.observe(child)
    }
    return () => observer.disconnect()
  }, [pin])

  return { ref, offset: state.offset, edge: state.edge }
}

export {
  TableScrollContext,
  useTableScrollState,
  useHorizontalScrollState,
  usePinnedCell,
}
export type { TablePin, TableScrollState }
