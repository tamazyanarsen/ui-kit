import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Pill-shaped inline toolbar. Pass `Button` instances as children — per the
// spec, a Primary button (if any) always goes first/left (though the first
// slot can just as validly be Secondary/grey — the spec doesn't force a
// brand button), followed by up to three Secondary buttons ordered
// most-frequently-used first. Append `ButtonMenuOverflow` as the last child
// for the "..." overflow menu — 1-3 buttons plus the overflow is a normal
// combination, not a special case.
function ButtonMenu({ className, children, ...props }: React.ComponentProps<"div">) {
  // Design-check #6: every Button child is forced to Large Desktop
  // regardless of what size (if any) the caller passed — the spec requires
  // uniform height across the row, and Button's own default size isn't
  // "lg", so without this a plain `<Button>` here would silently render
  // shorter than ButtonMenuOverflow's always-lg trigger.
  const sizedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Button) {
      return React.cloneElement(child as React.ReactElement<{ size?: string }>, {
        size: "lg",
      })
    }
    return child
  })

  return (
    // Design-check #5 revisited: ui/button-menu/button-menu-light's own
    // component preview ("With Primary"/"Only Secondary") renders this as a
    // fully-rounded floating pill with a shadow and no border — matches
    // what was already here. Not changed; #5's "pin to the viewport bottom,
    // square off the bottom corners" reading doesn't match that reference,
    // so it's flagged in the summary rather than guessed at again.
    <div
      data-slot="button-menu"
      className={cn(
        "flex w-fit items-center gap-3 rounded-[32px] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      {sizedChildren}
    </div>
  )
}

export { ButtonMenu }
