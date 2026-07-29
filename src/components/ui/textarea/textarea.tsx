import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Lock } from "@/icons"

import { cn } from "@/lib/utils"

// Sizing verified against ui/textarea/*.svg (exact vector rects, not just
// pixel-sampled PNGs): radius is 16px (not the theme's rounded-2xl, which
// computes to 18px here) and — unlike the earlier PNG-based read — desktop
// and mobile genuinely differ in height (111px vs 97px in the reference,
// both stroke-inclusive), mobile-first like Input's L size. Box height is
// still driven by the `rows` attribute + padding, not a hardcoded height,
// and stays constant across Empty/Filled/Lock states within a breakpoint.
const textareaBoxVariants = cva(
  "group/textarea relative flex w-full flex-col gap-1 rounded-[16px] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 transition-colors md:py-4 has-[:disabled]:cursor-not-allowed has-[:disabled]:border-[var(--input-border-disabled)] has-[:disabled]:bg-[var(--input-bg-disabled)]",
  {
    variants: {
      invalid: {
        true: "border-[var(--input-border-error)]",
        false: "",
      },
      interactive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        invalid: false,
        interactive: true,
        class:
          "hover:border-[var(--textarea-border-hover)] has-[textarea:focus]:border-[var(--textarea-border-hover)]",
      },
      {
        invalid: true,
        interactive: true,
        class:
          "hover:border-[var(--input-border-error-hover)] has-[textarea:focus]:border-[var(--input-border-error-hover)]",
      },
    ],
    defaultVariants: {
      invalid: false,
      interactive: true,
    },
  }
)

interface TextareaOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  locked?: boolean
  containerClassName?: string
}

type TextareaProps = Omit<React.ComponentProps<"textarea">, "size"> &
  Omit<VariantProps<typeof textareaBoxVariants>, "invalid" | "interactive"> &
  TextareaOwnProps

function Textarea({
  className,
  containerClassName,
  label,
  comment,
  error,
  locked = false,
  disabled,
  id,
  rows = 3,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${textareaId}-caption` : undefined

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div
        className={cn(
          textareaBoxVariants({ invalid, interactive: !locked }),
          containerClassName
        )}
      >
        {(label || locked) && (
          <div className="flex items-start justify-between gap-2">
            {label && (
              <label
                htmlFor={textareaId}
                className="truncate text-xs text-[var(--input-label-fg)] group-has-[:disabled]/textarea:text-[var(--input-fg-disabled)]"
              >
                {label}
              </label>
            )}
            {locked && (
              <Lock
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--input-icon-fg)] group-has-[:disabled]/textarea:text-[var(--input-fg-disabled)]"
              />
            )}
          </div>
        )}
        <textarea
          id={textareaId}
          data-slot="textarea"
          rows={rows}
          disabled={disabled}
          readOnly={locked}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          aria-readonly={locked || undefined}
          className={cn(
            "min-w-0 flex-1 resize-none bg-transparent text-sm text-[var(--input-fg)] outline-none placeholder:text-[var(--input-label-fg)] disabled:cursor-not-allowed disabled:text-[var(--input-fg-disabled)]",
            className
          )}
          {...props}
        />
      </div>
      {(comment || error) && (
        <p
          id={captionId}
          className={cn(
            "text-xs",
            error
              ? "text-[var(--input-caption-error-fg)]"
              : "text-[var(--input-caption-fg)]"
          )}
        >
          {error ?? comment}
        </p>
      )}
    </div>
  )
}

export { Textarea, textareaBoxVariants }
