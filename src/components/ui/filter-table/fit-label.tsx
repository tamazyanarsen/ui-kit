import * as React from "react"

import { observeSize } from "@/lib/observe-size"

/** Предел ширины чипа фильтра — «максимальная ширина 256 px» из правил триггера. */
const PILL_MAX_WIDTH = 256

/**
 * Подпись выбранного фильтра, которая сама выбирает между полной и короткой
 * формой.
 *
 * Правки UI-Kit от 25.10, FilterRange: «Доступный лимит: 3 000 – 300 000 ₽»,
 * если название помещается, и «3 000 – 300 000 ₽» — если нет. Многоточие в
 * середине суммы хуже потерянного названия: сумма — то, ради чего фильтр
 * вообще смотрят.
 *
 * ⚠️ Решение — по ЕСТЕСТВЕННОЙ ширине полной подписи (невидимый двойник), а
 * не по `scrollWidth` показанной: после перехода на короткую форму чип
 * сужается, и замер по показанному тексту качался бы между формами на каждом
 * изменении размера. Место под подпись = min(256, ширина родителя чипа)
 * минус всё остальное в чипе (поля, крестик, зазоры) — оно от формы подписи
 * не зависит, поэтому выбор устойчив.
 */
function FitLabel({
  full,
  short,
}: {
  full: React.ReactNode
  short: React.ReactNode
}) {
  const shownRef = React.useRef<HTMLSpanElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const [fits, setFits] = React.useState(true)

  React.useLayoutEffect(() => {
    const shown = shownRef.current
    const measure = measureRef.current
    // Чип — ближайший `data-slot="filter"`: элемент вызова рисует примитив
    // Base UI через `render`, и свой ref на нём ненадёжен.
    const pill = shown?.closest<HTMLElement>('[data-slot="filter"]')
    if (!pill || !shown || !measure) return
    const wrapper = pill.parentElement
    const container = wrapper?.parentElement

    function check() {
      if (!pill || !shown || !measure) return
      const style = container ? getComputedStyle(container) : null
      const containerWidth = container
        ? container.clientWidth -
          parseFloat(style?.paddingLeft || "0") -
          parseFloat(style?.paddingRight || "0")
        : PILL_MAX_WIDTH
      const cap = Math.min(PILL_MAX_WIDTH, containerWidth || PILL_MAX_WIDTH)
      const chrome = pill.offsetWidth - shown.offsetWidth
      setFits(measure.offsetWidth <= cap - chrome)
    }

    check()
    return container ? observeSize(container, check) : undefined
  })

  return (
    <>
      <span ref={shownRef} data-slot="filter-label" className="min-w-0 truncate">
        {fits ? full : short}
      </span>
      {/* Двойник — в коробке 0×0 с обрезкой: невидимый, но всё равно
          занимающий место элемент иначе раздвигал бы прокрутку предка. */}
      <span
        aria-hidden="true"
        className="pointer-events-none invisible absolute size-0 overflow-hidden"
      >
        <span
          ref={measureRef}
          data-slot="filter-label-measure"
          className="absolute top-0 left-0 whitespace-nowrap"
        >
          {full}
        </span>
      </span>
    </>
  )
}

export { FitLabel }
