import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"

// A result row — Title (bold, wraps across lines for long organization
// names per the spec, not truncated) + an optional grey subtitle line
// (e.g. "ИНН ... КПП ..."). No checkbox: this is single-select, and picking
// a result just fills the field, it doesn't build up a chip list.

interface AutocompleteItemOwnProps {
  subtitle?: React.ReactNode
}

function AutocompleteItem({
  className,
  children,
  subtitle,
  ...props
}: ComboboxPrimitive.Item.Props & AutocompleteItemOwnProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="autocomplete-item"
      // Flush, un-rounded p-4 row — matches Select's and Combobox's own
      // items, which share this exact Dropdown shell (see dropdown.tsx):
      // only the popup container is rounded, items go edge-to-edge with no
      // radius of their own.
      className={cn(
        "flex w-full cursor-default flex-col gap-0.5 p-4 text-p2-regular outline-hidden select-none data-highlighted:bg-[var(--autocomplete-highlighted-bg)] data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="font-semibold text-[var(--autocomplete-title-fg)]">{children}</span>
      {subtitle && (
        // Round-2 audit: added font-medium — every literal "Description"
        // line sampled on canvas 666:11's Menu Point (ELK) instances uses
        // Object Sans Medium (500), never Regular, at this same 12px size.
        // No dedicated Autocomplete frame exists though, so this is an
        // extrapolation from Select/Combobox's shared list-item component,
        // not a value confirmed against Autocomplete's own spec.
        <span className="text-p3-medium text-[var(--autocomplete-subtitle-fg)]">{subtitle}</span>
      )}
    </ComboboxPrimitive.Item>
  )
}

export { AutocompleteItem }
