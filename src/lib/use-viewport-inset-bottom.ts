import * as React from "react"

import { useComposedRefs } from "@/lib/compose-refs"

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
 * Возвращает callback-ref, который вешается на саму полосу. Именно callback,
 * а не `RefObject`: узел полосы может смениться без смены пропсов хука
 * (Button Menu Black переносит панель в блок «кнопка + панель» и обратно,
 * React пересоздаёт её узел), и эффект на `[ref, active]` продолжал бы
 * мерить старый, уже снятый из DOM узел — публиковал бы 0 или высоту блока.
 * Узел в состоянии перезапускает замер ровно при смене узла.
 *
 * @param active выключено — вклад узла снимается (полоса не закреплена)
 * @param forwardedRef ref потребителя — получает тот же узел
 */
export function useViewportInsetBottom<T extends HTMLElement>(
  active = true,
  forwardedRef?: React.ForwardedRef<T>
): React.RefCallback<T> {
  const id = React.useRef<symbol>(undefined as unknown as symbol)
  if (id.current === undefined) id.current = Symbol("bottom-bar")

  const [element, setElement] = React.useState<T | null>(null)
  // Ref потребителя — в зависимостях склейки, а не в ref-хранилище: при его
  // смене React снимает старый callback (старый ref получает `null`) и
  // вешает новый (новый ref получает узел). Стабильный callback с ref
  // потребителя в `useRef` оставлял новый ref пустым до пересоздания узла.
  const ref = useComposedRefs<T>(setElement, forwardedRef)

  React.useLayoutEffect(() => {
    const key = id.current
    if (!active || !element) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      // Перекрытие, а не высота: пока панель ещё не доехала до низа экрана
      // (её контейнер целиком в поле зрения), закрывать под ней нечего.
      //
      // ⚠️ Считается только полоса, которая КАСАЕТСЯ нижнего края или уходит
      // за него. Прежняя формула отличала лишь «ниже экрана» от «не ниже», и
      // полоса посреди короткой страницы или прокрученная выше экрана
      // публиковала всю свою высоту: тосты и полоса прокрутки таблицы висели
      // с пустым зазором в 88px. Допуск в пиксель — на дробное округление
      // sticky-позиции.
      //
      // Низ видимой области — `visualViewport`, а без него `clientHeight`
      // корня. Не `innerHeight`: он включает горизонтальную полосу прокрутки
      // страницы, и на Windows sticky-панель `bottom: 0` стоит на 15–17px
      // выше — «не касалась низа» и публиковала 0 (сверено вживую:
      // innerHeight 900, clientHeight 885, низ панели 885). И не голый
      // `clientHeight`: на мобильных это высота с ПОКАЗАННОЙ адресной
      // строкой, а когда строка прячется, fixed-панель уезжает к новому
      // низу — `visualViewport` его знает. Ноль бывает только без раскладки
      // — тогда `innerHeight`.
      const viewport = window.visualViewport
      const visibleBottom =
        (viewport ? viewport.height + viewport.offsetTop : 0) ||
        document.documentElement.clientHeight ||
        window.innerHeight
      const touchesBottom = rect.bottom >= visibleBottom - 1
      const overlap = touchesBottom
        ? Math.min(rect.height, Math.max(0, visibleBottom - rect.top))
        : 0
      const previous = bars.get(key)
      if (previous === overlap) return
      bars.set(key, overlap)
      publish()
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true, capture: true })
    window.addEventListener("resize", measure)
    // Панель растёт от содержимого — её собственный размер тоже наблюдаем.
    //
    // ⚠️ И размер страницы с родителем панели: sticky-полоса начинает или
    // перестаёт касаться низа экрана, когда меняется высота содержимого над
    // ней (строки таблицы пришли асинхронно, фильтр оставил 0 строк), а ни
    // scroll, ни resize, ни размер самой полосы при этом не меняются. Без
    // этого прилипшая полоса публиковала 0 до первой прокрутки, а
    // оказавшаяся посреди экрана — свои 88px.
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    observer.observe(document.documentElement)
    if (document.body) observer.observe(document.body)
    if (element.parentElement) observer.observe(element.parentElement)

    return () => {
      window.removeEventListener("scroll", measure, { capture: true })
      window.removeEventListener("resize", measure)
      observer.disconnect()
      bars.delete(key)
      publish()
    }
  }, [element, active])

  return ref
}
