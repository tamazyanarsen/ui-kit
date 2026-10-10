import * as React from "react"

import { observeSize } from "@/lib/observe-size"

/**
 * Подсказка при обрезке: макет показывает подсказку с полным значением
 * всякий раз, когда текст ячейки подрезан («При наведении на усечённый текст
 * появляется подсказка с полным содержимым»). Перезамеряется при изменении
 * ширины колонки.
 *
 * Ревью 10.10, КК-3: хук стоит в каждой ячейке Text/Number/Tag, и прежний
 * вариант на каждую отрисовку таблицы читал раскладку во всех ячейках
 * (`useLayoutEffect` без зависимостей), а каждая ячейка держала свой
 * `ResizeObserver`. 300 строк × 8 колонок и один клик по флажку — ~2400
 * синхронных замеров и столько же живых наблюдателей. Теперь:
 *
 *  • замер по отрисовке — только когда сменилось то, что показывает узел
 *    (`deps`: текст, знак, пояснение);
 *  • размер узла слушает один общий наблюдатель (`lib/observe-size`);
 *  • `ref` — callback: ячейка, обёрнутая подсказкой только при обрезке,
 *    перемонтирует измеряемый узел, и хук обязан подхватить новый.
 *
 * @param deps то, что показывает узел, — при смене любого из значений замер
 *   повторяется. Число значений у одного места вызова постоянно.
 */
function useTruncated<T extends HTMLElement>(deps: React.DependencyList = []) {
  const [node, setNode] = React.useState<T | null>(null)
  const [truncated, setTruncated] = React.useState(false)

  const measure = React.useCallback(() => {
    if (!node) return
    // Защита в +1px: субпиксельные метрики текста могут сделать
    // scrollWidth больше clientWidth даже у текста, который визуально
    // помещается (та же защита, что и у Input).
    setTruncated(node.scrollWidth > node.clientWidth + 1)
  }, [node])

  // Содержимое сменилось при той же коробке — наблюдатель размера молчит.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useLayoutEffect(measure, [measure, ...deps])

  // Коробка может изменить размер без отрисовки — перетаскивание границы
  // колонки не перерисовывает ячейки тела.
  React.useLayoutEffect(() => (node ? observeSize(node, measure) : undefined), [node, measure])

  // Шрифт: Object Sans грузится асинхронно и меняет ширину текста при той
  // же коробке — наблюдатель молчит, отрисовки нет, и ячейка навсегда
  // оставалась бы с признаком, снятым со шрифта запасной гарнитуры.
  React.useEffect(() => {
    let alive = true
    void document.fonts?.ready.then(() => {
      if (alive) measure()
    })
    return () => {
      alive = false
    }
  }, [measure])

  return { ref: setNode as React.RefCallback<T>, truncated }
}

export { useTruncated }
