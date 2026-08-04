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
// the rationale (mirrors Input's built-in caption slot); `error` replaces
// `comment` rather than stacking, same as Checkbox. No `indeterminate`
// here: unlike Checkbox's "Partial", a single radio has no meaningful
// mixed state (the spec's properties table lists a "Partial" row for Radio
// too, but it's a copy-paste artifact from Checkbox's template — no
// "Partial" variant actually exists in the anatomy's built symbols, unlike
// "Error" below).
//
// Round-2 audit: a prior pass here reasoned "no error variant exists for
// Radio" (design-check #44) — that was wrong. get_design_context on the
// anatomy's own Error=True symbols (600:8785 Desktop / 600:8790 Mobile)
// shows a real, fully-styled variant: red circle border + red caption
// text, structurally identical to Checkbox's error box.
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
        // `group/circle` — RadioGroup can disable this via context (e.g.
        // `<RadioGroup disabled>`) without ever passing the `disabled` prop
        // to this specific Radio, so the indicator dot below reacts to the
        // rendered `data-disabled` attribute (group-data-*) rather than the
        // `disabled` prop, which only covers the direct-prop case. Same
        // reasoning for the label/caption's `group-has-*` further below.
        "group/circle flex size-6 shrink-0 items-center justify-center rounded-full border outline-none transition-colors",
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
        className="size-2 rounded-full bg-[var(--radio-checked-dot)] group-data-[disabled]/circle:!bg-[var(--radio-disabled-dot)]"
      />
    </RadioPrimitive.Root>
  )

  if (!label && !hasCaption) {
    return circle
  }

  return (
    <label
      htmlFor={radioId}
      className="group inline-flex cursor-pointer items-start gap-4 has-data-[disabled]:cursor-not-allowed"
    >
      {circle}
      {/* Same 0-gap, mobile-only pt-0.5 rule as Checkbox — see its comment
          (verified identically against Radio's own 600:8785/600:8778
          instances: no gap between label/caption lines, no top offset at
          Desktop). */}
      <span className="flex flex-col pt-0.5 md:pt-0">
        {label && (
          <span className="text-p2-medium text-[var(--radio-label-fg)] md:text-p1-medium group-has-data-[disabled]:text-[var(--radio-label-fg-disabled)]">
            {label}
          </span>
        )}
        {hasCaption && (
          <span
            id={captionId}
            className={cn(
              "text-p3-medium",
              error
                ? "text-[var(--radio-caption-error-fg)]"
                : "text-[var(--radio-caption-fg)]",
              // `!` forces this to win regardless of Tailwind's declaration
              // order vs. the error/default class above — same precedence
              // issue Checkbox's box className comment calls out.
              "group-has-data-[disabled]:!text-[var(--radio-caption-fg-disabled)]"
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
