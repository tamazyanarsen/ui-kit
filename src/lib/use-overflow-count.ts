import * as React from "react"

// Shared by Tabs, Switcher and Header — all three specs describe the same
// "Show More" behavior: once the row doesn't fit, the trailing items move
// behind a "..." trigger that opens a dropdown.
//
// `itemRefs` must be attached to an *always-rendered, off-screen* copy of
// every item (see Tabs/Switcher's own "measure" row) rather than the
// visible row itself — items hidden behind the overflow trigger would
// otherwise report a width of 0 the next time this recomputes, permanently
// wrecking the count.
//
// ⚠️ Пересчёт обязан висеть на ТРЁХ источниках, и каждый закрывает свой
// способ соврать:
//
//  1. `ResizeObserver` на контейнере. Раньше здесь был только
//     `window.resize`, и контейнер, сузившийся без участия окна (раскрылся
//     соседний блок, приехала боковая панель, сменилась вёрстка страницы),
//     оставлял счёт нетронутым. Замер: контейнер табов 787 → 300px, счёт
//     остался 8 из 8, таба «Ещё» не появилось — табы просто торчали за
//     коробкой, и чинил это только настоящий resize окна.
//  2. `document.fonts.ready`. Object Sans грузится асинхронно, и до его
//     подхвата текст меряется fallback-метриками — строка у́же, «переполнения
//     нет». Компонент, который считает один раз в эффекте, фиксирует эту ложь
//     навсегда. Это сквозное правило проекта, а не частность табов.
//  3. Смена входных данных — число элементов, зарезервированная ширина, зазор.
//
// ⚠️ Ширины берутся `getBoundingClientRect().width`, а не `offsetWidth`:
// последний округляет до целого, и на ряду из десятка элементов ошибка
// копится в заметный сдвиг.
export function useOverflowCount(itemCount: number, reservedWidth: number, gap = 0) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])
  const [visibleCount, setVisibleCount] = React.useState(itemCount)

  const recompute = React.useCallback(() => {
    const container = containerRef.current
    if (!container || itemCount === 0) return

    const widthOf = (el: HTMLElement | null) =>
      el ? el.getBoundingClientRect().width : 0

    const fitsAll =
      itemRefs.current.slice(0, itemCount).reduce((sum, el) => sum + widthOf(el), 0) +
      gap * (itemCount - 1)
    const available = container.clientWidth

    if (fitsAll <= available) {
      setVisibleCount(itemCount)
      return
    }

    let used = reservedWidth
    let count = 0
    for (let i = 0; i < itemCount; i++) {
      used += widthOf(itemRefs.current[i])
      if (count > 0) used += gap
      if (used > available) break
      count++
    }
    setVisibleCount(Math.max(1, count))
  }, [itemCount, reservedWidth, gap])

  React.useLayoutEffect(() => {
    recompute()
    window.addEventListener("resize", recompute)
    return () => window.removeEventListener("resize", recompute)
  }, [recompute])

  // Контейнер может сузиться и без участия окна — см. пункт 1 выше.
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(recompute)
    observer.observe(container)
    return () => observer.disconnect()
  }, [recompute])

  // Ширины текста до прихода шрифта другие — см. пункт 2 выше.
  React.useEffect(() => {
    if (!document.fonts) return
    let alive = true
    void document.fonts.ready.then(() => {
      if (alive) recompute()
    })
    return () => {
      alive = false
    }
  }, [recompute])

  return { containerRef, itemRefs, visibleCount }
}
