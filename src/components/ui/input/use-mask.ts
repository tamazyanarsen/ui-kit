import * as React from "react"

import { getMaskPlaceholder, type MaskName } from "./mask"

/**
 * Состояние поля под маской.
 *
 * react-imask owns the field's value once a mask is set — it reports the
 * masked display string back via onAccept, which we mirror into state so
 * the box's clear button and floating-label logic (:placeholder-shown) keep
 * working the same way they do for a plain input.
 *
 * Сюда же вынесен замер ширины числа для маски суммы: знак «₽» стоит рядом
 * с полем, и поле должно сжиматься по фактической ширине значения — почему
 * именно замером, а не атрибутом `size`, см. `AmountSuffix`.
 */
function useMask({
  mask,
  value,
  defaultValue,
  onChange,
}: {
  mask?: MaskName
  value?: React.ComponentProps<"input">["value"]
  defaultValue?: React.ComponentProps<"input">["defaultValue"]
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}) {
  const [maskValue, setMaskValue] = React.useState(() =>
    String(value ?? defaultValue ?? "")
  )

  // Re-syncs when a *controlled* value changes from outside (e.g. a date
  // picker pushing in the day the user just clicked in the calendar).
  // Skipped for uncontrolled usage (defaultValue only) so typing isn't
  // fought on every render.
  React.useEffect(() => {
    if (mask && value !== undefined) setMaskValue(String(value))
  }, [mask, value])

  const measureRef = React.useRef<HTMLSpanElement>(null)
  const [amountWidth, setAmountWidth] = React.useState<number>()
  const showAmountSuffix = mask === "amount" && Boolean(maskValue)

  React.useLayoutEffect(() => {
    if (mask === "amount") setAmountWidth(measureRef.current?.offsetWidth)
  }, [mask, maskValue])

  function handleAccept(next: string, _maskRef: unknown, event?: InputEvent) {
    setMaskValue(next)
    if (event) {
      onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return {
    maskValue,
    setMaskValue,
    handleAccept,
    /** Ширина числа в px, пока её ещё не померили — `undefined`. */
    amountWidth,
    measureRef,
    showAmountSuffix,
  }
}

/**
 * Плейсхолдер поля.
 *
 * Пробел, а не пустая строка, там где нужен `:placeholder-shown`: на нём
 * держатся и плавающая подпись, и крестик очистки — без плейсхолдера
 * браузер считает поле «показывающим плейсхолдер» всегда.
 */
function resolvePlaceholder({
  mask,
  floating,
  placeholder,
  label,
  clearable,
}: {
  mask?: MaskName
  floating: boolean
  placeholder?: string
  label?: React.ReactNode
  clearable: boolean
}): string | undefined {
  if (mask) return getMaskPlaceholder(mask)
  if (floating) return " "
  return (
    placeholder ??
    (typeof label === "string" ? label : undefined) ??
    (clearable ? " " : undefined)
  )
}

export { resolvePlaceholder, useMask }
