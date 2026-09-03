import * as React from "react"
// The thumb uses Figma's dedicated small-arrow glyphs (nodes 21461:49447/
// 21461:49448), not the regular chevrons — see icons/arrow-right-small.tsx
// for why they are not interchangeable.
import { ArrowLeftSmall, ArrowRightSmall } from "@/icons"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"
import { GROUP_SPACES, formatSignSpacing } from "@/lib/number-format"
import { useCopyWithoutSeparators } from "@/lib/use-copy-without-separators"

interface RangeInputOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  /** Строка — текст ошибки; `true` — только состояние ошибки, без текста. */
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
  // Дизайн-чек 3/3 №3: состояние ошибки и её текст переключаются отдельно,
  // поэтому `error` принимает и `true` — красная шкала без подписи.
  const invalid = Boolean(error)
  const errorText = typeof error === "boolean" ? null : error
  const caption = errorText ?? comment
  const hasCaption = Boolean(caption)
  // Разрядный пробел — отбивка по 3 разряда, а не символ значения: в буфер
  // уходит «5000000», а не «5 000 000».
  const copyWithoutSeparators = useCopyWithoutSeparators(GROUP_SPACES)

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
            // to Input's own L convention (h-12/desktop:h-14). An earlier version
            // let padding + oversized Value text drive an auto height, which
            // ballooned the box to ~86px; don't repeat that.
            // Round-2 audit fix: horizontal/top padding was desktop:px-5 desktop:pt-2.5
            // (20px/10px) on desktop — get_design_context on both the
            // Desktop and Mobile Default symbols (687:18395, 14378:41564)
            // shows px-[16px] on both breakpoints.
            //
            // Дизайн-чек №3 №19: «Наезд полосы на текст… в узком
            // представлении активизируется вариант mobile, и он собран не
            // pixel-perfect». Причин было две, обе в вертикали мобильной
            // коробки: (1) `pt-2` без нижнего отступа — Value доходил ровно
            // до нижней границы, по которой идёт полоса; в мастере отступы
            // асимметричные, pt-[7px]/pb-[5px] (7 + 16 + 20 + 5 = 48).
            // (2) `gap-1` между Label и Value — в обоих мастерах блок
            // Label/Value идёт без зазора, а 4px лишней высоты и выдавливали
            // текст на полосу. Десктоп: py-[8px] (8 + 16 + 24 + 8 = 56).
            "relative flex h-12 w-full flex-col justify-center rounded-[16px] border px-4 pt-[7px] pb-[5px] transition-colors desktop:h-14 desktop:py-2",
            "border-[var(--range-input-border)] bg-[var(--range-input-bg)]",
            "not-has-[[data-disabled]]:hover:border-[var(--range-input-border-hover)]",
            "not-has-[[data-disabled]]:has-[:focus-visible]:border-[var(--range-input-border-hover)]",
            "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:!border-[var(--range-input-border-disabled)] has-[[data-disabled]]:!bg-[var(--range-input-bg-disabled)]"
          )}
        >
          {label && (
            <SliderPrimitive.Label
              data-slot="range-input-label"
              className="text-p3-medium text-[var(--range-input-label-fg)]"
            >
              {label}
            </SliderPrimitive.Label>
          )}
          {/* Значение проходит через общий модуль формата чисел, а не
              отдаётся ICU как есть. Две правки, обе сквозные:

              • отбивка знака НЕ одна на все — `%`, `‰`, `°` набираются
                вплотную к числу («50%»), а знак валюты через неразрывный
                пробел («1 200 000 ₽»). ICU для `ru-RU` отбивает пробелом
                всё подряд;
              • разрядный пробел приводится к одному символу: ICU в части
                сборок отдаёт узкий неразрывный, и снятие разрядов при
                копировании по нему промахивается.

              Копирование значения ползунка разряды снимает: «5 000 000» →
              «5000000» (см. `useCopyWithoutSeparators`). */}
          <SliderPrimitive.Value
            data-slot="range-input-value"
            {...copyWithoutSeparators}
            className={cn(
              // Figma's desktop symbol (687:18395) gives Label = P3 Medium
              // 12/16 and Value = P1 Medium 16/24. Both were `leading-tight`
              // before, i.e. 15px and 17.5px — off the scale entirely.
              "text-p2-medium text-[var(--range-input-value-fg)] desktop:text-p1-medium",
              disabled && "!text-[var(--range-input-value-fg-disabled)]"
            )}
          >
            {/* `formattedValues` — массив: у диапазона два конца. Склейка та
                же, что у Base UI по умолчанию (тире с пробелами). */}
            {(formattedValues) =>
              formattedValues.map(formatSignSpacing).join(" – ")
            }
          </SliderPrimitive.Value>
          {/* Track sits ON the box's bottom border, not inside the padding —
              confirmed by pixel-cropping the anatomy raster: the thumb pill
              visibly straddles the border, half in/half out. Control is
              absolutely positioned at bottom-0 and shifted down by half its
              own height to center the track line on the border. */}
          <SliderPrimitive.Control
            data-slot="range-input-control"
            className="absolute inset-x-4 bottom-0 flex h-4 translate-y-1/2 items-center desktop:h-5"
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
                  invalid && "!bg-[var(--range-input-accent-error)]"
                )}
              />
              <SliderPrimitive.Thumb
                data-slot="range-input-thumb"
                className={cn(
                  // No gap between the two arrows and a literal 12px radius,
                  // both straight off the Box layer of the Range Line symbols
                  // (mobile 21775:15468 — 32×16, no padding; desktop
                  // 21461:49446 — px-4/py-2 giving 40×20). `gap-0.5` squeezed
                  // the 16px icon boxes, and `rounded-full` resolved to 8px
                  // on mobile / 10px on desktop instead of 12px.
                  "top-1/2 flex h-4 w-8 -translate-y-1/2 items-center justify-center rounded-[12px] bg-[var(--range-input-accent)] outline-none transition-colors select-none desktop:h-5 desktop:w-10",
                  // Round-2 audit fix: dropped the :hover recolor to
                  // --range-input-accent-hover — pixel-sampling the whole-
                  // box Hover state screenshot (14342:39910) shows the
                  // thumb staying #80E3FF; that darker blue belongs to the
                  // indicator permanently, not the thumb on hover (see
                  // Indicator above).
                  "focus-visible:focus-ring",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  invalid && "!bg-[var(--range-input-accent-error)]"
                )}
              >
                {/* size-4: Figma places each small arrow in its own 16px
                    box (the glyph itself is 5.5×9 inside it). The old
                    size-2.5 shrank a regular chevron to 10px, which landed
                    both narrower and shorter than the spec. */}
                <ArrowLeftSmall
                  className={cn(
                    "size-4 text-[var(--range-input-thumb-icon-fg)]",
                    // Round-2 audit fix: Disabled symbol's chevron SVGs are
                    // fill="white", but disabled previously fell through to
                    // the default dark icon color.
                    disabled && "text-[var(--range-input-thumb-icon-fg-disabled)]",
                    invalid && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
                <ArrowRightSmall
                  className={cn(
                    "size-4 text-[var(--range-input-thumb-icon-fg)]",
                    disabled && "text-[var(--range-input-thumb-icon-fg-disabled)]",
                    invalid && "text-[var(--range-input-thumb-icon-fg-error)]"
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
        <div className="flex items-center justify-between px-4 pt-2 text-p3-medium text-[var(--range-input-scale-fg)]">
          {scaleLabels.map((scaleLabel, index) => (
            <span key={index}>{scaleLabel}</span>
          ))}
        </div>
      )}
      {hasCaption && (
        <p
          className={cn(
            "px-4 text-p3-medium",
            invalid
              ? "text-[var(--range-input-caption-error-fg)]"
              : "text-[var(--range-input-caption-fg)]"
          )}
        >
          {caption}
        </p>
      )}
    </div>
  )
}

export { RangeInput }
export type { RangeInputProps }
