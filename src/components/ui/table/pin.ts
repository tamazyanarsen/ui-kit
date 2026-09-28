import * as React from "react"

import { registerPinnedCell, type PinnedCellState } from "./pin-registry"

// Закрепление колонок — раздел «Прокрутки и закрепления» документа
// «Проектирование таблиц ЕЛК». Макет закрепляет таблицу с трёх сторон:
//
//   • строка шапки (всегда, как только доходит до верха вьюпорта),
//   • ведущие колонки (по ситуации, «сохранять в поле зрения первые
//     столбцы для таблиц с большим количеством столбцов»),
//   • замыкающая колонка действий (по ситуации, «Действия всегда размещаются
//     с правой стороны — независимо от того, поместился ли остальной контент
//     по горизонтали»).
//
// Все три сделаны через `position: sticky` на самих ячейках, а не
// наложенными слоями: у настоящей `<table>` ширины колонок живут в одной
// общей раскладке, поэтому всплывающую копию закреплённых колонок
// приходилось бы замерять и пересинхронизировать на каждое изменение
// размера.
//
// Горизонтальная полоса прокрутки «располагается между закреплёнными
// столбцами», а каждый закреплённый блок отбрасывает универсальную тень
// кита *только пока за ним действительно скрыто содержимое*: «Если
// горизонтальная прокрутка находится в крайнем левом положении — не
// отображается левая подложка с тенью. Если в крайнем правом положении — не
// отображается правая подложка».

type TablePin = "left" | "right"

interface TableScrollState {
  /** Прокручено от левого края, поэтому левый закреплённый блок перекрывает содержимое. */
  scrolledFromStart: boolean
  /** Правый край ещё не достигнут, поэтому правый закреплённый блок перекрывает содержимое. */
  scrolledFromEnd: boolean
}

const TableScrollContext = React.createContext<TableScrollState>({
  scrolledFromStart: false,
  scrolledFromEnd: false,
})

function useTableScrollState(): TableScrollState {
  return React.useContext(TableScrollContext)
}

/** Следит, скрыто ли у контейнера прокрутки содержимое с какой-либо стороны. */
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
      // Запас в 1px: из-за субпиксельной раскладки `scrollLeft` не
      // дотягивает до истинного максимума на доли пикселя, и правая тень
      // горела бы постоянно даже в самом конце дорожки.
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
    // Наблюдаются окно и КАЖДЫЙ его ребёнок, а состав детей отслеживается.
    // Раньше смотрели только на `firstElementChild`: у ленты сводки это
    // первая пара (или `null` при пустом `items`), и пары, приехавшие
    // позже, ширину окна не меняли — стрелка «вперёд» так и не появлялась.
    const observer = new ResizeObserver(measure)
    const observeAll = () => {
      observer.disconnect()
      observer.observe(el)
      for (const child of Array.from(el.children)) observer.observe(child)
    }
    observeAll()
    const mutations = new MutationObserver(() => {
      observeAll()
      measure()
    })
    mutations.observe(el, { childList: true })
    return () => {
      el.removeEventListener("scroll", measure)
      observer.disconnect()
      mutations.disconnect()
    }
  }, [ref])

  return state
}

/**
 * Липкий отступ закреплённой ячейки и признак края её блока.
 *
 * Замер и наблюдение — в реестре таблицы (`pin-registry.ts`): один
 * наблюдатель на таблицу, а не пара на каждую закреплённую ячейку каждой
 * строки. Работает, потому что закреплённые блоки в макете всегда идут
 * сплошными отрезками в начале и в конце строки.
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
    return registerPinnedCell(el, pin, (next) =>
      setState((prev) =>
        prev.offset === next.offset && prev.edge === next.edge ? prev : next
      )
    )
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
