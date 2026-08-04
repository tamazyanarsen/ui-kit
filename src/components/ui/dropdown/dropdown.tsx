import * as React from "react"

import { cn } from "@/lib/utils"

// Dropdown — the popup surface Figma documents as its own separate,
// reusable component (Select's own canvas lists three distinct property
// tables: Select, Menu Point, and Dropdown — "Больше информации о
// выпадающем списке вы можете найти в разделе Select, Dropdown" is a
// cross-reference between components, not just a shared look). Every
// floating option/action list in this kit — Select, Combobox, Autocomplete,
// Button Menu's "..." overflow, Selection Button — renders through this one
// component via each primitive's own `render` prop, instead of each one
// re-deriving its own popup chrome from a shared className string.
//
// forwardRef is required, not optional: Base UI's `render` prop forwards a
// ref to the element it swaps in (for floating-ui positioning/focus
// management) — a plain function component here silently drops that ref.
const Dropdown = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  function Dropdown({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown"
        className={cn(
          "rounded-[16px] bg-popover text-popover-foreground shadow-[0_4px_12px_rgba(139,153,169,0.24)] outline-none origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

interface DropdownItemProps extends React.ComponentProps<"div"> {
  text: React.ReactNode
  description?: React.ReactNode
}

// The "Menu Point" item variant used by the action-list consumers above —
// title + optional description, highlighted on hover/focus. Select's own
// SelectItem has a different, checkbox-driven look (see select/item.tsx)
// and stays separate; this is specifically the plain action-row variant.
const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  function DropdownItem({ className, text, description, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dropdown-item"
        className={cn(
          "flex cursor-default flex-col gap-0.5 rounded-xl px-3 py-2.5 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:bg-[#F4F4F4]",
          className
        )}
        {...props}
      >
        <span className="text-p1 font-medium text-[#252628]">{text}</span>
        {description && (
          <span className="text-p3 font-medium text-[#999999]">{description}</span>
        )}
        {children}
      </div>
    )
  }
)

export { Dropdown, DropdownItem }
export type { DropdownItemProps }
