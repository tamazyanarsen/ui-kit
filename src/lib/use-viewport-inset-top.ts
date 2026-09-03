import * as React from "react"

// Сколько ВЕРХНЕГО края вьюпорта занято закреплёнными узлами — прежде всего
// липкой шапкой страницы. Зеркало `useViewportInsetBottom`: живые узлы
// публикуют сюда занятую высоту, а всё, что липнет к верху, отсчитывает
// `top` от `--viewport-inset-top`, а не от нуля.
//
// Зачем это нужно: липкая шапка ТАБЛИЦЫ прилипает к верху вьюпорта, а там
// уже стоит липкая шапка страницы — и строка заголовков уезжала под неё.
// Дефект был у ВСЕХ длинных таблиц сразу, а не у одного экрана, поэтому и
// чинится он здесь, в общем месте: `table[data-sticky-header] thead th`
// берёт этот отступ по умолчанию (см. styles/base.css), и странице ничего
// не нужно передавать в таблицу руками.
//
// Тонкости те же, что у нижнего варианта: величина МЕРЯЕТСЯ (шапка растёт от
// содержимого — ряд навигации может быть скрыт), и меряется именно
// ПЕРЕКРЫТИЕ вьюпорта, а не высота узла.

const VARIABLE = "--viewport-inset-top"

const bars = new Map<symbol, number>()

function publish() {
  const inset = bars.size === 0 ? 0 : Math.max(0, ...bars.values())
  document.documentElement.style.setProperty(VARIABLE, `${Math.round(inset)}px`)
}

/**
 * Публикует перекрытие верхнего края вьюпорта этим узлом в
 * `--viewport-inset-top` на `<html>`.
 *
 * @param ref  сам закреплённый узел
 * @param active выключено — вклад узла снимается
 */
export function useViewportInsetTop(
  ref: React.RefObject<HTMLElement | null>,
  active = true
) {
  const id = React.useRef<symbol>(undefined as unknown as symbol)
  if (id.current === undefined) id.current = Symbol("top-bar")

  React.useLayoutEffect(() => {
    const key = id.current
    const element = ref.current
    if (!active || !element) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const overlap = Math.min(rect.height, Math.max(0, rect.bottom))
      const previous = bars.get(key)
      if (previous === overlap) return
      bars.set(key, overlap)
      publish()
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true, capture: true })
    window.addEventListener("resize", measure)
    const observer = new ResizeObserver(measure)
    observer.observe(element)

    return () => {
      window.removeEventListener("scroll", measure, { capture: true })
      window.removeEventListener("resize", measure)
      observer.disconnect()
      bars.delete(key)
      publish()
    }
  }, [ref, active])
}
