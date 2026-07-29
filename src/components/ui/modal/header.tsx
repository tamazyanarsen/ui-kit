import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

// Sticky/pinned title bar ("Modal Top: Title" in the spec). Omit this part
// entirely for "Modal Top: None" — put the title inline as the first child
// of ModalBody instead, where it scrolls away with the rest of the content.
function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn(
        "flex shrink-0 flex-col gap-1 px-6 py-5 pr-16 md:px-8 md:py-6 md:pr-20",
        className
      )}
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
        "text-lg font-medium text-[#252628] md:text-xl",
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
      className={cn("text-sm text-[#999999]", className)}
      {...props}
    />
  )
}

export { ModalHeader, ModalTitle, ModalDescription }
