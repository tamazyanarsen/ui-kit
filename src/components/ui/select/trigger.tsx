import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, Lock, X } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { resolveCaption } from "@/components/ui/input/caption"
import {
  SELECT_ICON_SIZE,
  selectFloatingLabelClassName,
  selectStaticLabelClassName,
  selectTriggerVariants,
} from "./variants"
import { useSelectClear } from "./root"

interface SelectTriggerOwnProps {
  size?: "sm" | "lg"
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  clearable?: boolean
  /**
   * Дополнительное уведомление о нажатии «Очистить». Сбрасывает значение
   * сама кнопка (через `Select`: неуправляемый очищается сам, управляемый
   * получает `onValueChange(null)`), поэтому передавать его не обязательно.
   */
  onClear?: () => void
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<SelectPrimitive.Trigger.Props, "render"> & SelectTriggerOwnProps
>(function SelectTrigger({
  className,
  size = "lg",
  label,
  comment,
  error,
  clearable = true,
  onClear,
  children,
  id,
  ...props
}, ref) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const clearValue = useSelectClear()
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const captionId = hasNode(caption) ? `${triggerId}-caption` : undefined
  const labelId = hasNode(label) ? `${triggerId}-label` : undefined
  // Имя поля — подпись: роль combobox своё имя из содержимого не берёт,
  // и без связи скринридер объявлял «поле со списком» без названия.
  // `aria-labelledby` потребителя (в `props`) главнее; `aria-label` — тоже,
  // кроме поля внутри Field.Root с Field.Label: там Base UI сам ставит
  // `aria-labelledby` на подпись Field, а она по правилам имени сильнее.
  const floating = size === "lg"
  // Место резервируется только тогда, когда есть чему всплывать: без
  // подписи над значением ничего не появится, и прибавка отступа просто
  // утопила бы текст в его коробке без всякой причины.
  const hasFloatingLabel = floating && hasNode(label)

  return (
    <div className="flex w-full flex-col gap-1">
      <SelectPrimitive.Trigger
        id={triggerId}
        ref={ref}
        data-slot="select-trigger"
        // Ключ передаётся, только когда своя подпись есть: `aria-labelledby=
        // {undefined}` в mergeProps Base UI затёр бы связь с внешним
        // Field.Label, и поле снова осталось бы без имени.
        {...(labelId && !props["aria-label"] ? { "aria-labelledby": labelId } : {})}
        aria-invalid={invalid || undefined}
        aria-describedby={captionId}
        nativeButton={false}
        render={<div className={cn(selectTriggerVariants({ size, invalid }), className)} />}
        {...props}
      >
        {hasNode(label) && (
          <span
            id={labelId}
            className={
              floating
                ? cn(
                    selectFloatingLabelClassName,
                    // Без крестика место под него не держим: иначе длинная
                    // подпись обрезалась на 24px раньше, чем могла. Крестика
                    // нет и у выключенного поля, и у поля только для чтения —
                    // селекторы составные, чтобы перебить `right-16`.
                    !clearable && "group-[&:not([data-placeholder])]/trigger:right-10",
                    "group-[&:not([data-placeholder])[data-disabled]]/trigger:right-10",
                    "group-[&:not([data-placeholder])[data-readonly]]/trigger:right-10"
                  )
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
            "*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 *:data-[slot=select-value]:truncate",
            // Плавающая подпись уже занимает «пустую» позицию — не дадим
            // собственному тексту-заглушке SelectValue показаться под ней.
            hasNode(label) &&
              "group-data-placeholder/trigger:*:data-[slot=select-value]:text-transparent",
            // Отступ живёт здесь, на строке значения, а не на самой
            // коробке триггера: коробка использует `items-center` по всей
            // строке, поэтому отступ на ней переcчитал бы по центру и
            // значки с кнопкой очистки — и они заметно уехали бы вниз при
            // фокусе. Ограничение отступа этой строкой опускает только
            // текст значения, освобождая место для всплывшей подписи над
            // ним.
            hasFloatingLabel &&
              "group-data-popup-open/trigger:pt-4 group-[&:not([data-placeholder])]/trigger:pt-4 desktop:group-data-popup-open/trigger:pt-5 desktop:group-[&:not([data-placeholder])]/trigger:pt-5"
          )}
        >
          {children}
        </span>
        <Lock
          aria-hidden="true"
          className={cn(
            SELECT_ICON_SIZE[size],
            "hidden shrink-0 text-[var(--select-icon-fg)] group-data-readonly/trigger:block"
          )}
        />
        <span className="flex shrink-0 items-center gap-2 group-data-readonly/trigger:hidden">
          {clearable && (
            <button
              type="button"
              aria-label="Очистить"
              onMouseDown={(event) => {
                // Триггер открывает всплывающее окно по mousedown, а он
                // срабатывает раньше onClick: останавливаем событие и
                // здесь, иначе клик по кнопке очистки заодно открывает
                // список.
                event.stopPropagation()
              }}
              onClick={(event) => {
                event.stopPropagation()
                // Раньше крестик только звал `onClear`, и без него значение
                // оставалось на месте (сортировка TableTop).
                clearValue?.(event.nativeEvent)
                onClear?.()
              }}
              className="hidden text-[var(--select-icon-fg)] outline-none focus-visible:focus-ring group-[&:not([data-placeholder])]/trigger:flex group-data-disabled/trigger:!hidden"
            >
              <X aria-hidden="true" className={SELECT_ICON_SIZE[size]} />
            </button>
          )}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              SELECT_ICON_SIZE[size],
              "shrink-0 text-[var(--select-icon-fg)] transition-transform group-data-popup-open/trigger:rotate-180"
            )}
          />
        </span>
      </SelectPrimitive.Trigger>
      {hasNode(caption) && (
        <p
          id={captionId}
          className={cn(
            "text-p3-medium",
            // Выравнивается по тексту подписи и значения внутри триггера,
            // а не по внешнему краю коробки: совпадает с собственными
            // горизонтальными отступами триггера, а это px-4 на обоих
            // размерах (см. variants.ts).
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
