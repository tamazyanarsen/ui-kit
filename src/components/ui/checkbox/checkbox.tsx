import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check, Minus } from "@/icons"

import { cn } from "@/lib/utils"

interface CheckboxOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
}

type CheckboxProps = CheckboxPrimitive.Root.Props & CheckboxOwnProps

// Standalone, interactive Checkbox (Base UI Checkbox.Root renders a <span
// role="checkbox">, not a native input — so state variants below use the
// bracket `data-[x]:` form throughout, not `disabled:`/bare `data-x:`,
// per the Tailwind v4 presence-vs-value heuristic gotcha (see
// ComboboxCheckbox, the read-only sibling of this component that predates
// it and hits the same issue).
//
// `label`/`comment`/`error` are optional, matching Input's field pattern —
// omit them for the bare 24×24 box ("Checkbox Without Text" in the spec).
// `error` replaces `comment` (doesn't stack with it), also matching Input.
function Checkbox({
  className,
  disabled,
  indeterminate,
  label,
  comment,
  error,
  id,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId
  const hasCaption = Boolean(comment || error)
  const captionId = hasCaption ? `${checkboxId}-caption` : undefined

  const box = (
    <CheckboxPrimitive.Root
      id={checkboxId}
      data-slot="checkbox"
      disabled={disabled}
      indeterminate={indeterminate}
      aria-describedby={captionId}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md border text-transparent outline-none transition-colors",
        "border-[var(--checkbox-border)] bg-[var(--checkbox-bg)]",
        // Scoped to unchecked/non-indeterminate only — otherwise this and
        // the "checked → border-transparent" rule below both target
        // border-color at equal specificity, and whichever Tailwind happens
        // to emit later in the stylesheet wins, letting the dark hover
        // border reappear on a checked box instead of staying transparent.
        "not-data-[disabled]:not-data-[checked]:not-data-[indeterminate]:hover:border-[var(--checkbox-border-hover)]",
        "data-[checked]:border-transparent data-[checked]:bg-[var(--checkbox-checked-bg)] data-[checked]:text-[var(--checkbox-checked-fg)] not-data-[disabled]:data-[checked]:hover:bg-[var(--checkbox-checked-bg-hover)]",
        "data-[indeterminate]:border-transparent data-[indeterminate]:bg-[var(--checkbox-checked-bg)] data-[indeterminate]:text-[var(--checkbox-checked-fg)] not-data-[disabled]:data-[indeterminate]:hover:bg-[var(--checkbox-checked-bg-hover)]",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:!border-[var(--checkbox-disabled-border)] data-[disabled]:!bg-[var(--checkbox-disabled-bg)] data-[disabled]:data-[checked]:!text-[var(--checkbox-disabled-fg)] data-[disabled]:data-[indeterminate]:!text-[var(--checkbox-disabled-fg)]",
        error && "!border-[var(--checkbox-border-error)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
        keepMounted={false}
      >
        {indeterminate ? (
          <Minus aria-hidden="true" className="size-4" strokeWidth={3} />
        ) : (
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label && !hasCaption) {
    return box
  }

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "inline-flex items-start gap-4",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {box}
      <span className="flex flex-col gap-1 pt-0.5">
        {label && (
          <span
            className={cn(
              "text-sm font-medium text-[var(--checkbox-label-fg)]",
              disabled && "text-[var(--checkbox-label-fg-disabled)]"
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
                ? "text-[var(--checkbox-caption-error-fg)]"
                : "text-[var(--checkbox-caption-fg)]"
            )}
          >
            {error ?? comment}
          </span>
        )}
      </span>
    </label>
  )
}

export { Checkbox }
