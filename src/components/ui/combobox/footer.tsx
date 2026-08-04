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
      // Round-2 audit: the top divider and the vertical divider between the
      // two buttons are literal grey-134 #DEDEDE in the sampled "ELK /
      // dropdown" footer (both the checkbox-tree and plain examples on
      // canvas 666:11), not the kit's generic --border token (#E5E5E5).
      className={cn(
        "grid shrink-0 grid-cols-2 border-t border-[#DEDEDE] text-p2",
        className
      )}
    >
      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className="flex items-center justify-center border-r border-[#DEDEDE] px-8 py-4 font-medium whitespace-nowrap text-[var(--select-fg)] outline-none hover:bg-accent disabled:pointer-events-none disabled:text-[var(--select-fg-disabled)] md:text-p1"
      >
        {resetLabel}
      </button>
      <button
        type="button"
        onClick={onApply}
        disabled={applyDisabled}
        className="flex items-center justify-center px-8 py-4 font-medium whitespace-nowrap text-[var(--select-fg)] outline-none hover:bg-accent disabled:pointer-events-none disabled:text-[var(--select-fg-disabled)] md:text-p1"
      >
        {applyLabel}
      </button>
    </div>
  )
}
