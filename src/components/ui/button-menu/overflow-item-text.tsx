import type * as React from "react"
import { Check } from "@/icons"

import { Badge } from "@/components/ui/badge"

/**
 * Подпись строки «Ещё» для пункта ряда, ушедшего за многоточие (вкладка
 * Tabs, сегмент Switcher).
 *
 * Раньше строка получала одну голую подпись: активный пункт в «Ещё» ничем не
 * отличался от остальных, а счётчик и точка статуса пропадали — выбрав
 * вкладку из списка, пользователь нигде не видел, что она выбрана, а
 * непрочитанное в спрятанных вкладках терялось. Теперь строка несёт то же,
 * что сам пункт в ряду, а активная — галочку, как раздел в «Ещё» шапки и
 * меню сотрудника.
 */
function OverflowItemText({
  label,
  badge,
  status,
  active,
  disabled,
  badgeColor = "black",
  badgeDisabled = !active,
}: {
  label: React.ReactNode
  badge?: number
  status?: boolean
  active?: boolean
  disabled?: boolean
  /**
   * Счётчик — как у пункта в ряду. По умолчанию как у вкладки Tabs (чёрный,
   * выключен у неактивной); сегмент Switcher рисует свой светло-серым.
   */
  badgeColor?: "black" | "light-grey"
  badgeDisabled?: boolean
}) {
  if (badge === undefined && !status && !active) return <>{label}</>
  return (
    <span className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-2">
        {label}
        {badge !== undefined && (
          <Badge type="counter" value={badge} color={badgeColor} disabled={badgeDisabled} />
        )}
        {status && <Badge type="point" color="red" disabled={disabled} />}
      </span>
      {active && (
        <Check
          size={24}
          aria-hidden="true"
          data-slot="overflow-item-check"
          className="size-6 shrink-0 text-[var(--check-mark-fg)]"
        />
      )}
    </span>
  )
}

export { OverflowItemText }
