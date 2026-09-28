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
    if (previous !== undefined && entry - previous > 1) list.push("ellipsis")
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
 */
function useCompactPages(
  rootRef: React.RefObject<HTMLElement | null>,
  listRef: React.RefObject<HTMLElement | null>,
  deps: { enabled: boolean; page: number; totalPages: number }
) {
  const [compact, setCompact] = React.useState(false)
  const compactRef = React.useRef(compact)
  compactRef.current = compact
  const fullWidth = React.useRef(0)
  const { enabled, page, totalPages } = deps

  React.useLayoutEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) {
      setCompact(false)
      return
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
  }, [rootRef, listRef, enabled, page, totalPages, compact])

  return compact
}

export { getCompactPageList, useCompactPages }
