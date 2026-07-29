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
      className={cn(
        "flex w-full cursor-default flex-col gap-0.5 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none data-highlighted:bg-[var(--autocomplete-highlighted-bg)] data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="font-semibold text-[var(--autocomplete-title-fg)]">{children}</span>
      {subtitle && (
        <span className="text-xs text-[var(--autocomplete-subtitle-fg)]">{subtitle}</span>
      )}
    </ComboboxPrimitive.Item>
  )
}

export { AutocompleteItem }
