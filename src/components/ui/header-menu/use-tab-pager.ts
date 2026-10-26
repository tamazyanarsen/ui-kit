import * as React from "react"

// Лента вкладок мобильного меню на нативной горизонтальной прокрутке
// (Правки UI-Kit от 25.10). Вкладки лежат рядом страницами во всю ширину
// ленты с привязкой (`scroll-snap`); палец тащит содержимое, соседняя
// вкладка въезжает сбоку, отпустил — браузер доводит до ближайшей.
//
// Хук ведёт три величины:
//   • `progress` — положение ленты в страницах (0 — первая, 1 — вторая);
//   • активную вкладку — ту, что занимает больше половины ленты; пока лента
//     сама едет к вкладке после нажатия на заголовок, активна цель (иначе
//     заголовок мигнул бы назад на первой половине пути);
//   • высоту ленты — по текущей вкладке, а на время листания по большей из
//     страниц, чтобы ничего не обрезалось.

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function useTabPager(count: number) {
  const pagerRef = React.useRef<HTMLDivElement>(null)
  const pageRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [progress, setProgress] = React.useState(0)
  // Цель листания после нажатия на заголовок или стрелку. Снимается, когда
  // лента до неё доехала или пользователь взялся за ленту сам.
  const [target, setTarget] = React.useState<number | null>(null)
  const [heights, setHeights] = React.useState<number[]>([])

  const onScroll = React.useCallback(() => {
    const pager = pagerRef.current
    if (!pager || pager.clientWidth === 0) return
    const next = pager.scrollLeft / pager.clientWidth
    setProgress(next)
    setTarget((current) =>
      current !== null && Math.abs(next - current) < 0.01 ? null : current
    )
  }, [])

  const release = React.useCallback(() => setTarget(null), [])

  const goTo = React.useCallback((index: number) => {
    const pager = pagerRef.current
    if (!pager) return
    setTarget(index)
    const left = index * pager.clientWidth
    // Без движения при `prefers-reduced-motion` — сразу на место.
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth"
    if (typeof pager.scrollTo === "function") pager.scrollTo({ left, behavior })
    else pager.scrollLeft = left
  }, [])

  // Высоты страниц — замером: содержимое вкладок меняется (избранное,
  // разделы, перенос строк по ширине экрана).
  React.useLayoutEffect(() => {
    const pages = pageRefs.current.slice(0, count).filter(
      (page): page is HTMLDivElement => page !== null
    )
    if (pages.length === 0 || typeof ResizeObserver !== "function") return
    const measure = () =>
      setHeights((previous) => {
        const next = pageRefs.current
          .slice(0, count)
          .map((page) => page?.offsetHeight ?? 0)
        return next.length === previous.length &&
          next.every((value, index) => value === previous[index])
          ? previous
          : next
      })
    measure()
    const observer = new ResizeObserver(measure)
    pages.forEach((page) => observer.observe(page))
    return () => observer.disconnect()
  }, [count])

  const nearest = Math.min(count - 1, Math.max(0, Math.round(progress)))
  const active = target ?? nearest
  const settled = target === null && Math.abs(progress - nearest) < 0.001
  const measured = heights.filter((value) => value > 0)
  const height =
    measured.length === 0
      ? undefined
      : settled
        ? heights[active] || undefined
        : Math.max(...measured)

  return {
    pagerRef,
    pageRefs,
    /** Положение ленты в страницах, 0…count−1. */
    progress: Math.min(count - 1, Math.max(0, progress)),
    active,
    height,
    goTo,
    onScroll,
    /** Пользователь взялся за ленту — цель листания больше не держим. */
    release,
  }
}

export { useTabPager }
