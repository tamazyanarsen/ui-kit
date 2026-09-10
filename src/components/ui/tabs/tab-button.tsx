import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import type { TabItem } from "./types"

/**
 * Одна вкладка ленты: подпись + линия под ней.
 *
 * Вынесена из `tabs.tsx` отдельным файлом по правилу проекта «не длиннее 300
 * строк» — после появления размера `medium` корень перестал помещаться.
 */
function TabButton({
  item,
  active,
  onClick,
  innerRef,
  /**
   * `medium` — «мобильные» числа ленты на любом экране: подпись P2 Medium
   * 14/20 вместо P1 Medium 16/24. Дизайн-чек «Storybook 3», замечание 4:
   * внутри Table Top лента разделов именно такая (в сете это `Size=Mobile`,
   * хотя сама таблица десктопная).
   */
  medium = false,
  /**
   * Активное подчёркивание рисует общий бегунок (см. `Tabs`), а не сама
   * вкладка: иначе двигать было бы нечего — линия просто перекрашивалась бы у
   * двух разных узлов. Измерительной копии бегунок не нужен, поэтому там флаг
   * остаётся выключенным и линия рисуется по-старому.
   */
  sharedUnderline = false,
}: {
  item: TabItem
  active: boolean
  onClick?: () => void
  innerRef?: (el: HTMLButtonElement | null) => void
  medium?: boolean
  sharedUnderline?: boolean
}) {
  return (
    <button
      ref={innerRef}
      type="button"
      disabled={item.disabled}
      onClick={onClick}
      data-slot="tabs-item"
      data-value={item.value}
      data-active={active || undefined}
      className="group flex shrink-0 cursor-pointer flex-col items-center gap-4 outline-none focus-visible:focus-ring disabled:cursor-not-allowed"
    >
      <span
        className={cn(
          // Weight lives in TEXT_SIZE's text-pN-medium below, not here.
          "flex items-center whitespace-nowrap transition-colors",
          item.badge !== undefined ? "gap-2" : "gap-1",
          "text-[var(--tabs-fg)] group-hover:text-[var(--tabs-fg)]",
          "group-data-active:text-[var(--tabs-fg-active)]",
          "group-disabled:text-[var(--tabs-fg-disabled)]",
          // Вариант `desktop:` при закреплённом размере не подмешивается:
          // медиазапрос перебил бы флаг, а `twMerge` разные префиксы не
          // схлопывает.
          "text-p2-medium",
          !medium && "desktop:text-p1-medium"
        )}
      >
        {item.label}
        {item.badge !== undefined && (
          <Badge type="counter" value={item.badge} color="black" disabled={!active} />
        )}
        {item.status && <Badge type="point" color="red" disabled={item.disabled} />}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "h-1 w-full shrink-0 rounded-t-[4px] transition-colors",
          active && !sharedUnderline
            ? "bg-[var(--tabs-underline-active)]"
            : "bg-transparent group-hover:bg-[var(--tabs-underline-hover)] group-disabled:bg-transparent",
          // Под активной вкладкой серого ховера нет — там уже стоит бегунок,
          // и подмешивать под него вторую линию незачем.
          active && sharedUnderline && "group-hover:bg-transparent"
        )}
      />
    </button>
  )
}

export { TabButton }
