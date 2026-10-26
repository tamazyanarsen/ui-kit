import * as React from "react"

import { Button } from "@/components/ui/button"

/**
 * Кнопки подвала мобильной шторы фильтра — «Применить» и «Сбросить».
 *
 * Правки UI-Kit от 25.10, правило каркаса «Выпадающие списки в мобильном
 * виде — шторы»: кнопки во всю ширину, высота 48, основная сверху, вторичная
 * под ней через 16 — ровно то, что даёт `ModalFooter` кита. Подвал
 * раскладывает детей `flex-col-reverse`, поэтому «Сбросить» идёт в разметке
 * ПЕРВОЙ — и оказывается внизу.
 *
 * В отличие от поповера (там «Применить» без числа), в шторе кнопка несёт
 * счётчик: «Применить: N».
 */
function FilterSheetButtons({
  applyLabel,
  onApply,
  onReset,
  resetLabel = "Сбросить",
}: {
  applyLabel: React.ReactNode
  onApply: () => void
  onReset: () => void
  resetLabel?: React.ReactNode
}) {
  return (
    <>
      <Button variant="secondary-grey" size="lg" onClick={onReset}>
        {resetLabel}
      </Button>
      <Button variant="primary" size="lg" onClick={onApply}>
        {applyLabel}
      </Button>
    </>
  )
}

export { FilterSheetButtons }
