import * as React from "react"

import { cn } from "@/lib/utils"

// Divider — Figma ships this as its own named, versioned component
// ("ELK / divider", node 58890:9260, v1.0.0): a 1px line filled with
// grey-134 #DEDEDE, used both as a horizontal rule between rows and as the
// vertical split between paired footer actions (Calendar's and the
// Dropdown's "Сбросить | Применить" bars both instantiate it).
//
// The kit had no counterpart — every consumer re-derived the same line,
// which is how `SelectSeparator` ended up on the generic shadcn `--border`
// (oklch(0.922 0 0) ≈ #E5E5E5) instead of the ELK grey. Route new dividers
// through this component so the value stays in one place.
//
// Note: a divider drawn as a *border* on a neighbouring element (Modal's
// scroll-edge rules, Notification's `divide-y`) legitimately stays a border
// — this component is for the standalone 1px element Figma draws as its own
// "Devider" node.
interface DividerProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
}

// forwardRef so Base UI primitives can swap this in via their `render` prop
// (SelectSeparator does) — they forward a ref to the element they render,
// and a plain function component would drop it.
const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = "horizontal", className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="divider"
      data-orientation={orientation}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-[var(--divider)]",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className
      )}
      {...props}
    />
  )
})

export { Divider }
export type { DividerProps }
