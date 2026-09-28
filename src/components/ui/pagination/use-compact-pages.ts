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
 * Не помещается ли полный ряд страниц в полосу пагинатора.
 *
 * Аудит r7: ряд номеров не переносится и не сжимается, и при `totalPages=20`
 * на ширине 375 «Следующая страница» уходила за правый край на 45px (в
 * `TableBlock` её обрезало). Макет Paginator описан только для десктопа,
 * поэтому раскладка там не меняется: сжатый список включается, лишь когда
 * полный ряд шире полосы.
 *
 * Ширина полного ряда запоминается, пока он на экране: в сжатом виде его не
 * измерить, а без неё не понять, когда полоса снова стала достаточно
 * широкой.
 *
 * ⚠️ Запомненная ширина верна, только пока не менялось число страниц и
 * размер: после смены режим сбрасывается в полный, и ряд перемеряется в том
 * же проходе раскладки (без мелькания). Раньше отбор, сузивший выдачу с 20
 * страниц до 5, оставлял «1 2 … 5» — сравнение шло со старой шириной ряда
 * на 20 страниц.
 */
function useCompactPages(
  rootRef: React.RefObject<HTMLElement | null>,
  listRef: React.RefObject<HTMLElement | null>,
  deps: { enabled: boolean; page: number; totalPages: number; size?: string }
) {
  const [compact, setCompact] = React.useState(false)
  const compactRef = React.useRef(compact)
  compactRef.current = compact
  const fullWidth = React.useRef(0)
  const { enabled, page, totalPages, size } = deps
  const shape = `${totalPages}|${size}`
  const measuredShape = React.useRef(shape)

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) {
      setCompact(false)
      return
    }
    if (measuredShape.current !== shape) {
      measuredShape.current = shape
      fullWidth.current = 0
      if (compactRef.current) {
        // Полный ряд отрисуется этим же сбросом, и следующий проход его
        // перемеряет.
        setCompact(false)
        return
      }
    }
    const check = () => {
      const list = listRef.current
      // Полоса не разложена (скрыта) — мерить нечего, режим не трогаем.
      if (!list || root.clientWidth === 0) return
      const style = getComputedStyle(root)
      const available =
        root.clientWidth -
        (parseFloat(style.paddingLeft) || 0) -
        (parseFloat(style.paddingRight) || 0)
      if (!compactRef.current) fullWidth.current = list.getBoundingClientRect().width
      // Полпикселя допуска — дробные ширины кнопок не должны качать режим.
      setCompact(fullWidth.current > available + 0.5)
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(root)
    return () => observer.disconnect()
  }, [rootRef, listRef, enabled, page, shape, compact])

  return compact
}

export { getCompactPageList, useCompactPages }
