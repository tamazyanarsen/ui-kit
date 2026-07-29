import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, Lock, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SELECT_ICON_SIZE,
  selectFloatingLabelClassName,
  selectStaticLabelClassName,
  selectTriggerVariants,
} from "./variants"

interface SelectTriggerOwnProps {
  size?: "sm" | "lg"
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

export function SelectTrigger({
  className,
  size = "lg",
  label,
  comment,
  error,
  clearable = true,
  onClear,
  children,
  id,
  ...props
}: Omit<SelectPrimitive.Trigger.Props, "render"> & SelectTriggerOwnProps) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${triggerId}-caption` : undefined
  const floating = size === "lg"
  // Only actually reserve room when there's a label to float — without one
  // there's nothing above the value to make space for, so the padding bump
  // would just sink the text in its own box for no reason.
  const hasFloatingLabel = floating && Boolean(label)

  return (
    <div className="flex w-full flex-col gap-1.5">
      <SelectPrimitive.Trigger
        id={triggerId}
        data-slot="select-trigger"
        aria-invalid={invalid || undefined}
        aria-describedby={captionId}
        nativeButton={false}
        render={<div className={cn(selectTriggerVariants({ size, invalid }), className)} />}
        {...props}
      >
        {label && (
          <span
            className={
              floating
                ? selectFloatingLabelClassName
                : selectStaticLabelClassName
            }
          >
            {label}
          </span>
        )}
        <span
          className={cn(
            "flex flex-1 items-center gap-1.5 truncate text-[var(--select-fg)]",
            "group-data-disabled/trigger:text-[var(--select-fg-disabled)]",
            "*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 *:data-[slot=select-value]:truncate",
            // The floating label already occupies the "empty" position —
            // don't let SelectValue's own placeholder text show under it.
            label &&
              "group-data-placeholder/trigger:*:data-[slot=select-value]:text-transparent",
            // Padding lives here (on the value span), not on the trigger
            // box itself — the box uses `items-center` across the whole
            // row, so padding on the box would recenter the icons/clear
            // button too and visibly shift them down on focus. Scoping it
            // to just this span keeps only the value text pushed down,
            // making room for the floated label above it.
            hasFloatingLabel &&
              "group-data-popup-open/trigger:pt-4 group-[&:not([data-placeholder])]/trigger:pt-4 md:group-data-popup-open/trigger:pt-5 md:group-[&:not([data-placeholder])]/trigger:pt-5"
          )}
        >
          {children}
        </span>
        <Lock
          aria-hidden="true"
          className={cn(
            SELECT_ICON_SIZE[size],
            "hidden shrink-0 text-[var(--select-icon-fg)] group-data-readonly/trigger:block"
          )}
        />
        <span className="flex shrink-0 items-center gap-1 group-data-readonly/trigger:hidden">
          {clearable && (
            <button
              type="button"
              aria-label="Очистить"
              onMouseDown={(event) => {
                // The trigger opens the popup on mousedown, which fires
                // before onClick — stop it here too or clicking the clear
                // button also opens the dropdown.
                event.stopPropagation()
              }}
              onClick={(event) => {
                event.stopPropagation()
                onClear?.()
              }}
              className="hidden text-[var(--select-icon-fg)] outline-none group-[&:not([data-placeholder])]/trigger:flex group-data-disabled/trigger:!hidden"
            >
              <X aria-hidden="true" className={SELECT_ICON_SIZE[size]} />
            </button>
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              SELECT_ICON_SIZE[size],
              "shrink-0 text-[var(--select-icon-fg)] transition-transform group-data-popup-open/trigger:rotate-180"
            )}
          />
        </span>
      </SelectPrimitive.Trigger>
      {(comment || error) && (
        <p
          id={captionId}
          className={cn(
            "text-xs",
            // Aligns with the label/value text inside the trigger, not the
            // box's outer edge — matches the trigger's own horizontal padding.
            size === "sm" ? "px-3" : "px-4 md:px-5",
            error
              ? "text-[var(--select-caption-error-fg)]"
              : "text-[var(--select-caption-fg)]"
          )}
        >
          {error ?? comment}
        </p>
      )}
    </div>
  )
}
