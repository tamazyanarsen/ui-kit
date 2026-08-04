import * as React from "react"

import { cn } from "@/lib/utils"

// Sticky/pinned button bar ("Modal Bottom" in the spec). Pass one Button for
// "Type: Primary"/"Secondary" or two for "Type: Buttons". Order children
// [secondary, primary] — mobile stacks them full-width with primary on top
// via flex-col-reverse, desktop lays them out left-aligned in the given
// order (design-check #36 — was right-aligned via justify-end).
function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-4 px-6 py-5 [&>*]:w-full md:flex-row md:justify-start md:gap-6 md:px-8 md:py-6 md:[&>*]:w-auto",
        className
      )}
      {...props}
    />
  )
}

export { ModalFooter }
