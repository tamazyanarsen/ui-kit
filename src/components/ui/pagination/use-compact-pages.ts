import * as React from "react"

/**
 * Сжатый список страниц для узкой полосы: первая, текущая и последняя, между
 * ними многоточие. «1 … т … последняя» — пять ячеек вместо семи. У края
 * добавляется соседняя страница («1 2 … последняя»): ячеек всё равно не
 * больше пяти, а следующая страница остаётся под рукой.
 */
function getCompactPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  const edge = page <= 1 ? [2] : page >= totalPages ? [totalPages - 1] : []
  const anchors = [...new Set([1, page, totalPages, ...edge])]
    .filter((entry) => entry >= 1 && entry <= totalPages)
    .sort((a, b) => a - b)
  const list: (number | "ellipsis")[] = []
  anchors.forEach((entry, index) => {
    const previous = anchors[index - 1]
    // Многоточие вместо ОДНОЙ страницы (36px против кнопки 44) места почти не
    // экономит, а переход в один клик отнимает: «1 … 3» было «1 2 3» без
    // второй страницы. Полный список `getPageList` так никогда не делает.
    if (previous !== undefined && entry - previous === 2) list.push(previous + 1)
    if (previous !== undefined && entry - previous > 2) list.push("ellipsis")
    list.push(entry)
  })
  return list
}

/**
 * Самый узкий список: текущая и последняя страница («‹ 10 … 20 ›»), на
 * последней — первая и последняя. Аудит 20: на телефоне 320 (полоса 256)
 * даже «‹ 1 … т … N ›» — это 300px, и «Следующая страница» уходила за край.
 * Ячейки те же, что у сжатого списка, новых форм нет.
 */
function getMinimalPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  const anchors = page >= totalPages ? [1, totalPages] : [page, totalPages]
  const list: (number | "ellipsis")[] = []
  ;[...new Set(anchors)].forEach((entry, index, all) => {
    const previous = all[index - 1]
    if (previous !== undefined && entry - previous === 2) list.push(previous + 1)
    if (previous !== undefined && entry - previous > 2) list.push("ellipsis")
    list.push(entry)
  })
  return list
}

/** 0 — полный ряд, 1 — сжатый, 2 — самый узкий. */
type CompactLevel = 0 | 1 | 2

/**
 * Какой список страниц помещается в полосу пагинатора.
 *
 * Аудит r7: ряд номеров не переносится и не сжимается, и при `totalPages=20`
 * на ширине 375 «Следующая страница» уходила за правый край на 45px (в
 * `TableBlock` её обрезало). Макет Paginator описан только для десктопа,
 * поэтому раскладка там не меняется: сжатие включается, лишь когда полный
 * ряд шире полосы. Аудит 20: на 320 не помещался и сжатый — добавлен
 * третий, самый узкий уровень.
 *
 * Ширина каждого уровня запоминается, пока он на экране: в более узком виде
 * её не измерить, а без неё не понять, когда полоса снова стала достаточно
 * широкой.
 *
 * ⚠️ Запомненные ширины верны только для той же формы ряда: числа страниц,
 * размера и ТЕКУЩЕЙ страницы (от неё зависят набор номеров и число цифр).
 * При смене уровень сбрасывается в полный и ряд перемеряется в тех же
 * проходах раскладки, до отрисовки (без мелькания). Раньше ширина
 * запоминалась без текущей страницы: после визита на 6000-ю страница 5
 * оставалась сжатой, хотя полный ряд помещался; а отбор, сузивший выдачу с
 * 20 страниц до 5, оставлял «1 2 … 5».
 */
function useCompactPages(
  rootRef: React.RefObject<HTMLElement | null>,
  listRef: React.RefObject<HTMLElement | null>,
  deps: { enabled: boolean; page: number; totalPages: number; size?: string }
): CompactLevel {
  const [level, setLevel] = React.useState<CompactLevel>(0)
  const levelRef = React.useRef(level)
  levelRef.current = level
  // Ширины полного и сжатого ряда для текущей формы; 0 — ещё не мерили.
  const widths = React.useRef<[number, number]>([0, 0])
  const { enabled, page, totalPages, size } = deps
  const shape = `${totalPages}|${size}|${page}`
  const measuredShape = React.useRef(shape)
  const fontsDone = React.useRef(false)

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) {
      setLevel(0)
      return
    }
    if (measuredShape.current !== shape) {
      measuredShape.current = shape
      widths.current = [0, 0]
      if (levelRef.current !== 0) {
        // Полный ряд отрисуется этим же сбросом, и следующий проход его
        // перемеряет.
        setLevel(0)
        return
      }
    }
    const check = () => {
      const list = listRef.current
      // Полоса не разложена (скрыта, `display: none`) — мерить нечего, режим
      // не трогаем. Полоса, сжатая соседями до нуля, коробку имеет
      // (`getClientRects` непуст): там ряд обязан сжаться, а не остаться
      // полным и торчать за краем.
      const hasBox = root.getClientRects().length > 0
      if (!list || (root.clientWidth === 0 && !hasBox)) return
      const style = getComputedStyle(root)
      // Полпикселя допуска — дробные ширины кнопок не должны качать режим.
      const available =
        root.clientWidth -
        (parseFloat(style.paddingLeft) || 0) -
        (parseFloat(style.paddingRight) || 0) +
        0.5
      const current = levelRef.current
      const fits = (width: number) => width > 0 && width <= available
      if (current !== 2) widths.current[current] = list.getBoundingClientRect().width
      const [full, compact] = widths.current
      let next: CompactLevel = current
      if (current === 0) next = fits(full) ? 0 : 1
      else if (current === 1) next = fits(full) ? 0 : fits(compact) ? 1 : 2
      else if (fits(compact)) next = fits(full) ? 0 : 1
      if (next !== current) setLevel(next)
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(root)
    // Object Sans грузится асинхронно и меняет ширину ряда, а полоса при этом
    // не меняется — наблюдатель молчит. Запомненные ширины сняты со шрифта
    // запасной гарнитуры, поэтому со шрифтом они сбрасываются, и ряд
    // перемеряется с полного вида.
    // Один раз на жизнь хука: эффект перезапускается на каждой смене уровня,
    // а уже разрешённый `ready` сработал бы снова и зациклил бы сброс.
    let alive = true
    if (!fontsDone.current) void document.fonts?.ready.then(() => {
      if (!alive) return
      fontsDone.current = true
      widths.current = [0, 0]
      if (levelRef.current !== 0) setLevel(0)
      else check()
    })
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [rootRef, listRef, enabled, shape, level])

  return level
}

export { getCompactPageList, getMinimalPageList, useCompactPages }
export type { CompactLevel }
