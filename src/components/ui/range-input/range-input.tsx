import * as React from "react"
import { ChevronLeft, ChevronRight } from "@/icons"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

interface RangeInputOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  scaleLabels?: React.ReactNode[]
  format?: Intl.NumberFormatOptions
}

type RangeInputProps = Omit<SliderPrimitive.Root.Props<number>, "children"> &
  RangeInputOwnProps

// Single-thumb slider styled as an Input-like bordered box: Label + formatted
// Value stacked on top, track along the bottom. Unlike Checkbox/Radio, error
// state does NOT recolor the box border (that stays --range-input-border,
// matching Input's convention) — only the track/thumb accent and the caption
// text turn red.
function RangeInput({
  className,
  label,
  comment,
  error,
  scaleLabels,
  format,
  disabled,
  ...props
}: RangeInputProps) {
  const hasCaption = Boolean(comment || error)

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <SliderPrimitive.Root
        data-slot="range-input"
        disabled={disabled}
        format={format}
        {...props}
      >
        <div
          data-slot="range-input-box"
          className={cn(
            // Fixed box height (55px desktop / 47px mobile, measured from the
            // rect in ui/range input/range Input.svg) — practically identical
            // to Input's own L convention (h-12/md:h-14). An earlier version
            // let padding + oversized Value text drive an auto height, which
            // ballooned the box to ~86px; don't repeat that.
            "relative flex h-12 w-full flex-col gap-1 rounded-2xl border px-4 pt-2 transition-colors md:h-14 md:px-5 md:pt-2.5",
            "border-[var(--range-input-border)] bg-[var(--range-input-bg)]",
            "not-has-[[data-disabled]]:hover:border-[var(--range-input-border-hover)]",
            "not-has-[[data-disabled]]:has-[:focus-visible]:border-[var(--range-input-border-hover)]",
            "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:!border-[var(--range-input-border-disabled)] has-[[data-disabled]]:!bg-[var(--range-input-bg-disabled)]"
          )}
        >
          {label && (
            <SliderPrimitive.Label
              data-slot="range-input-label"
              className="text-xs leading-tight text-[var(--range-input-label-fg)]"
            >
              {label}
            </SliderPrimitive.Label>
          )}
          <SliderPrimitive.Value
            data-slot="range-input-value"
            className={cn(
              "text-base leading-tight font-medium text-[var(--range-input-value-fg)] md:text-lg",
              disabled && "!text-[var(--range-input-value-fg-disabled)]"
            )}
          />
          {/* Track sits ON the box's bottom border, not inside the padding —
              confirmed by pixel-cropping the anatomy raster: the thumb pill
              visibly straddles the border, half in/half out. Control is
              absolutely positioned at bottom-0 and shifted down by half its
              own height to center the track line on the border. */}
          <SliderPrimitive.Control
            data-slot="range-input-control"
            className="absolute inset-x-4 bottom-0 flex h-4 translate-y-1/2 items-center md:inset-x-5 md:h-5"
          >
            <SliderPrimitive.Track
              data-slot="range-input-track"
              className={cn(
                "relative h-1 w-full rounded-full bg-[var(--range-input-track-bg)]"
              )}
            >
              <SliderPrimitive.Indicator
                data-slot="range-input-indicator"
                className={cn(
                  "absolute h-full rounded-full bg-[var(--range-input-accent)]",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  error && "!bg-[var(--range-input-accent-error)]"
                )}
              />
              <SliderPrimitive.Thumb
                data-slot="range-input-thumb"
                className={cn(
                  "top-1/2 flex h-4 w-8 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-[var(--range-input-accent)] outline-none transition-colors select-none md:h-5 md:w-10",
                  "not-data-[disabled]:hover:bg-[var(--range-input-accent-hover)]",
                  "focus-visible:ring-3 focus-visible:ring-ring/50",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  error && "!bg-[var(--range-input-accent-error)]"
                )}
              >
                <ChevronLeft
                  className={cn(
                    "size-2.5 text-[var(--range-input-thumb-icon-fg)]",
                    error && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
                <ChevronRight
                  className={cn(
                    "size-2.5 text-[var(--range-input-thumb-icon-fg)]",
                    error && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </div>
      </SliderPrimitive.Root>

      {(scaleLabels?.length || hasCaption) && (
        <div className="flex flex-col gap-1 px-1">
          {scaleLabels && scaleLabels.length > 0 && (
            <div className="flex items-center justify-between text-xs text-[var(--range-input-scale-fg)]">
              {scaleLabels.map((scaleLabel, index) => (
                <span key={index}>{scaleLabel}</span>
              ))}
            </div>
          )}
          {hasCaption && (
            <p
              className={cn(
                "text-xs",
                error
                  ? "text-[var(--range-input-caption-error-fg)]"
                  : "text-[var(--range-input-caption-fg)]"
              )}
            >
              {error ?? comment}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export { RangeInput }
