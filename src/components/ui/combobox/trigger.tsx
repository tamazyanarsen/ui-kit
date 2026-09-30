import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { ChevronDown, X } from "@/icons"

import { cn } from "@/lib/utils"
import { resolveCaption } from "@/components/ui/input/caption"
import {
  SELECT_ICON_SIZE,
  selectFloatingLabelClassName,
  selectStaticLabelClassName,
  selectTriggerVariants,
} from "../select"
import { clipText } from "../select/clip-text"

// Коробка, подпись и кнопка очистки оформлены точно как у SelectTrigger
// (тот же макет: L 48→56px, S 32px, плавающая подпись только у L).
// Поскольку значением этого всплывающего окна обычно служит собственная
// сводка («Выбрано документов: 5»), дети пробрасываются напрямую, а не
// требуют привязки к `Combobox.Value`.

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
const hasValue = (node: React.ReactNode) =>
  node != null && node !== false && node !== ""

interface ComboboxTriggerOwnProps {
  size?: "sm" | "lg"
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  clearable?: boolean
  /**
   * Сброс выбора по «Очистить». Кнопка показывается только вместе с ним:
   * значение этого поля — сводка потребителя (черновик и применённый выбор
   * живут у него), и сбросить его сама кнопка не может. Без обработчика
   * крестик был пустышкой — виден, но ничего не делал.
   */
  onClear?: () => void
  placeholder?: boolean
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
export const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<ComboboxPrimitive.Trigger.Props, "render"> & ComboboxTriggerOwnProps
>(function ComboboxTrigger({
  className,
  size = "lg",
  label,
  comment,
  error,
  clearable = true,
  onClear,
  placeholder = false,
  children,
  id,
  disabled,
  ...props
}, ref) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const captionId = hasValue(caption) ? `${triggerId}-caption` : undefined
  const labelId = hasValue(label) ? `${triggerId}-label` : undefined
  // Имя поля — подпись: роль combobox своё имя из содержимого не берёт,
  // и без связи скринридер объявлял «поле со списком» без названия.
  // `aria-labelledby` потребителя (в `props`) главнее; `aria-label` — тоже,
  // кроме поля внутри Field.Root с Field.Label: там Base UI сам ставит
  // `aria-labelledby` на подпись Field, а она по правилам имени сильнее.
  const floating = size === "lg"
  // Место резервируется только тогда, когда есть чему всплывать: без
  // подписи над значением ничего не появится.
  const hasFloatingLabel = floating && hasValue(label)

  return (
    <div className="flex w-full flex-col gap-1">
      <ComboboxPrimitive.Trigger
        id={triggerId}
        ref={ref}
        data-slot="combobox-trigger"
        // Ключ передаётся, только когда своя подпись есть: `aria-labelledby=
        // {undefined}` в mergeProps Base UI затёр бы связь с внешним
        // Field.Label, и поле снова осталось бы без имени.
        {...(labelId && !props["aria-label"] ? { "aria-labelledby": labelId } : {})}
        data-placeholder={placeholder ? "" : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={captionId}
        nativeButton={false}
        render={<div className={cn(selectTriggerVariants({ size, invalid }), className)} />}
        disabled={disabled}
        {...props}
      >
        {hasValue(label) && (
          <span
            id={labelId}
            className={
              floating
                ? selectFloatingLabelClassName
                : selectStaticLabelClassName
            }
          >
            {label}
          </span>
        )}
        <span
          className={cn(
            "flex flex-1 items-center gap-2 truncate text-[var(--select-fg)]",
            "group-data-disabled/trigger:text-[var(--select-fg-disabled)]",
            placeholder &&
              label &&
              "group-data-placeholder/trigger:text-transparent",
            // Почему это живёт здесь, а не на коробке триггера, см. у
            // SelectTrigger в select.tsx: отступ там переcчитал бы по
            // центру и значки с кнопкой очистки и увёл бы их вниз при
            // фокусе.
            hasFloatingLabel &&
              "group-data-popup-open/trigger:pt-[18px] group-[&:not([data-placeholder])]/trigger:pt-[18px] desktop:group-data-popup-open/trigger:pt-4 desktop:group-[&:not([data-placeholder])]/trigger:pt-4"
          )}
        >
          {/* Сводка («Выбрано: …») обычно приходит голым текстом, а во
              флексе он многоточия не получает — оборачиваем в свой узел. */}
          {clipText(children)}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {clearable && onClear && (
            <button
              type="button"
              aria-label="Очистить"
              // Как у SelectTrigger: у заблокированного поля кнопки нет. Мышь
              // её и так не доставала (`pointer-events-none` у коробки), а
              // Tab + Enter вызывали `onClear`.
              disabled={disabled}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                onClear?.()
              }}
              className={cn(
                "text-[var(--select-icon-fg)] outline-none focus-visible:focus-ring group-data-disabled/trigger:!hidden",
                placeholder && "hidden"
              )}
            >
              <X aria-hidden="true" className={SELECT_ICON_SIZE[size]} />
            </button>
          )}
          <ComboboxPrimitive.Icon className="text-[var(--select-icon-fg)] transition-transform group-data-disabled/trigger:text-[var(--select-icon-fg-disabled)] group-data-popup-open/trigger:rotate-180">
            <ChevronDown className={SELECT_ICON_SIZE[size]} />
          </ComboboxPrimitive.Icon>
        </span>
      </ComboboxPrimitive.Trigger>
      {hasValue(caption) && (
        <p
          id={captionId}
          className={cn(
            "text-p3-medium",
            // Горизонтальный отступ совпадает с собственным px-4 у
            // триггера на обоих размерах (см. select/variants.ts).
            // `break-words`: неразрывное слово (номер договора, имя файла)
            // переносится внутри подписи, а не выходит за поле (аудит 18).
            "px-4 break-words",
            error
              ? "text-[var(--select-caption-error-fg)]"
              : "text-[var(--select-caption-fg)]"
          )}
        >
          {caption}
        </p>
      )}
    </div>
  )
})
