import * as React from "react"

import { cn } from "@/lib/utils"

// Sticky/pinned button bar ("Modal Bottom" in the spec). Pass one Button for
// "Type: Primary"/"Secondary" or two for "Type: Buttons". Order children
// [secondary, primary] — mobile stacks them full-width with primary on top
// via flex-col-reverse, desktop lays them out right-aligned in the given
// order.
function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-3 px-6 py-5 [&>*]:w-full md:flex-row md:justify-end md:px-8 md:py-6 md:[&>*]:w-auto",
        className
      )}
      {...props}
    />
  )
}

export { ModalFooter }
