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
// Padding is a uniform 16px on both breakpoints (confirmed against the live
// Figma component) — not reduced on mobile.
//
// Высота задана явно: мастер `ELK / text-area` (137:2610 Empty и 137:2617
// Filled) в обоих состояниях — `h-[112px]` на Desktop и 98 на Mobile, с
// `min-h-[56px]` и текстом `flex-[1_0_0]`, т.е. рамка НЕ меняет высоту при
// заполнении. Раньше высота была чисто контентной (rows=3), что давало
// 110px на десктопе — на 2px меньше мастера; мобильная при этом совпадала
// случайно. `min-h-*`, а не `h-*`, чтобы поле по-прежнему могло вырасти
// под большее число строк и переопределяться через className.
const textareaBoxVariants = cva(
  "group/textarea relative flex min-h-[98px] w-full flex-col gap-1 rounded-[16px] border border-[var(--input-border)] bg-[var(--input-bg)] p-4 transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:border-[var(--input-border-disabled)] has-[:disabled]:bg-[var(--input-bg-disabled)] md:min-h-[112px]",
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
  placeholder,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${textareaId}-caption` : undefined

  // Floating label, matching Input: empty + unfocused shows the label as the
  // field's own placeholder (large, grey); once there's a value or focus, a
  // small 12px caption takes its place above the text instead. Unlike
  // Input's single-line box (which absolutely-positions the label over the
  // value and needs a manual pt-* compensation), the label here is a normal
  // flex child — hidden/shown via `group-has-*` — so the textarea gets
  // pushed down by ordinary layout instead of a positioning hack. (Can't use
  // `peer-*` here: the label isn't a *direct* sibling of the textarea, it's
  // nested one level down in the label/lock row, and the sibling combinator
  // `peer-*` relies on doesn't reach into a sibling's descendants — same
  // class of bug as Radio's group-disabled fix.) The box's own vertical
  // padding shrinks from 16px to 8px in that same state, matching the live
  // Figma component's Empty-vs-Filled padding exactly.
  const hasFloatingLabel = Boolean(label)
  const resolvedPlaceholder = hasFloatingLabel
    ? typeof label === "string"
      ? label
      : placeholder
    : placeholder

  return (
    // Round-2 audit fix: gap was gap-1.5 (6px); the Figma root frame for
    // the Comment/Error variants (7426:2047, 158:3743) is a flex-col with
    // gap-[4px] between the box and the caption row.
    <div className="flex w-full flex-col gap-1">
      <div
        className={cn(
          textareaBoxVariants({ invalid, interactive: !locked }),
          hasFloatingLabel &&
            "has-[textarea:not(:placeholder-shown)]:py-2 has-[textarea:focus]:py-2",
          containerClassName
        )}
      >
        <textarea
          id={textareaId}
          data-slot="textarea"
          rows={rows}
          disabled={disabled}
          readOnly={locked}
          placeholder={resolvedPlaceholder}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          aria-readonly={locked || undefined}
          className={cn(
            // Round-2 audit fix: disabled text color was --input-fg-disabled
            // (#C8C8CB) — get_design_context on the live Disabled/Filled and
            // Disabled+Locked symbols (137:2616, 11282:15677) both show the
            // typed value text as #6D6D6D, not the lighter Input grey.
            // Also added hover:placeholder darkening: the Empty+Hover symbol
            // (137:2607, and its Error variant 158:3743) shows the
            // placeholder-as-label text going from #999 to #6D6D6D on
            // hover — same tone as --textarea-border-hover — which this
            // component previously never did.
            "order-2 min-w-0 flex-1 resize-none bg-transparent text-p2-medium text-[var(--input-fg)] outline-none placeholder:text-[var(--input-label-fg)] hover:placeholder:text-[var(--textarea-border-hover)] disabled:cursor-not-allowed disabled:text-[var(--textarea-fg-disabled)] md:text-p1-medium",
            className
          )}
          {...props}
        />
        {(label || locked) && (
          <div className="order-1 flex items-start gap-2">
            {label && (
              // Round-2 audit fix: dropped the group-has-disabled color
              // override — get_design_context on the Disabled/Filled and
              // Disabled+Locked symbols (137:2616, 11282:15677) both show
              // the small 12px label staying --input-label-fg (#999) when
              // disabled, same as every other state; it never recolors.
              <label
                htmlFor={textareaId}
                className="hidden flex-1 truncate text-p3-medium text-[var(--input-label-fg)] group-focus-within/textarea:block group-has-[textarea:not(:placeholder-shown)]/textarea:block"
              >
                {label}
              </label>
            )}
            {locked && (
              <Lock
                aria-hidden="true"
                // Round-2 audit fix: disabled color was --input-fg-disabled
                // (#C8C8CB) — the Disabled+Locked lock icon SVG
                // (11282:15677) is fill="#999999", matching --input-label-fg
                // exactly rather than the lighter Input grey.
                className="ml-auto size-4 shrink-0 text-[var(--input-icon-fg)] group-has-[:disabled]/textarea:text-[var(--textarea-icon-fg-disabled)]"
              />
            )}
          </div>
        )}
      </div>
      {(comment || error) && (
        // Round-2 audit fix: missing px-4 and font-medium — the Figma
        // Comment/Error rows (52140:162226, 52140:162391) both use
        // px-[16px] (aligning with the box's own inner padding) and
        // font-['Object_Sans:Medium'], neither of which this caption had.
        <p
          id={captionId}
          className={cn(
            "px-4 text-p3-medium",
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
export type { TextareaProps }
