import * as React from "react"

import { cn } from "@/lib/utils"

// Sticky/pinned button bar ("Modal Bottom" in the spec). Pass one Button for
// "Type: Primary"/"Secondary" or two for "Type: Buttons". Order children
// [secondary, primary] — mobile stacks them full-width with primary on top
// via flex-col-reverse, desktop lays them out left-aligned in the given
// order (design-check #36 — was right-aligned via justify-end).
//
// Horizontal padding tracks the modal's own inset rather than being fixed:
// `Modal Bottom (Large, ELK)` is `px-[64px] pb-[48px]` and the Small one
// 48px, i.e. the same --modal-px the header and body already use. A flat
// 48px here left the Large modal's buttons 16px inboard of its body text.
function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-4 px-6 py-5 [&>*]:w-full desktop:flex-row desktop:justify-start desktop:gap-6 desktop:px-(--modal-px) desktop:pt-4 desktop:pb-12 desktop:[&>*]:w-auto",
        className
      )}
      {...props}
    />
  )
}

export { ModalFooter }
