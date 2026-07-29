import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"

import { useAutocompleteAnchor } from "./root"

// Portal + Positioner + Popup, anchored directly to the field (no separate
// button trigger in the tree) — width matches the field, same shape as
// ./combobox's own content.tsx but without the extra in-popup search input,
// since the field itself is the search box here. `anchor` is set explicitly
// to field.tsx's outer box (see root.tsx's AnchorContext comment) — without
// it Base UI defaults to the bare `<input>`, which is narrower than the box.

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
          className={cn(
            "isolate flex max-h-[min(400px,var(--available-height))] w-full flex-col overflow-hidden rounded-2xl bg-white p-2 shadow-lg ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
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
      className={cn("px-3 py-2.5 text-sm text-[var(--select-caption-fg)] empty:hidden", className)}
      {...props}
    />
  )
}

function AutocompleteEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn("px-3 py-2.5 text-sm text-[var(--select-caption-fg)] empty:hidden", className)}
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
