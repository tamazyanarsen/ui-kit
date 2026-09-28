import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { cn } from "@/lib/utils"
import { resolveCaption } from "@/components/ui/input/caption"
import { CONTROL_TEXT_COLUMN_CLASS } from "@/lib/control-text-column"

interface RadioOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  /** Строка — текст ошибки; `true` — только состояние ошибки, без текста. */
  error?: React.ReactNode
}

type RadioProps = RadioPrimitive.Root.Props & RadioOwnProps

// Отдельная радиокнопка, предназначенная для использования внутри
// <RadioGroup>. Схема подписи, комментария и ошибки та же, что у Checkbox —
// обоснование см. там (повторяет встроенный слот подписи у Input); `error`
// заменяет собой `comment`, а не складывается с ним, тоже как у Checkbox.
// Свойства `indeterminate` здесь нет: в отличие от «Partial» у Checkbox, у
// одиночной радиокнопки смешанное состояние лишено смысла (в таблице
// свойств макета строка «Partial» у Radio есть, но это след копирования
// шаблона Checkbox — в отличие от «Error» ниже, никакого варианта «Partial»
// среди собранных символов анатомии нет).
//
// Второй проход: прежний проход заключил здесь, что «варианта ошибки у
// Radio не существует» (дизайн-чек, замечание 44), и это было неверно. У
// собственных символов анатомии с Error=True (Desktop и Mobile) виден
// настоящий, полностью оформленный вариант: красная рамка кружка и красный
// текст подписи, структурно совпадающий с коробкой ошибки у Checkbox.
// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
const Radio = React.forwardRef<HTMLSpanElement, RadioProps>(function Radio({
  className,
  disabled,
  label,
  comment,
  error,
  id,
  ...props
}, ref) {
  const generatedId = React.useId()
  const radioId = id ?? generatedId
  // Дизайн-чек 3/3 №2: состояние ошибки и её текст переключаются отдельно,
  // поэтому `error` принимает и `true` (только красная обводка, без текста).
  // В Figma подпись — один слой («Text Error» в обоих вариантах
  // Error=True/False), который просто краснеет, поэтому текст ошибки и
  // комментарий делят одну строку, а не стакаются.
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const hasCaption = Boolean(caption)
  const captionId = hasCaption ? `${radioId}-caption` : undefined

  const circle = (
    <RadioPrimitive.Root
      id={radioId}
      ref={ref}
      data-slot="radio"
      disabled={disabled}
      // Ошибку видно не только глазами: без `aria-invalid` скринридер
      // объявляет кнопку обычной, сколько бы красного вокруг ни нарисовали.
      aria-invalid={invalid || undefined}
      aria-describedby={captionId}
      className={cn(
        // `group/circle`: RadioGroup может выключить эту кнопку через
        // контекст (например, `<RadioGroup disabled>`), ни разу не передав
        // пропс `disabled` именно этой Radio. Поэтому точка-индикатор ниже
        // реагирует на отрисованный атрибут `data-disabled` (group-data-*),
        // а не на пропс `disabled`, который покрывает только случай прямой
        // передачи. То же рассуждение и для `group-has-*` у подписи ниже.
        "group/circle flex size-6 shrink-0 items-center justify-center rounded-full border outline-none transition-colors",
        "border-[var(--radio-border)] bg-[var(--radio-bg)]",
        // Дизайн-чек 3/3 №1: ховер-обводка только для НЕвыбранного кружка.
        // Без `not-data-[checked]` этот класс сортируется после
        // `data-[checked]:border-transparent` и в состоянии Checked+Hover
        // возвращает тёмное кольцо, которого в макете нет.
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
      // `flex`, а не `inline-flex` — см. такую же правку и комментарий у
      // Checkbox: обёртка подписи строчного уровня позволяет высоте
      // строчного бокса родителя скакнуть на пару пикселей, когда при
      // переключении меняется строчное содержимое значка, и строка заметно
      // дёргается.
      className="group flex cursor-pointer items-start gap-4 has-data-[disabled]:cursor-not-allowed"
    >
      {circle}
      {/* Кружок справа в мобильной форме — дизайн-чек от 07.09, замечания
          9 и 25. Правила колонки (переворот, отступы, перенос) — в
          `lib/control-text-column.ts`; на собственных инстансах Radio
          проверено, что они совпадают с Checkbox. */}
      <span className={CONTROL_TEXT_COLUMN_CLASS}>
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
              // `!` заставляет это правило победить независимо от порядка
              // объявления в Tailwind относительно класса ошибки или
              // умолчания выше — та же история с приоритетом, о которой
              // говорит комментарий к className коробки у Checkbox.
              "group-has-data-[disabled]:!text-[var(--radio-caption-fg-disabled)]"
            )}
          >
            {caption}
          </span>
        )}
      </span>
    </label>
  )
})

export { Radio }
export type { RadioProps }
