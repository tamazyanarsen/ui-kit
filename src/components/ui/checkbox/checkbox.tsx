import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check, Minus } from "@/icons"

import { cn } from "@/lib/utils"
import { resolveCaption } from "@/components/ui/input/caption"
import { CONTROL_TEXT_COLUMN_CLASS } from "@/lib/control-text-column"

import { useBridgedChecked, useNativeInputBridge } from "./native-input-bridge"

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
const hasValue = (node: React.ReactNode) =>
  node != null && node !== false && node !== ""

interface CheckboxOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
}

type CheckboxProps = Omit<CheckboxPrimitive.Root.Props, "onChange" | "ref"> &
  CheckboxOwnProps & {
    /** Нативный `change` скрытого input — для `register()` и прочих форм. */
    onChange?: React.ChangeEventHandler<HTMLInputElement>
  }

// Отдельно стоящий интерактивный Checkbox. Checkbox.Root из Base UI рисует
// <span role="checkbox">, а не нативный input, поэтому варианты состояний
// ниже везде записаны в скобочной форме `data-[x]:`, а не через `disabled:`
// или голый `data-x:` — из-за особенности Tailwind v4, который по-разному
// трактует «наличие атрибута» и «его значение» (см. ComboboxCheckbox,
// предшествующий этому компоненту брат только для чтения: он спотыкался о
// то же самое).
//
// `label`, `comment` и `error` необязательны — так же устроено поле у
// Input; опустите их, чтобы получить голую коробку 24×24 («Checkbox Without
// Text» в макете). `error` заменяет собой `comment`, а не складывается с
// ним, — тоже как у Input.
// `ref` ведёт на скрытый нативный input, а не на span: так его ждёт
// react-hook-form (`checked`, фокус на ошибке) — см. `useNativeInputBridge`.
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  className,
  disabled,
  indeterminate,
  label,
  comment,
  error,
  id,
  name,
  inputRef,
  onChange,
  onBlur,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}, ref) {
  const state = useBridgedChecked({ checked, defaultChecked, onCheckedChange })
  const bridge = useNativeInputBridge({
    ref,
    inputRef,
    name,
    onChange,
    onBlur,
    onExternalChecked: state.onExternalChecked,
    resetChecked: state.resetChecked,
  })
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId
  const { caption } = resolveCaption(error, comment)
  const hasCaption = Boolean(caption)
  const captionId = hasCaption ? `${checkboxId}-caption` : undefined

  const box = (
    <CheckboxPrimitive.Root
      id={checkboxId}
      name={name}
      inputRef={bridge.inputRef}
      onBlur={bridge.onBlur}
      checked={state.checked}
      onCheckedChange={(next, details) => {
        bridge.beginChange(details.event)
        state.onCheckedChange(next, details)
      }}
      data-slot="checkbox"
      disabled={disabled}
      indeterminate={indeterminate}
      // Ошибку видно не только глазами: без `aria-invalid` скринридер
      // объявляет поле обычным, сколько бы красного вокруг ни нарисовали.
      aria-invalid={error ? true : undefined}
      aria-describedby={captionId}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md border text-transparent outline-none transition-colors",
        "border-[var(--checkbox-border)] bg-[var(--checkbox-bg)]",
        // Ограничено только неотмеченным и не-частичным состоянием: иначе
        // это правило и правило «отмечен → border-transparent» ниже целятся
        // в border-color с одинаковой специфичностью, побеждает то, которое
        // Tailwind случайно выведет в таблицу стилей позже, и тёмная рамка
        // наведения снова вылезает на отмеченной коробке вместо
        // прозрачной.
        "not-data-[disabled]:not-data-[checked]:not-data-[indeterminate]:hover:border-[var(--checkbox-border-hover)]",
        "data-[checked]:border-transparent data-[checked]:bg-[var(--checkbox-checked-bg)] data-[checked]:text-[var(--checkbox-checked-fg)] not-data-[disabled]:data-[checked]:hover:bg-[var(--checkbox-checked-bg-hover)]",
        "data-[indeterminate]:border-transparent data-[indeterminate]:bg-[var(--checkbox-checked-bg)] data-[indeterminate]:text-[var(--checkbox-checked-fg)] not-data-[disabled]:data-[indeterminate]:hover:bg-[var(--checkbox-checked-bg-hover)]",
        "focus-visible:focus-ring",
        "data-[disabled]:cursor-not-allowed data-[disabled]:!border-[var(--checkbox-disabled-border)] data-[disabled]:!bg-[var(--checkbox-disabled-bg)] data-[disabled]:data-[checked]:!text-[var(--checkbox-disabled-fg)] data-[disabled]:data-[indeterminate]:!text-[var(--checkbox-disabled-fg)]",
        error && "!border-[var(--checkbox-border-error)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
        keepMounted={false}
      >
        {indeterminate ? (
          <Minus aria-hidden="true" className="size-4" strokeWidth={3} />
        ) : (
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!hasValue(label) && !hasCaption) {
    return box
  }

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        // `flex`, а не `inline-flex`: обёртка строчного уровня делает
        // подпись неделимым строчным блоком, и тогда высота строчного бокса
        // родителя (расчёт по базовой линии и интерлиньяжу) может скакнуть
        // на пару пикселей всякий раз, когда меняется строчное содержимое
        // флажка — например, при переключении монтируется или
        // размонтируется значок галочки, — и вся строка заметно дёргается.
        // Блочный `flex` в строчный контекст форматирования не входит и к
        // этому невосприимчив. Такая же правка нужна в Radio.
        "flex items-start gap-4",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {box}
      {/* Зазора здесь нет: инстанс «Checkbox With Comment» в макете ровно
          такой высоты, как интерлиньяж подписи (24 на десктопе, 20 на
          мобильном) плюс интерлиньяж пояснения (16), без просвета между
          ними — строки стоят вплотную. `pt-0.5` (2px) применяется только
          ниже `md`: на мобильном интерлиньяж строки Option Text (20px)
          короче коробки 24px, и нужен сдвиг на 2px, чтобы отцентровать
          относительно неё, тогда как на десктопе интерлиньяж 24px совпадает
          с коробкой точно (на десктопном символе верхнего смещения нет, на
          мобильном стоит pt-[2px]). */}
      {/* ⚠️ Порядок переворачивается на мобайле, а не на десктопе.
          Дизайн-чек от 07.09, замечания 9 и 25: «Checkbox/Radio/Toggle в
          варианте mobile должны ставить элемент СПРАВА от текста (не
          слева)… для десктопа остаётся слева». Почему именно `order`, а не
          перестановка в разметке, и остальные правила колонки — в
          `lib/control-text-column.ts`. */}
      <span className={CONTROL_TEXT_COLUMN_CLASS}>
        {hasValue(label) && (
          <span
            className={cn(
              "text-p2-medium text-[var(--checkbox-label-fg)] desktop:text-p1-medium",
              disabled && "text-[var(--checkbox-label-fg-disabled)]"
            )}
          >
            {label}
          </span>
        )}
        {hasCaption && (
          <span
            id={captionId}
            className={cn(
              "text-p3-medium",
              disabled
                ? "text-[var(--checkbox-caption-fg-disabled)]"
                : error
                  ? "text-[var(--checkbox-caption-error-fg)]"
                  : "text-[var(--checkbox-caption-fg)]"
            )}
          >
            {caption}
          </span>
        )}
      </span>
    </label>
  )
})

export { Checkbox }
export type { CheckboxProps }
