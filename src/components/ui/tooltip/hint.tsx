import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { X } from "@/icons"

import { cn } from "@/lib/utils"

import { DIRECTION_PLACEMENT, type TooltipDirection } from "./variants"

// Hint — click-triggered, dismissed via its own "X" or an outside click
// (Popover's default behavior). Unlike Tooltip, it carries more content: an
// optional Title plus body text. Max width 592px, height adaptive. Per the
// spec, on mobile Hint (and Tooltip) becomes a Bottom Sheet with a
// "Понятно" button instead — that's not a mode of this component, it's the
// existing `Modal` (it already renders as a mobile bottom sheet / desktop
// dialog with the same Header/Body/Footer shape), so pair Hint's content
// with `Modal` at that breakpoint rather than duplicating it here.
interface HintProps {
  title?: React.ReactNode
  content: React.ReactNode
  showCross?: boolean
  direction?: TooltipDirection
  children: React.ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function Hint({
  title,
  content,
  showCross = true,
  direction = "down-center",
  children,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: HintProps) {
  const { side, align } = DIRECTION_PLACEMENT[direction]

  return (
    <PopoverPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <PopoverPrimitive.Trigger render={children} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side={side}
          align={align}
          sideOffset={8}
          arrowPadding={16}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="hint-content"
            className={cn(
              // Padding/layout pixel-confirmed against the spec's master
              // ("ELK / tooltip & hint", get_design_context): the Wrapper
              // is pl-4/pr-3/py-3 (NOT a uniform p-4 — that overpadded the
              // top/bottom by 4px each), and Title+content sit in one
              // flex-col column that's a sibling of the close icon (gap-2
              // row), not a header row with the icon above the content.
              // That distinction isn't just cosmetic: with the icon beside
              // the *whole* text column (not just the title line), the
              // text column is narrower throughout, which changes the
              // wrap point for long body copy versus stacking icon-above.
              "relative flex max-w-[592px] items-start gap-2 rounded-[8px] bg-[var(--tooltip-bg)] py-3 pr-3 pl-4 text-p3-regular text-[var(--tooltip-fg)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              className
            )}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2 pr-1">
              {title && (
                <PopoverPrimitive.Title className="font-medium">
                  {title}
                </PopoverPrimitive.Title>
              )}
              <div>{content}</div>
            </div>
            {showCross && (
              <PopoverPrimitive.Close
                aria-label="Закрыть"
                className="shrink-0 text-[var(--tooltip-fg)] outline-none"
              >
                <X aria-hidden="true" className="size-4" />
              </PopoverPrimitive.Close>
            )}
            <PopoverPrimitive.Arrow className="data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-1/2 data-[side=top]:bottom-0 data-[side=top]:translate-y-1/2 data-[side=left]:right-0 data-[side=left]:translate-x-1/2 data-[side=right]:left-0 data-[side=right]:-translate-x-1/2">
              <div className="size-3 rotate-45 bg-[var(--tooltip-bg)]" />
            </PopoverPrimitive.Arrow>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Hint }
export type { HintProps }
