import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Кнопка-подложка «весь блок — кнопка» для блоков, внутри которых есть своё
 * управление (BankCard, Card, BlockWidget).
 *
 * ⚠️ Почему не `role="button"` на самом блоке. У роли `button` дети по
 * ARIA 1.2 «презентационные»: вложенные «глаз», «…», флажок и кнопки
 * скринридер вправе сложить в имя блока и не показать отдельными
 * контролами (ревью 10.10, п. 25). Поэтому блок сам роли не несёт, а
 * клавиатурный и экранный вход в него — эта настоящая `<button>`, СОСЕДКА
 * вложенных контролов, а не их родитель.
 *
 * Как устроено:
 *   • подложка растянута на весь блок (`absolute inset-0`, блок —
 *     `relative`) и рисует кольцо фокуса по его скруглению;
 *   • `pointer-events-none`: мышь проходит сквозь неё к содержимому, и
 *     клик по блоку по-прежнему ловит сам блок через `pressHandlers` (с его
 *     правилами про вложенное управление и выделение текста). Фокус и
 *     нажатие с клавиатуры от `pointer-events` не зависят;
 *   • своё нажатие (Enter/Space — нативный `click` кнопки) не всплывает до
 *     блока, иначе `onPress` звался бы дважды.
 *
 * Стоит ПЕРВОЙ в блоке: в порядке Tab блок идёт раньше своих вложенных
 * кнопок, как и раньше.
 */
interface PressTargetProps {
  onPress: () => void
  /** Имя кнопки, если в блоке нет подходящего текста. */
  label?: string
  /** `id` узлов, чей текст — имя кнопки (заголовок блока). */
  labelledBy?: string
  describedBy?: string
  /**
   * Блок выключен: кнопка не нажимается и выходит из обхода по Tab, но
   * остаётся видна скринридеру (`aria-disabled`, а не `disabled`) — как и
   * прежняя роль `button` на выключенной строке Item.
   */
  disabled?: boolean
  /** Блок раскрывает список (строка-селект Item) — `aria-expanded`. */
  expanded?: boolean
  className?: string
}

const PressTarget = React.forwardRef<HTMLButtonElement, PressTargetProps>(function PressTarget(
  { onPress, label, labelledBy, describedBy, disabled, expanded, className },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      data-slot="press-target"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-expanded={expanded}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={(event) => {
        event.stopPropagation()
        if (!disabled) onPress()
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] outline-none focus-visible:focus-ring",
        className
      )}
    />
  )
})

export { PressTarget }
export type { PressTargetProps }
