import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SELECT_ICON_SIZE,
  selectFloatingLabelClassName,
  selectStaticLabelClassName,
  selectTriggerVariants,
} from "../select"

// Identical box/label/clear chrome to SelectTrigger (same Figma spec: L
// 48->56px / S 32px, floating label at L only). Since this popup's value is
// usually a custom summary ("Выбрано документов: 5"), children are passed
// straight through rather than requiring a `Combobox.Value` binding.

interface ComboboxTriggerOwnProps {
  size?: "sm" | "lg"
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  placeholder?: boolean
}

export function ComboboxTrigger({
  className,
  size = "lg",
  label,
  comment,
  error,
  clearable = true,
  onClear,
  placeholder = false,
  children,
  id,
  ...props
}: Omit<ComboboxPrimitive.Trigger.Props, "render"> & ComboboxTriggerOwnProps) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${triggerId}-caption` : undefined
  const floating = size === "lg"
  // Only actually reserve room when there's a label to float — without one
  // there's nothing above the value to make space for.
  const hasFloatingLabel = floating && Boolean(label)

  return (
    <div className="flex w-full flex-col gap-1.5">
      <ComboboxPrimitive.Trigger
        id={triggerId}
        data-slot="combobox-trigger"
        data-placeholder={placeholder ? "" : undefined}
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
            placeholder &&
              label &&
              "group-data-placeholder/trigger:text-transparent",
            // See select.tsx's SelectTrigger for why this lives here and
            // not on the trigger box: padding there would recenter the
            // icons/clear button too and shift them down on focus.
            hasFloatingLabel &&
              "group-data-popup-open/trigger:pt-4 group-[&:not([data-placeholder])]/trigger:pt-4 md:group-data-popup-open/trigger:pt-5 md:group-[&:not([data-placeholder])]/trigger:pt-5"
          )}
        >
          {children}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && (
            <button
              type="button"
              aria-label="Очистить"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                onClear?.()
              }}
              className={cn(
                "text-[var(--select-icon-fg)] outline-none",
                placeholder && "hidden"
              )}
            >
              <X aria-hidden="true" className={SELECT_ICON_SIZE[size]} />
            </button>
          )}
          <ComboboxPrimitive.Icon className="text-[var(--select-icon-fg)] transition-transform group-data-popup-open/trigger:rotate-180">
            <ChevronDown className={SELECT_ICON_SIZE[size]} />
          </ComboboxPrimitive.Icon>
        </span>
      </ComboboxPrimitive.Trigger>
      {(comment || error) && (
        <p
          id={captionId}
          className={cn(
            "text-xs",
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
