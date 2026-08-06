import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"

import { DIRECTION_PLACEMENT, type TooltipDirection } from "./variants"

// Hint — click-triggered, dismissed via its own "X" or an outside click
// (Popover's default behavior). Unlike Tooltip, it carries more content: an
// optional Title plus body text. Max width 592px, height adaptive.
//
// Below `md` it is a different component entirely, not a restyled popover:
// the spec's `Direction=Mobile` variant (node 11756:8112) is an actual
// `ELK / Modal` instance — a bottom sheet with the title/close row, the body
// text, and a full-width "Понятно" button pinned to the bottom panel. That
// swap can't be expressed in CSS (both forms are portalled subtrees), so it
// runs off a media query rather than a `md:` class.
const MOBILE_DISMISS_LABEL = "Понятно"

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
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return (
      <Modal open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <ModalTrigger render={children} />
        {/* size is irrelevant below `md` — the sheet is always full-width
            there — but `m` keeps the desktop fallback at the 592px card
            rather than the 1008px one if this ever renders wide. */}
        <ModalContent
          size="m"
          showClose={showCross}
          data-slot="hint-sheet"
          // A Hint without a title would otherwise leave the sheet with no
          // accessible name — the body text is the description, not the label.
          aria-label={title ? undefined : "Подсказка"}
        >
          {title && (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
          )}
          <ModalDescription
            className={cn(
              "px-6 pb-5 md:px-8 md:pb-6",
              // Without a header above it the text needs the header's own top
              // padding, or it collides with the sheet's rounded top edge.
              !title && "pt-5 md:pt-6"
            )}
          >
            {content}
          </ModalDescription>
          <ModalFooter>
            <ModalClose
              render={
                <Button variant="secondary-grey" size="lg">
                  {MOBILE_DISMISS_LABEL}
                </Button>
              }
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

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
