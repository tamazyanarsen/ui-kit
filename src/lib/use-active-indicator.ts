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
 */
interface ActiveIndicatorRect {
  left: number
  width: number
  /** Активный сегмент найден в ряду (а не спрятан за многоточием). */
  visible: boolean
  /** Первый замер уже прошёл — можно анимировать. */
  ready: boolean
}

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
    if (!row || activeValue === undefined) {
      setRect((prev) => ({ ...prev, visible: false }))
      return
    }
    // Выбор по `data-value`, а не по индексу: за многоточием часть сегментов
    // отсутствует в разметке, и индекс активного в `items` не совпадает с его
    // позицией в ряду.
    const node = row.querySelector<HTMLElement>(
      `:scope > [data-value="${CSS.escape(activeValue)}"]`
    )
    if (!node) {
      setRect((prev) => ({ ...prev, visible: false, ready: true }))
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
      prev.left === left && prev.width === width && prev.visible && prev.ready
        ? prev
        : { left, width, visible: true, ready: true }
    )
  }, [activeValue])

  // `useLayoutEffect` — замер до отрисовки, иначе первый кадр показывал бы
  // бегунок в нулевой позиции, и «неанимированный» первый замер всё равно
  // моргал бы.
  React.useLayoutEffect(() => {
    measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps])

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
