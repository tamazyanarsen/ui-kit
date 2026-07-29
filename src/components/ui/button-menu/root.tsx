import * as React from "react"

import { cn } from "@/lib/utils"

// Pill-shaped inline toolbar. Pass `Button` instances as children — per the
// spec, a Primary button (if any) always goes first/left, followed by up to
// three Secondary buttons ordered most-frequently-used first. Append
// `ButtonMenuOverflow` as the last child for the "..." overflow menu — the
// spec restricts it to appearing only once exactly three buttons are shown.
function ButtonMenu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-menu"
      className={cn(
        "flex w-fit items-center gap-3 rounded-[32px] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    />
  )
}

export { ButtonMenu }
