import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"
import { Dropdown } from "@/components/ui/dropdown"

import { useAutocompleteAnchor } from "./root"

// Portal + Positioner + Popup, anchored directly to the field (no separate
// button trigger in the tree) — width matches the field, same shape as
// ./combobox's own content.tsx but without the extra in-popup search input,
// since the field itself is the search box here. `anchor` is set explicitly
// to field.tsx's outer box (see root.tsx's AnchorContext comment) — without
// it Base UI defaults to the bare `<input>`, which is narrower than the box.
// Renders the actual shared Dropdown component (same one Select/Combobox
// use), not just a matching className.

function AutocompleteContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const anchorRef = useAutocompleteAnchor()
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        anchor={anchorRef}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 w-(--anchor-width)"
      >
        <ComboboxPrimitive.Popup
          data-slot="autocomplete-content"
          render={
            <Dropdown
              className={cn(
                "isolate flex max-h-[min(400px,var(--available-height))] w-full flex-col overflow-hidden p-2",
                className
              )}
            />
          }
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function AutocompleteList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="autocomplete-list"
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
}

function AutocompleteCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

function AutocompleteStatus({ className, ...props }: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="autocomplete-status"
      // Round-2 audit: same "Text Help" hint padding fix as Combobox's own
      // Status/Empty (pt-[12px]/pb-[16px]/px-[16px] per canvas 666:11's
      // search-hint dropdown instance, not a uniform px-3/py-2.5) — no
      // dedicated Autocomplete frame exists, but this is literally the same
      // ComboboxPrimitive.Status/Empty pattern reused, not an extrapolation.
      className={cn("px-4 pt-3 pb-4 text-p2 text-[var(--select-caption-fg)] empty:hidden", className)}
      {...props}
    />
  )
}

function AutocompleteEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="autocomplete-empty"
      // Round-2 audit: same "Text Help" hint padding fix as Combobox's own
      // Status/Empty (pt-[12px]/pb-[16px]/px-[16px] per canvas 666:11's
      // search-hint dropdown instance, not a uniform px-3/py-2.5) — no
      // dedicated Autocomplete frame exists, but this is literally the same
      // ComboboxPrimitive.Status/Empty pattern reused, not an extrapolation.
      className={cn("px-4 pt-3 pb-4 text-p2 text-[var(--select-caption-fg)] empty:hidden", className)}
      {...props}
    />
  )
}

export {
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteStatus,
  AutocompleteEmpty,
}
