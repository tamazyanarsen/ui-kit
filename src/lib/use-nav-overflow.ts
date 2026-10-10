import type * as React from "react"

import { useOverflowCount } from "@/lib/use-overflow-count"
import { useOverflowFocusRescue } from "@/lib/overflow-focus-rescue"

// Механика рядов навигации с «Ещё» (разметка — в `nav-overflow-row.tsx`):
// нижний ряд клиентской шапки и полоса избранного шапки сотрудника.
// Ревью 10.10, КК-2: перехват фокуса был только у первого, пол ширины —
// только у второго; теперь оба получают обе правки отсюда.

/** Интервал между пунктами — 32px, как в `Menu Header (ELK)`. */
const NAV_GAP = 32

/**
 * Место под «Ещё» в ряду: подпись p1-medium (~32) + шеврон 16 + `gap-1`
 * (4) + интервал 32 до него.
 */
const NAV_MORE_RESERVED = 88

/**
 * Счёт видимых пунктов, перехват фокуса и пол ширины ряда.
 *
 * • «Ещё» снялось с фокусом внутри (ряд расширился) — фокус переходит на
 *   раздел ряда, а не на body (аудит 17).
 * • Пока часть пунктов спрятана, ряду гарантировано место под обязательный
 *   пункт и «Ещё»: без пола узкая шапка сжимала ряд до нуля, и пункт с
 *   «Ещё» ложились на соседние блоки шапки.
 */
function useNavOverflow({
  count,
  overflowSelector,
  itemSelector,
}: {
  count: number
  /** Триггер «Ещё» и его попап. */
  overflowSelector: string
  /** Пункты видимого ряда. */
  itemSelector: string
}) {
  const { containerRef, itemRefs, visibleCount, minFitWidth } = useOverflowCount(
    count,
    NAV_MORE_RESERVED,
    NAV_GAP
  )
  const hasOverflow = visibleCount < count
  const focusSentinel = useOverflowFocusRescue({
    hasOverflow,
    rowRef: containerRef,
    overflowSelector,
    itemSelector,
    isActive: (item) => item.getAttribute("aria-current") === "page",
  })
  const floorStyle = hasOverflow
    ? ({ "--nav-min-width": `${minFitWidth}px` } as React.CSSProperties)
    : undefined

  return {
    containerRef,
    itemRefs,
    visibleCount,
    hasOverflow,
    focusSentinel: hasOverflow ? focusSentinel : null,
    /** Стиль и класс контейнера ряда: пол ширины, пока есть «Ещё». */
    floorStyle,
    floorClass: "min-w-[var(--nav-min-width,0px)]",
  }
}

export { useNavOverflow }
