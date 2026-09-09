import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { cn } from "@/lib/utils"

interface RadioOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  /** Строка — текст ошибки; `true` — только состояние ошибки, без текста. */
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
  // Дизайн-чек 3/3 №2: состояние ошибки и её текст переключаются отдельно,
  // поэтому `error` принимает и `true` (только красная обводка, без текста).
  // В Figma подпись — один слой («Text Error» в обоих вариантах Error=True/False,
  // 600:8773 / 600:8785), который просто краснеет, поэтому текст ошибки и
  // комментарий делят одну строку, а не стакаются.
  const invalid = Boolean(error)
  const errorText = typeof error === "boolean" ? null : error
  const caption = errorText ?? comment
  const hasCaption = Boolean(caption)
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
        // Дизайн-чек 3/3 №1: ховер-обводка только для НЕвыбранного кружка.
        // Без `not-data-[checked]` этот класс сортируется после
        // `data-[checked]:border-transparent` и в состоянии Checked+Hover
        // возвращает тёмное кольцо, которого в макете (600:8823 / 600:8829) нет.
        "not-data-[disabled]:not-data-[checked]:hover:border-[var(--radio-border-hover)]",
        "data-[checked]:border-transparent data-[checked]:bg-[var(--radio-checked-bg)] not-data-[disabled]:data-[checked]:hover:bg-[var(--radio-checked-bg-hover)]",
        "focus-visible:focus-ring",
        "data-[disabled]:cursor-not-allowed data-[disabled]:!border-[var(--radio-disabled-border)] data-[disabled]:!bg-[var(--radio-disabled-bg)]",
        invalid && "!border-[var(--radio-border-error)]",
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
      // `flex`, not `inline-flex` — see Checkbox's identical fix/comment:
      // an inline-level label wrapper lets its parent's line-box height
      // shift by a couple px when the inline icon content changes on
      // toggle, making the row visibly jump.
      className="group flex cursor-pointer items-start gap-4 has-data-[disabled]:cursor-not-allowed"
    >
      {circle}
      {/* Same 0-gap, mobile-only pt-0.5 rule as Checkbox — see its comment
          (verified identically against Radio's own 600:8785/600:8778
          instances: no gap between label/caption lines, no top offset at
          Desktop). */}
      {/* Кружок справа в мобильной форме — дизайн-чек от 07.09, замечания
          9 и 25; механика и обоснование те же, что у Checkbox. */}
      {/* ⚠️ `min-w-0 flex-1` на ОБОИХ брейкпоинтах, а не `desktop:flex-none`.
          Дизайн-чек от 08.09, замечание 27: «Чекбокс должен упираться в блок…
          Сейчас вышел за границу блока. Должен встраиваться и тексты должны
          переноситься. Правку применить на всех подобных кейсах». С
          `flex-none` текстовый блок брал ширину содержимого, и длинная подпись
          («Отказаться от получения последнего транша финансирования по
          договору подряда») вылезала за правый край блока вместо переноса.
          `min-w-0` обязателен рядом с `flex-1`: у флекс-элемента
          автоматический минимум — min-content, и без него перенос всё равно
          не случился бы. */}
      <span className="order-first flex min-w-0 flex-1 flex-col pt-0.5 desktop:order-none desktop:pt-0">
        {label && (
          <span className="text-p2-medium text-[var(--radio-label-fg)] desktop:text-p1-medium group-has-data-[disabled]:text-[var(--radio-label-fg-disabled)]">
            {label}
          </span>
        )}
        {hasCaption && (
          <span
            id={captionId}
            className={cn(
              "text-p3-medium",
              invalid
                ? "text-[var(--radio-caption-error-fg)]"
                : "text-[var(--radio-caption-fg)]",
              // `!` forces this to win regardless of Tailwind's declaration
              // order vs. the error/default class above — same precedence
              // issue Checkbox's box className comment calls out.
              "group-has-data-[disabled]:!text-[var(--radio-caption-fg-disabled)]"
            )}
          >
            {caption}
          </span>
        )}
      </span>
    </label>
  )
}

export { Radio }
export type { RadioProps }
