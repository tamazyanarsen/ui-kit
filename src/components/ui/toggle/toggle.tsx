import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"
import { CONTROL_TEXT_COLUMN_CLASS } from "@/lib/control-text-column"

interface ToggleOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  /** Строка — текст ошибки; `true` — только состояние ошибки, без текста. */
  error?: React.ReactNode
}

type ToggleProps = SwitchPrimitive.Root.Props & ToggleOwnProps

// Дорожка никогда не меняет цвет из-за `error` (это делает только коробка
// у Checkbox и Radio): по макету ошибка влияет лишь на подпись снизу. И, в
// отличие от Checkbox и Radio, `comment` и `error` здесь складываются, а не
// заменяют друг друга (см. ряд «Error» в анатомии: «Comment» и красная
// строка ошибки рисуются вместе).
// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
const Toggle = React.forwardRef<HTMLSpanElement, ToggleProps>(function Toggle({
  className,
  disabled,
  label,
  comment,
  error,
  id,
  ...props
}, ref) {
  const generatedId = React.useId()
  const toggleId = id ?? generatedId
  // Дизайн-чек 3/3 №6: `error` принимает и `true` — состояние ошибки без
  // текста (у тогла трек не краснеет, поэтому визуально это ничего не
  // добавляет, но контрол «Error» остаётся независимым от «Show Error Text»).
  const errorText = typeof error === "boolean" ? null : error
  const hasCaption = Boolean(comment || errorText)
  const commentId = comment ? `${toggleId}-comment` : undefined
  const errorId = errorText ? `${toggleId}-error` : undefined
  const describedBy = [commentId, errorId].filter(Boolean).join(" ") || undefined

  const track = (
    <SwitchPrimitive.Root
      id={toggleId}
      ref={ref}
      data-slot="toggle"
      disabled={disabled}
      // Ошибку видно не только глазами: без `aria-invalid` скринридер
      // объявляет тумблер обычным, сколько бы красного вокруг ни нарисовали.
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        "relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full outline-none transition-colors",
        "bg-[var(--toggle-track-bg)] not-data-[disabled]:hover:bg-[var(--toggle-track-bg-hover)]",
        "data-[checked]:bg-[var(--toggle-track-checked-bg)] not-data-[disabled]:data-[checked]:hover:bg-[var(--toggle-track-checked-bg-hover)]",
        "focus-visible:focus-ring",
        "data-[disabled]:cursor-not-allowed data-[disabled]:!bg-[var(--toggle-track-bg-disabled)] data-[disabled]:data-[checked]:!bg-[var(--toggle-track-checked-bg-disabled)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="toggle-thumb"
        // Ползунок 16px с отступом 4px со всех сторон, ход 24px — снято с
        // собственного SVG мастера, где кружок имеет r=8 с центром в
        // (12,12) в выключенном положении и (36,12) во включённом внутри
        // дорожки 48×24. Прежняя пара 18px и 3px взялась с глазомера по
        // скриншоту.
        className="absolute top-1 left-1 size-4 rounded-full bg-[var(--toggle-thumb-bg)] transition-transform data-[checked]:translate-x-6"
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
      {/* Тумблер справа в мобильной форме — дизайн-чек от 07.09, замечания
          9 и 25. Правила колонки — в `lib/control-text-column.ts`; у
          тумблера они те же, только сдвиг на 2px отсчитывается от дорожки
          высотой 24px, а не от коробки. */}
      {/* Текстовая колонка контрола — правила переворота, отступов и
          переноса см. в `lib/control-text-column.ts`. */}
      <span className={CONTROL_TEXT_COLUMN_CLASS}>
        {label && (
          <span
            className={cn(
              "text-p2-medium text-[var(--toggle-label-fg)] desktop:text-p1-medium",
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
              "text-p3-medium",
              disabled
                ? "text-[var(--toggle-caption-fg-disabled)]"
                : "text-[var(--toggle-caption-fg)]"
            )}
          >
            {comment}
          </span>
        )}
        {errorText && (
          <span
            id={errorId}
            className="text-p3-medium text-[var(--toggle-caption-error-fg)]"
          >
            {errorText}
          </span>
        )}
      </span>
    </label>
  )
})

export { Toggle }
export type { ToggleProps }
