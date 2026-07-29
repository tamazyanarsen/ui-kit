import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { cn } from "@/lib/utils"

interface RadioOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
}

type RadioProps = RadioPrimitive.Root.Props & RadioOwnProps

// Individual radio button, meant to be used inside <RadioGroup>. Same
// label/comment/error field pattern as Checkbox — see that component for
// the rationale (mirrors Input's built-in caption slot). No `indeterminate`
// here: unlike Checkbox's "Partial", a single radio has no meaningful mixed
// state (the spec's properties table lists a "Partial" row for Radio too,
// but it's a copy-paste artifact from Checkbox's template — nothing in the
// anatomy or Base UI's Radio primitive supports it).
function Radio({
  className,
  disabled,
  label,
  comment,
  error,
  id,
  ...props
}: RadioProps) {
  const generatedId = React.useId()
  const radioId = id ?? generatedId
  const hasCaption = Boolean(comment || error)
  const captionId = hasCaption ? `${radioId}-caption` : undefined

  const circle = (
    <RadioPrimitive.Root
      id={radioId}
      data-slot="radio"
      disabled={disabled}
      aria-describedby={captionId}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border outline-none transition-colors",
        "border-[var(--radio-border)] bg-[var(--radio-bg)]",
        "not-data-[disabled]:hover:border-[var(--radio-border-hover)]",
        "data-[checked]:border-transparent data-[checked]:bg-[var(--radio-checked-bg)] not-data-[disabled]:data-[checked]:hover:bg-[var(--radio-checked-bg-hover)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:!border-[var(--radio-disabled-border)] data-[disabled]:!bg-[var(--radio-disabled-bg)]",
        error && "!border-[var(--radio-border-error)]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-indicator"
        className={cn(
          "size-2.5 rounded-full bg-[var(--radio-checked-dot)]",
          disabled && "!bg-[var(--radio-disabled-dot)]"
        )}
      />
    </RadioPrimitive.Root>
  )

  if (!label && !hasCaption) {
    return circle
  }

  return (
    <label
      htmlFor={radioId}
      className={cn(
        "inline-flex items-start gap-4",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {circle}
      <span className="flex flex-col gap-1 pt-0.5">
        {label && (
          <span
            className={cn(
              "text-sm font-medium text-[var(--radio-label-fg)]",
              disabled && "text-[var(--radio-label-fg-disabled)]"
            )}
          >
            {label}
          </span>
        )}
        {hasCaption && (
          <span
            id={captionId}
            className={cn(
              "text-xs",
              error
                ? "text-[var(--radio-caption-error-fg)]"
                : "text-[var(--radio-caption-fg)]"
            )}
          >
            {error ?? comment}
          </span>
        )}
      </span>
    </label>
  )
}

export { Radio }
