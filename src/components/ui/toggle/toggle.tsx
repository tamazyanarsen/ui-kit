import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

interface ToggleOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
}

type ToggleProps = SwitchPrimitive.Root.Props & ToggleOwnProps

// Track never changes color for `error` (only Checkbox/Radio's box does) —
// per the spec, error only affects the caption below, and unlike
// Checkbox/Radio, `comment` and `error` stack rather than one replacing the
// other (see the anatomy's "Error" row: both "Comment" and the red error
// line render together).
function Toggle({
  className,
  disabled,
  label,
  comment,
  error,
  id,
  ...props
}: ToggleProps) {
  const generatedId = React.useId()
  const toggleId = id ?? generatedId
  const hasCaption = Boolean(comment || error)
  const commentId = comment ? `${toggleId}-comment` : undefined
  const errorId = error ? `${toggleId}-error` : undefined
  const describedBy = [commentId, errorId].filter(Boolean).join(" ") || undefined

  const track = (
    <SwitchPrimitive.Root
      id={toggleId}
      data-slot="toggle"
      disabled={disabled}
      aria-describedby={describedBy}
      className={cn(
        "relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full outline-none transition-colors",
        "bg-[var(--toggle-track-bg)] not-data-[disabled]:hover:bg-[var(--toggle-track-bg-hover)]",
        "data-[checked]:bg-[var(--toggle-track-checked-bg)] not-data-[disabled]:data-[checked]:hover:bg-[var(--toggle-track-checked-bg-hover)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:!bg-[var(--toggle-track-bg-disabled)] data-[disabled]:data-[checked]:!bg-[var(--toggle-track-checked-bg-disabled)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="toggle-thumb"
        className="absolute top-[3px] left-[3px] size-[18px] rounded-full bg-[var(--toggle-thumb-bg)] transition-transform data-[checked]:translate-x-6"
      />
    </SwitchPrimitive.Root>
  )

  if (!label && !hasCaption) {
    return track
  }

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        "inline-flex items-start gap-4",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {track}
      <span className="flex flex-col gap-1">
        {label && (
          <span
            className={cn(
              "text-sm font-medium text-[var(--toggle-label-fg)]",
              disabled && "text-[var(--toggle-label-fg-disabled)]"
            )}
          >
            {label}
          </span>
        )}
        {comment && (
          <span id={commentId} className="text-xs text-[var(--toggle-caption-fg)]">
            {comment}
          </span>
        )}
        {error && (
          <span
            id={errorId}
            className="text-xs text-[var(--toggle-caption-error-fg)]"
          >
            {error}
          </span>
        )}
      </span>
    </label>
  )
}

export { Toggle }
