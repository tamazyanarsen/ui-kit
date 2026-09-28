import * as React from "react"

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

interface PinnedCellState {
  /** Отступ `left` или `right` для липкой ячейки, в пикселях. */
  offset: number
  /** Истинно у ячейки на внутреннем крае своего закреплённого блока — это
   * она несёт тень, чтобы закреп из нескольких колонок отбрасывал одну. */
  edge: boolean
}

/**
 * Измеряет липкий отступ закреплённой ячейки по её же соседям.
 *
 * `offsetLeft` здесь ненадёжен (в некоторых движках залипшая ячейка
 * сообщает уже смещённую коробку, и это подмешалось бы в её собственный
 * отступ), поэтому отступ складывается из ширин тех ячеек, мимо которых
 * закреплённый блок заякорен: всех предшествующих для левого закрепа и всех
 * последующих для правого. Это работает, потому что закреплённые блоки в
 * макете всегда идут сплошными отрезками в начале и в конце строки.
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
          // Дробная ширина, а не `offsetWidth`: округлённое целое
          // оставляет между двумя соседними закреплёнными ячейками
          // субпиксельный зазор, сквозь который прокручиваемые колонки
          // просвечивают полоской в 1px.
          offset += sibling.getBoundingClientRect().width
          sibling = sibling.previousElementSibling as HTMLElement | null
        }
        const next = el.nextElementSibling as HTMLElement | null
        edge = !next || next.dataset.pin !== "left"
      } else {
        let sibling = el.nextElementSibling as HTMLElement | null
        while (sibling) {
          // Дробная ширина, а не `offsetWidth`: округлённое целое
          // оставляет между двумя соседними закреплёнными ячейками
          // субпиксельный зазор, сквозь который прокручиваемые колонки
          // просвечивают полоской в 1px.
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

    // Наблюдаем за каждой ячейкой строки: изменение ширины любой колонки
    // впереди или позади этой сдвигает её. Состав строки тоже отслеживается:
    // включили `selectable` или переставили колонки — у старых соседей
    // размер не меняется, и без этого отступ оставался прежним, а закреп
    // наезжал на колонку чекбоксов.
    const observer = new ResizeObserver(measure)
    const row = el.parentElement
    const observeRow = () => {
      observer.disconnect()
      if (row) {
        for (const child of Array.from(row.children)) observer.observe(child)
      }
    }
    observeRow()
    const mutations = new MutationObserver(() => {
      observeRow()
      measure()
    })
    if (row) mutations.observe(row, { childList: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
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
