import * as React from "react"

interface OverflowFocusRescueOptions {
  /** Есть ли что прятать — пока есть, «Ещё» на месте. */
  hasOverflow: boolean
  /** Ряд видимых пунктов, в котором ищется, куда перевести фокус. */
  rowRef: React.RefObject<HTMLElement | null>
  /** Триггер «Ещё» и его попап: фокус внутри них считается потерянным. */
  overflowSelector: string
  /** Пункты ряда, способные принять фокус. */
  itemSelector: string
  /** Активный пункт — туда фокус переходит в первую очередь. */
  isActive: (item: HTMLElement) => boolean
}

/**
 * Не терять фокус, когда «Ещё» снимается или гаснет вместе с фокусом внутри.
 *
 * Если при открытом (или сфокусированном) «…» прятать становится нечего
 * (ряд расширился, пунктов стало меньше), меню закрывается, а триггер
 * размонтируется или выключается. Фокус из них падал на body — клавиатурный
 * пользователь терял место на странице. Теперь он переходит на активный
 * пункт ряда, а если его нет среди видимых — на последний доступный.
 *
 * Общий для Switcher, Tabs и ряда разделов шапки (аудит 17: «сторож» был
 * только у Switcher).
 *
 * Где был фокус, выясняется ДО снятия узлов: очистка layout-эффекта
 * «сторожа», отрисованного рядом с меню, выполняется раньше, чем React
 * удаляет DOM удалённого поддерева. Переносится фокус уже после — в
 * layout-эффекте самого ряда. Если попап ещё на месте (закрывается своей
 * анимацией, а триггер остался выключенным), фокус из него забирается сразу:
 * возвращать его на выключенный триггер браузер не станет.
 */
function useOverflowFocusRescue({
  hasOverflow,
  rowRef,
  overflowSelector,
  itemSelector,
  isActive,
}: OverflowFocusRescueOptions) {
  const lostRef = React.useRef(false)
  const optionsRef = React.useRef({ overflowSelector, itemSelector, isActive })
  optionsRef.current = { overflowSelector, itemSelector, isActive }

  React.useLayoutEffect(() => {
    if (hasOverflow || !lostRef.current) return
    lostRef.current = false
    const { overflowSelector: overflow, itemSelector: item, isActive: active } = optionsRef.current
    const current = document.activeElement
    // Фокус уже где-то стоит (например, перешёл сам) — не перехватываем.
    if (current && current !== document.body && !current.closest(overflow)) return
    const items = [...(rowRef.current?.querySelectorAll<HTMLElement>(item) ?? [])].filter(
      // Закадровые мерные копии фокус не принимают.
      (el) => !el.closest('[aria-hidden="true"]') && !(el as HTMLButtonElement).disabled
    )
    const target = items.find(active) ?? items.at(-1)
    target?.focus()
  }, [hasOverflow, rowRef])

  return <OverflowFocusSentinel selector={overflowSelector} onLose={() => (lostRef.current = true)} />
}

function OverflowFocusSentinel({ selector, onLose }: { selector: string; onLose: () => void }) {
  const latest = React.useRef({ selector, onLose })
  latest.current = { selector, onLose }
  React.useLayoutEffect(
    () => () => {
      if (document.activeElement?.closest(latest.current.selector)) latest.current.onLose()
    },
    []
  )
  return null
}

export { useOverflowFocusRescue }
export type { OverflowFocusRescueOptions }
