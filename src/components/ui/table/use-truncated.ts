import * as React from "react"

/** Подсказка при обрезке: макет показывает подсказку с полным значением
 * всякий раз, когда текст ячейки подрезан («При наведении на усечённый текст
 * появляется подсказка с полным содержимым»). Перезамеряется при изменении
 * ширины колонки. */
function useTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [truncated, setTruncated] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    // Защита в +1px: субпиксельные метрики текста могут сделать
    // scrollWidth больше clientWidth даже у текста, который визуально
    // помещается (та же защита, что и у Input).
    setTruncated(el.scrollWidth > el.clientWidth + 1)
  }, [])

  // Два эффекта намеренно. Содержимое может измениться без изменения
  // размеров коробки, поэтому этот перезамеряет на каждую отрисовку
  // (запись того же самого булева значения прерывается до повторной
  // отрисовки React, так что зацикливания быть не может)...
  React.useLayoutEffect(measure)

  // ...а коробка может изменить размер без отрисовки — перетаскивание
  // границы колонки не перерисовывает ячейки тела, — поэтому этот следит за
  // размером и заводится один раз, а не разбирается и собирается заново для
  // каждой ячейки на каждую отрисовку таблицы.
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  return { ref, truncated }
}

export { useTruncated }
