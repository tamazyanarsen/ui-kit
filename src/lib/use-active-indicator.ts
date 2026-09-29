import * as React from "react"

/**
 * Замер положения активного сегмента для «бегунка» — общей полосы, которая
 * едет между вкладками (`Tabs`) и сегментами (`Switcher`).
 *
 * Дизайн-чек от 08.09, замечание 21: «Должна быть анимация горизонтального
 * сдвига признака активного сегмента. В свитчере ездит заливка, в Tabs ездит
 * чёрное подчёркивание».
 *
 * Почему хук, а не CSS-переход у каждого сегмента: перекрашивание двух разных
 * узлов — это не сдвиг. Ехать может только ОДИН узел, а значит его положение
 * надо измерить у активного сегмента и отдать в `style`. Переходы по `left` и
 * `width` браузер анимирует сам.
 *
 * Возвращаемый `ready` гасит анимацию на первом замере: без него бегунок при
 * монтировании выезжал бы из левого края к активной вкладке, хотя никто ничего
 * не переключал.
 *
 * ⚠️ `ready` включается не в том же коммите, что и первые координаты, а
 * кадром позже. Переход браузер берёт из стиля ПОСЛЕ изменения: если класс
 * перехода и новые `left`/`width` приходят вместе, а замер `offsetLeft` уже
 * заставил браузер посчитать бегунок в нулевой позиции, ширина всё равно
 * выезжает от 0 (поймано в Chromium: `transitionrun` width 0 → 92px на
 * загрузке Switcher).
 */
interface ActiveIndicatorRect {
  left: number
  width: number
  /** Активный сегмент найден в ряду (а не спрятан за многоточием). */
  visible: boolean
  /** Бегунок уже отрисован на своём месте — можно анимировать. */
  ready: boolean
}

/**
 * Бегунок без активного сегмента в ряду (спрятан за многоточием или значения
 * нет): координаты обнуляются, а не остаются от прошлого замера. Аудит 20:
 * первый замер делается, пока видны все сегменты, и прозрачный бегунок
 * оставался на `left` 1625px — абсолютный элемент за краем ряда входил в
 * ширину прокрутки документа, и страница получала горизонтальную прокрутку.
 * `ready` сбрасывается тоже: когда сегмент снова виден, бегунок встаёт на
 * место без анимации (выезжать ему не из чего), а переход включается кадром
 * позже, как при монтировании.
 */
const hide = (prev: ActiveIndicatorRect): ActiveIndicatorRect =>
  prev.visible || prev.ready || prev.left !== 0 || prev.width !== 0
    ? { left: 0, width: 0, visible: false, ready: false }
    : prev

function useActiveIndicator<T extends HTMLElement>(
  activeValue: string | undefined,
  /**
   * Значения, при смене которых ряд мог перестроиться, — состав видимых
   * сегментов, размер, признак переполнения. Позиция бегунка от них зависит
   * ровно так же, как от самого активного значения.
   */
  deps: React.DependencyList = []
) {
  const rowRef = React.useRef<T>(null)
  const [rect, setRect] = React.useState<ActiveIndicatorRect>({
    left: 0,
    width: 0,
    visible: false,
    ready: false,
  })

  const measure = React.useCallback(() => {
    const row = rowRef.current
    // ⚠️ Во всех ветках — возврат прежнего объекта, если ничего не
    // изменилось. Иначе при не найденном активном сегменте каждый замер давал
    // новый объект, а эффект замера перезапускался от пересоздаваемых `deps`
    // — и рендеры не останавливались («Maximum update depth exceeded»).
    if (!row || activeValue === undefined) {
      setRect(hide)
      return
    }
    // Выбор по `data-value`, а не по индексу: за многоточием часть сегментов
    // отсутствует в разметке, и индекс активного в `items` не совпадает с его
    // позицией в ряду.
    const node = row.querySelector<HTMLElement>(
      `:scope > [data-value="${CSS.escape(activeValue)}"]`
    )
    if (!node) {
      setRect(hide)
      return
    }
    const left = node.offsetLeft
    const width = node.offsetWidth
    // ⚠️ Сравнение обязательно: ResizeObserver ниже следит и за самим
    // бегунком, а бегунок меняет ширину именно от этого состояния. Без
    // проверки каждое измерение возвращало бы НОВЫЙ объект, React считал бы
    // состояние изменившимся и перерисовывал бы ряд вхолостую на каждый кадр
    // наблюдателя.
    setRect((prev) =>
      prev.left === left && prev.width === width && prev.visible
        ? prev
        : { left, width, visible: true, ready: prev.ready }
    )
  }, [activeValue])

  // `useLayoutEffect` — замер до отрисовки, иначе первый кадр показывал бы
  // бегунок в нулевой позиции, и «неанимированный» первый замер всё равно
  // моргал бы.
  React.useLayoutEffect(() => {
    measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps])

  // Анимация включается кадром позже первой отрисовки на месте — см. шапку.
  const positioned = rect.visible
  React.useEffect(() => {
    if (!positioned || rect.ready) return
    const frame = requestAnimationFrame(() =>
      setRect((prev) => (prev.ready ? prev : { ...prev, ready: true }))
    )
    return () => cancelAnimationFrame(frame)
  }, [positioned, rect.ready])

  // Ряд меняет ширину не только при смене вьюпорта: сегмент со счётчиком
  // растёт вместе с числом, а шрифт приезжает позже первой отрисовки.
  React.useEffect(() => {
    const row = rowRef.current
    if (!row || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => measure())
    observer.observe(row)
    // ⚠️ Наблюдаем ТОЛЬКО сегменты (`data-value`), а сам бегунок — нет.
    // Его размер задаёт этот же хук: наблюдение за ним замыкало круг
    // «измерил → переставил бегунок → наблюдатель увидел → измерил снова», и
    // браузер писал в консоль «ResizeObserver loop completed with undelivered
    // notifications» (поймано сплошным прогоном историй на реестре заявок).
    // Сравнение значений внутри `measure` гасит лишний рендер, но саму
    // доставку уведомления — уже нет.
    for (const child of Array.from(row.children)) {
      if (child instanceof HTMLElement && child.dataset.value !== undefined) {
        observer.observe(child)
      }
    }
    return () => observer.disconnect()
  }, [measure])

  return { rowRef, ...rect }
}

export { useActiveIndicator }
export type { ActiveIndicatorRect }
