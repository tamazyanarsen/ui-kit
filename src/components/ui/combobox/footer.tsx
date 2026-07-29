import type * as React from "react"

import { cn } from "@/lib/utils"

// Сбросить (left) + Применить / Выбрать N (right), split by a vertical
// divider, flush with the popup's bottom corners.

export function ComboboxFooter({
  className,
  resetLabel = "Сбросить",
  applyLabel,
  onReset,
  onApply,
  resetDisabled,
  applyDisabled,
}: {
  className?: string
  resetLabel?: React.ReactNode
  applyLabel: React.ReactNode
  onReset: () => void
  onApply: () => void
  resetDisabled?: boolean
  applyDisabled?: boolean
}) {
  return (
    <div
      data-slot="combobox-footer"
      className={cn(
        "grid shrink-0 grid-cols-2 border-t border-border text-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="border-r border-border px-4 py-3 font-medium text-[var(--select-fg)] outline-none hover:bg-accent disabled:pointer-events-none disabled:text-[var(--select-fg-disabled)]"
      >
        {resetLabel}
      </button>
      <button
        type="button"
        onClick={onApply}
        disabled={applyDisabled}
        className="px-4 py-3 font-medium text-[var(--select-fg)] outline-none hover:bg-accent disabled:pointer-events-none disabled:text-[var(--select-fg-disabled)]"
      >
        {applyLabel}
      </button>
    </div>
  )
}
