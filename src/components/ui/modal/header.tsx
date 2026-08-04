import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

// Sticky/pinned title bar ("Modal Top: Title" in the spec). Omit this part
// entirely for "Modal Top: None" — put the title inline as the first child
// of ModalBody instead, where it scrolls away with the rest of the content.
// Padding is symmetric (design-check #39) — the old asymmetric pr-16/pr-20
// was only there to dodge the close button, which design-check #37 moved
// outside the card entirely, so there's nothing left to make room for.
// Title/description gap is 16px mobile, 8px desktop (Figma "Modal Top"
// node 45321:17708 Texts=gap-8; mobile Title block 45321:17311 gap-16) —
// round-2 audit found this at a flat 4px (gap-1) on both breakpoints.
function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("flex shrink-0 flex-col gap-4 px-6 py-5 md:gap-2 md:px-8 md:py-6", className)}
      {...props}
    />
  )
}

function ModalTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="modal-title"
      className={cn(
        "pr-10 text-[22px] leading-[30px] font-medium text-[#252628] md:pr-0 md:text-h2",
        className
      )}
      {...props}
    />
  )
}

function ModalDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="modal-description"
      // Same color as ModalTitle (design-check #38) — was a muted grey,
      // reads as unrelated secondary text instead of the title's subtitle.
      // Mobile P1 Medium (14/20) growing to Desktop P1 Medium (16/24) —
      // Figma "Modal Top" spec (node 45321:17708 / :17732) applies the
      // desktop paragraph style here, not a fixed mobile size.
      className={cn("text-p2-medium text-[#252628] md:text-p1-medium", className)}
      {...props}
    />
  )
}

export { ModalHeader, ModalTitle, ModalDescription }
