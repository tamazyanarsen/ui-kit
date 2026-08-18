import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Chips — "Чипсы": a plain, non-interactive pill for a value with an
// optional caption above it. Padding is shared with Filter's own anatomy
// from the same doc: 16px horizontal always, 6px vertical without a
// subtitle / 8px with one.
//
// Chips и Filter — один компонент-сет в Figma («ELK / chips, filter», нода
// 54887:29179) со свойством `Type`. Белый/серый выбор и брендовая обводка
// принадлежат типам `Filter (White)` / `Filter (Grey)` — см. компонент
// Filter. У `Type=Chips` их нет: проверено по всем пяти состояниям сета,
// Default — grey-109 #F4F4F4, а Hover, Active и Active (Hover) — все три
// grey-114 #EFEFEF без рамки (ноды 54887:29212/29215/29218/29221).
interface ChipsProps {
  children: React.ReactNode
  subtitle?: React.ReactNode
  count?: number
  closable?: boolean
  onRemove?: () => void
  /**
   * Состояние `State=Active` — «чипса выбрана».
   *
   * Дизайн-чек №19: раньше его нельзя было ни включить, ни увидеть в
   * матрице. Визуально совпадает с hover (в макете это одна и та же
   * заливка grey-114), но это отдельное состояние: оно держится без
   * курсора.
   */
  selected?: boolean
  disabled?: boolean
  className?: string
}

function Chips({
  children,
  subtitle,
  count,
  closable = false,
  onRemove,
  selected = false,
  disabled = false,
  className,
}: ChipsProps) {
  return (
    <span
      data-slot="chips"
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        // Design-check #14: rounded-2xl (18px on this kit's custom radius
        // scale) reads as a full pill at this height — the Figma source
        // (ui/chips/chips, filter.svg) uses an 8px corner radius throughout,
        // which is rounded-md here, not rounded-2xl.
        "group/chips inline-flex w-fit max-w-64 flex-col items-start gap-0 rounded-md whitespace-nowrap transition-colors",
        subtitle ? "px-4 py-2" : "px-4 py-1.5",
        disabled
          ? "bg-[var(--chips-disabled-bg)]"
          : selected
            ? "bg-[var(--chips-light-bg-hover)]"
            : "bg-[var(--chips-light-bg)] hover:bg-[var(--chips-light-bg-hover)]",
        className
      )}
    >
      {subtitle && (
        <span
          className={cn(
            "truncate text-p3-medium",
            disabled ? "text-[var(--chips-disabled-fg)]" : "text-[var(--chips-subtitle-fg)]"
          )}
        >
          {subtitle}
        </span>
      )}
      <span className="flex w-full min-w-0 items-center gap-2">
        <span
          className={cn(
            "min-w-0 truncate text-p2-medium desktop:text-p1-medium",
            disabled ? "text-[var(--chips-disabled-fg)]" : "text-[var(--chips-fg)]"
          )}
        >
          {children}
        </span>
        {count !== undefined && (
          <Badge type="counter" value={count} color="light-grey" disabled={disabled} />
        )}
        {closable && (
          <button
            type="button"
            aria-label="Удалить"
            disabled={disabled}
            onClick={onRemove}
            className={cn(
              "ml-auto shrink-0 outline-none",
              disabled ? "text-[var(--chips-disabled-fg)]" : "text-[var(--chips-fg)]"
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </span>
    </span>
  )
}

export { Chips }
export type { ChipsProps }
