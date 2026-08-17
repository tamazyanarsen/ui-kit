import * as React from "react"

// Сколько нижнего края вьюпорта занято закреплёнными полосами — Button Menu
// (88) и Button Menu Black (72). Живые полосы публикуют сюда свою занятую
// высоту, а всё, что липнет к низу, отсчитывает `inset-block-end` от
// `--viewport-inset-bottom`, а не от нуля.
//
// Зачем это нужно: горизонтальная полоса прокрутки таблицы прижата к низу
// экрана, а панель массовых действий поднимается ровно при выборе строк.
// Наивно у них один и тот же якорь — и полоса прокрутки пропадала бы под
// панелью именно тогда, когда таблицей активно пользуются.
//
// Две тонкости:
//  • величина МЕРЯЕТСЯ, а не берётся из токена: панель задана через
//    `min-height` и растёт от содержимого;
//  • меряется именно ПЕРЕКРЫТИЕ вьюпорта, а не высота панели. Панель у нас
//    `sticky`, а не `fixed` (она обязана упираться в низ своего контейнера, а
//    не в край экрана), поэтому она перекрывает низ экрана не всегда — а
//    только пока её контейнер уходит вниз за границу вьюпорта.

const VARIABLE = "--viewport-inset-bottom"

/** Все живые полосы и их вклад. Максимум из них и есть занятая высота: две
 * полосы одновременно стоят друг на друге, а не складываются. */
const bars = new Map<symbol, number>()

function publish() {
  const inset = bars.size === 0 ? 0 : Math.max(0, ...bars.values())
  document.documentElement.style.setProperty(VARIABLE, `${Math.round(inset)}px`)
}

/**
 * Публикует перекрытие нижнего края вьюпорта этим узлом в
 * `--viewport-inset-bottom` на `<html>`.
 *
 * @param ref  сама полоса
 * @param active выключено — вклад узла снимается (полоса не закреплена)
 */
export function useViewportInsetBottom(
  ref: React.RefObject<HTMLElement | null>,
  active = true
) {
  const id = React.useRef<symbol>(undefined as unknown as symbol)
  if (id.current === undefined) id.current = Symbol("bottom-bar")

  React.useLayoutEffect(() => {
    const key = id.current
    const element = ref.current
    if (!active || !element) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      // Перекрытие, а не высота: пока панель ещё не доехала до низа экрана
      // (её контейнер целиком в поле зрения), закрывать под ней нечего.
      const overlap = Math.min(
        rect.height,
        Math.max(0, window.innerHeight - rect.top)
      )
      const previous = bars.get(key)
      if (previous === overlap) return
      bars.set(key, overlap)
      publish()
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true, capture: true })
    window.addEventListener("resize", measure)
    // Панель растёт от содержимого — её собственный размер тоже наблюдаем.
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
