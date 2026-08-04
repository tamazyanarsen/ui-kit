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
    // Round-2 audit fix: outer gap was gap-1.5 (6px); the root component
    // frame in Figma (e.g. 687:18395) is a flex-col with a uniform
    // gap-[4px] between Range/Indicators/Comment.
    <div className={cn("flex w-full flex-col gap-1", className)}>
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
            // Round-2 audit fix: horizontal/top padding was md:px-5 md:pt-2.5
            // (20px/10px) on desktop — get_design_context on both the
            // Desktop and Mobile Default symbols (687:18395, 14378:41564)
            // shows px-[16px] on both breakpoints, and py-[8px] on desktop
            // specifically (mobile is asymmetric pt-7/pb-5, already
            // approximated by the shared pt-2 here), so padding doesn't
            // change across breakpoints at all — only the box height does.
            "relative flex h-12 w-full flex-col gap-1 rounded-[16px] border px-4 pt-2 transition-colors md:h-14",
            "border-[var(--range-input-border)] bg-[var(--range-input-bg)]",
            "not-has-[[data-disabled]]:hover:border-[var(--range-input-border-hover)]",
            "not-has-[[data-disabled]]:has-[:focus-visible]:border-[var(--range-input-border-hover)]",
            "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:!border-[var(--range-input-border-disabled)] has-[[data-disabled]]:!bg-[var(--range-input-bg-disabled)]"
          )}
        >
          {label && (
            <SliderPrimitive.Label
              data-slot="range-input-label"
              className="text-xs leading-tight font-medium text-[var(--range-input-label-fg)]"
            >
              {label}
            </SliderPrimitive.Label>
          )}
          <SliderPrimitive.Value
            data-slot="range-input-value"
            className={cn(
              "text-sm leading-tight font-medium text-[var(--range-input-value-fg)] md:text-base",
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
            className="absolute inset-x-4 bottom-0 flex h-4 translate-y-1/2 items-center md:h-5"
          >
            <SliderPrimitive.Track
              data-slot="range-input-track"
              className={cn(
                // Round-2 audit fix: track thickness was h-1 (4px); the
                // Line asset in every state (687:18395 etc.) is a literal
                // 3px-tall rect.
                "relative h-[3px] w-full rounded-full bg-[var(--range-input-track-bg)]"
              )}
            >
              <SliderPrimitive.Indicator
                data-slot="range-input-indicator"
                className={cn(
                  // Round-2 audit fix: pixel-sampling the Default/Hover/
                  // Focused screenshots shows the filled portion of the
                  // track (this Indicator) is a constant #2FCEEF, distinct
                  // from the thumb's #80E3FF — it was previously sharing
                  // --range-input-accent with the thumb, which pixel
                  // evidence disproves. See --range-input-indicator-bg.
                  "absolute h-full rounded-full bg-[var(--range-input-indicator-bg)]",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  error && "!bg-[var(--range-input-accent-error)]"
                )}
              />
              <SliderPrimitive.Thumb
                data-slot="range-input-thumb"
                className={cn(
                  "top-1/2 flex h-4 w-8 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-[var(--range-input-accent)] outline-none transition-colors select-none md:h-5 md:w-10",
                  // Round-2 audit fix: dropped the :hover recolor to
                  // --range-input-accent-hover — pixel-sampling the whole-
                  // box Hover state screenshot (14342:39910) shows the
                  // thumb staying #80E3FF; that darker blue belongs to the
                  // indicator permanently, not the thumb on hover (see
                  // Indicator above).
                  "focus-visible:ring-3 focus-visible:ring-ring/50",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  error && "!bg-[var(--range-input-accent-error)]"
                )}
              >
                <ChevronLeft
                  className={cn(
                    "size-2.5 text-[var(--range-input-thumb-icon-fg)]",
                    // Round-2 audit fix: Disabled symbol's chevron SVGs are
                    // fill="white", but disabled previously fell through to
                    // the default dark icon color.
                    disabled && "text-[var(--range-input-thumb-icon-fg-disabled)]",
                    error && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
                <ChevronRight
                  className={cn(
                    "size-2.5 text-[var(--range-input-thumb-icon-fg)]",
                    disabled && "text-[var(--range-input-thumb-icon-fg-disabled)]",
                    error && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </div>
      </SliderPrimitive.Root>

      {/* Round-2 audit fix: this used to be one wrapper div with px-1
          (4px); the Figma "Indicators" and "Comment" rows (e.g.
          43253:13680, 17156:6575) both use px-[16px] to align with the
          box's own inner padding, and Indicators additionally carries its
          own pt-[8px] on top of the parent's gap-4 that Comment doesn't
          have — split into two siblings so each row's padding matches its
          own Figma counterpart independently. */}
      {scaleLabels && scaleLabels.length > 0 && (
        <div className="flex items-center justify-between px-4 pt-2 text-p3 font-medium text-[var(--range-input-scale-fg)]">
          {scaleLabels.map((scaleLabel, index) => (
            <span key={index}>{scaleLabel}</span>
          ))}
        </div>
      )}
      {hasCaption && (
        <p
          className={cn(
            "px-4 text-p3 font-medium",
            error
              ? "text-[var(--range-input-caption-error-fg)]"
              : "text-[var(--range-input-caption-fg)]"
          )}
        >
          {error ?? comment}
        </p>
      )}
    </div>
  )
}

export { RangeInput }
