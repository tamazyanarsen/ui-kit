import * as React from "react"

const OVERFLOW_SELECTOR =
  '[data-slot="switcher-overflow-trigger"], [data-slot="switcher-overflow-content"]'

/**
 * Не терять фокус, когда «Ещё» снимается вместе с фокусом внутри.
 *
 * Если при открытом (или сфокусированном) «…» прятать становится нечего,
 * триггер и меню размонтируются, и фокус из них падал на body —
 * клавиатурный пользователь терял место на странице. Теперь он переходит
 * на активный сегмент ряда, а если его нет среди видимых — на последний
 * доступный.
 *
 * Где был фокус, выясняется ДО снятия узлов: очистка layout-эффекта
 * «сторожа», отрисованного рядом с меню, выполняется раньше, чем React
 * удаляет DOM удалённого поддерева. Переносится фокус уже после — в
 * layout-эффекте самого ряда.
 */
function useOverflowFocusRescue(
  hasOverflow: boolean,
  rowRef: React.RefObject<HTMLElement | null>
) {
  const lostRef = React.useRef(false)

  React.useLayoutEffect(() => {
    if (hasOverflow || !lostRef.current) return
    lostRef.current = false
    const active = document.activeElement
    // Фокус уже где-то стоит (например, перешёл сам) — не перехватываем.
    if (active && active !== document.body) return
    const buttons = [
      ...(rowRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []),
    ]
    const target =
      buttons.find((button) => button.getAttribute("aria-pressed") === "true") ?? buttons.at(-1)
    target?.focus()
  }, [hasOverflow, rowRef])

  const sentinel = <OverflowFocusSentinel onLose={() => (lostRef.current = true)} />
  return sentinel
}

function OverflowFocusSentinel({ onLose }: { onLose: () => void }) {
  const onLoseRef = React.useRef(onLose)
  onLoseRef.current = onLose
  React.useLayoutEffect(
    () => () => {
      if (document.activeElement?.closest(OVERFLOW_SELECTOR)) onLoseRef.current()
    },
    []
  )
  return null
}

export { useOverflowFocusRescue }
