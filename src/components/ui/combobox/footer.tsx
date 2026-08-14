import type * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"

// Сбросить (left) + Применить / Выбрать N (right), split by a vertical
// divider, flush with the popup's bottom corners.
//
// Both actions are `ELK / button` instances in Figma (node 45821:30170 on
// the Select/Dropdown canvas — 56px tall, 32px sides, P1 Medium 16/24), the
// same footer construction the Calendar card uses, so they render the real
// Button. That matters most for the disabled state: Figma greys the whole
// button (fill grey-114 #EFEFEF, label grey-166 #C8C8CB), which is exactly
// Button's --btn-muted-bg/--btn-muted-fg pair. The hand-rolled version this
// replaces only dimmed the *label* and left the fill white.
//
// `rounded-none` because the footer sits flush inside the popup's own
// rounded, overflow-hidden shell (see Dropdown).

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
        "flex shrink-0 border-t border-[var(--menu-item-divider)]",
        className
      )}
    >
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onReset}
        disabled={resetDisabled}
        className="min-w-0 flex-1 rounded-none whitespace-nowrap"
      >
        {resetLabel}
      </Button>
      {/* Figma draws the split as its own 1px "Devider" element rather than
          a border on either button — and a border-r here would lose to
          Button's own base `border-transparent` anyway. That element is the
          shared "ELK / divider" component. */}
      <Divider orientation="vertical" />
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onApply}
        disabled={applyDisabled}
        className="min-w-0 flex-1 rounded-none whitespace-nowrap"
      >
        {applyLabel}
      </Button>
    </div>
  )
}
