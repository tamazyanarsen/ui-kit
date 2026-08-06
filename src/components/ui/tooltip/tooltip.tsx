import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

import { DIRECTION_PLACEMENT, type TooltipDirection } from "./variants"

// Tooltip — hover-triggered, text-only, smaller sibling of Hint (see
// hint.tsx). Per the spec: opens after a 400ms hover delay (so moving the
// cursor across the page doesn't flicker tooltips open), closes instantly
// the moment the cursor leaves. Max width 256px, height adaptive.
interface TooltipProps {
  content: React.ReactNode
  direction?: TooltipDirection
  children: React.ReactElement
  className?: string
  /** Keeps the tooltip permanently closed while leaving the wrapper mounted.
   * For anchors whose tooltip comes and goes with their content (Input only
   * explains itself while locked, or while its value overflows): swapping
   * between a wrapped and an unwrapped child instead would remount the
   * anchor's whole subtree, which for a field means losing focus and caret
   * position mid-typing. */
  disabled?: boolean
}

function Tooltip({
  content,
  direction = "top-center",
  children,
  className,
  disabled = false,
}: TooltipProps) {
  const { side, align } = DIRECTION_PLACEMENT[direction]
  // Open state is always controlled, never conditionally so: handing Root an
  // `open` prop only while disabled would flip it between uncontrolled and
  // controlled and Base UI warns about exactly that.
  const [open, setOpen] = React.useState(false)

  return (
    <TooltipPrimitive.Provider delay={400} closeDelay={0}>
      <TooltipPrimitive.Root open={disabled ? false : open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger render={children} />
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner
            side={side}
            align={align}
            sideOffset={8}
            arrowPadding={16}
            className="z-50"
          >
            <TooltipPrimitive.Popup
              data-slot="tooltip-content"
              className={cn(
                "relative max-w-64 rounded-[8px] bg-[var(--tooltip-bg)] px-4 py-3 text-p3-regular text-[var(--tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                className
              )}
            >
              {content}
              {/* Same size as Hint's arrow (size-3) — both share the
                  identical "Direction" polygon geometry in the spec
                  (get_design_context on both master instances returns the
                  same 8×20 pre-rotation shape), so there's no basis for
                  Tooltip's tail to render smaller than Hint's. */}
              <TooltipPrimitive.Arrow className="data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-1/2 data-[side=top]:bottom-0 data-[side=top]:translate-y-1/2 data-[side=left]:right-0 data-[side=left]:translate-x-1/2 data-[side=right]:left-0 data-[side=right]:-translate-x-1/2">
                <div className="size-3 rotate-45 bg-[var(--tooltip-bg)]" />
              </TooltipPrimitive.Arrow>
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export { Tooltip }
export type { TooltipProps }
