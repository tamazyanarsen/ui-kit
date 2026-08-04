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
      {/* Same 0-gap rule as Checkbox/Radio (verified against 600:9113,
          whose stacked label+comment+error lines sum to exactly its own
          height with no extra space). Unlike Checkbox/Radio, `pt-0.5` here
          only kicks in *below* `md` — Desktop's toggle text wrapper has no
          top offset (600:9089) while Mobile's does (616:9482, pt-[2px]),
          the reverse direction from Checkbox/Radio but the same underlying
          cause: the mobile Option Text line-height (20px) is shorter than
          the fixed 24px track and needs the nudge to stay centered. */}
      <span className="flex flex-col pt-0.5 md:pt-0">
        {label && (
          <span
            className={cn(
              "text-p2 font-medium text-[var(--toggle-label-fg)] md:text-p1",
              disabled && "text-[var(--toggle-label-fg-disabled)]"
            )}
          >
            {label}
          </span>
        )}
        {comment && (
          <span
            id={commentId}
            className={cn(
              "text-p3 font-medium",
              disabled
                ? "text-[var(--toggle-caption-fg-disabled)]"
                : "text-[var(--toggle-caption-fg)]"
            )}
          >
            {comment}
          </span>
        )}
        {error && (
          <span
            id={errorId}
            className="text-p3 font-medium text-[var(--toggle-caption-error-fg)]"
          >
            {error}
          </span>
        )}
      </span>
    </label>
  )
}

export { Toggle }
