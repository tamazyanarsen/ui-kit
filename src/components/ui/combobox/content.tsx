import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { LoaderCircle, Search, X } from "@/icons"

import { cn } from "@/lib/utils"

// Portal + Positioner + Popup. Per spec: 8px gap to the trigger, width
// matches the trigger, height clamps between 168 and 504px (and still
// shrinks to fit the viewport).

export function ComboboxContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 w-(--anchor-width)"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "isolate flex max-h-[min(504px,var(--available-height))] min-h-42 w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
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

// Search input — lives inside the popup (not the trigger). Spec: search
// icon left, spinner while a request is in flight (shown *alongside* the
// clear button, not instead of it), clear button once there's text.

export function ComboboxSearchInput({
  className,
  loading = false,
  ...props
}: ComboboxPrimitive.Input.Props & { loading?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2.5">
      <Search
        aria-hidden="true"
        className="size-4 shrink-0 text-[var(--select-icon-fg)]"
      />
      <ComboboxPrimitive.Input
        data-slot="combobox-search"
        className={cn(
          "h-5 w-full min-w-0 border-0 bg-transparent text-sm text-[var(--select-fg)] outline-none placeholder:text-[var(--select-label-fg)]",
          className
        )}
        {...props}
      />
      {loading && (
        <LoaderCircle
          aria-hidden="true"
          className="size-4 shrink-0 animate-spin text-[var(--btn-primary-bg-hover)]"
        />
      )}
      <ComboboxPrimitive.Clear
        aria-label="Очистить поиск"
        className="flex shrink-0 items-center justify-center text-[var(--select-icon-fg)] outline-none"
      >
        <X aria-hidden="true" className="size-4" />
      </ComboboxPrimitive.Clear>
    </div>
  )
}

// Status / Empty — the hint / no-results / error copy shown between the
// search field and the list ("Начните вводить параметры поиска",
// "Поиск не дал результатов...", etc).

export function ComboboxStatus({
  className,
  ...props
}: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn(
        "px-3 py-2.5 text-sm text-[var(--select-caption-fg)] empty:hidden",
        className
      )}
      {...props}
    />
  )
}

export function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "px-3 py-2.5 text-sm text-[var(--select-caption-fg)] empty:hidden",
        className
      )}
      {...props}
    />
  )
}

export function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("py-1 first:pt-0 last:pb-0", className)}
      {...props}
    />
  )
}

export function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

export function ComboboxSectionLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-section-label"
      className={cn(
        "px-3 pt-2 pb-1 text-xs font-medium text-[var(--select-fg)]",
        className
      )}
      {...props}
    />
  )
}

// Scrollable region below the (optional) search bar.

export function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("flex-1 overflow-y-auto py-1", className)}
      {...props}
    />
  )
}
