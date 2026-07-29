import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Chips — "Чипсы": a plain, non-interactive pill for a value with an
// optional caption above it. Always the same grey surface — per its own
// column in ui/chips/chips, filter@2x-1.png's state matrix, Default/Hover/
// Active never gain a border or swap to the White/Grey choice Filter has;
// only the disabled column changes it. Padding is shared with Filter's own
// anatomy from the same doc: 16px horizontal always, 6px vertical without a
// subtitle / 8px with one.
interface ChipsProps {
  children: React.ReactNode
  subtitle?: React.ReactNode
  count?: number
  closable?: boolean
  onRemove?: () => void
  disabled?: boolean
  className?: string
}

function Chips({
  children,
  subtitle,
  count,
  closable = false,
  onRemove,
  disabled = false,
  className,
}: ChipsProps) {
  return (
    <span
      data-slot="chips"
      data-disabled={disabled || undefined}
      className={cn(
        "group/chips inline-flex w-fit max-w-64 flex-col items-start gap-0 rounded-2xl whitespace-nowrap transition-colors",
        subtitle ? "px-4 py-2" : "px-4 py-1.5",
        disabled
          ? "bg-[var(--chips-disabled-bg)]"
          : "bg-[var(--chips-light-bg)] hover:bg-[var(--chips-light-bg-hover)]",
        className
      )}
    >
      {subtitle && (
        <span className="truncate text-xs leading-tight text-[var(--chips-subtitle-fg)]">
          {subtitle}
        </span>
      )}
      <span className="flex w-full min-w-0 items-center gap-2">
        <span
          className={cn(
            "min-w-0 truncate text-sm font-medium",
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
