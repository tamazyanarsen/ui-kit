import * as React from "react"

import { formatWithMask, getMaskPlaceholder, type MaskName } from "./mask"

/**
 * Состояние поля под маской.
 *
 * Как только задана маска, значением поля владеет react-imask: он
 * возвращает отображаемую маскированную строку через onAccept, а мы
 * зеркалим её в состояние, чтобы кнопка очистки коробки и логика плавающей
 * подписи (:placeholder-shown) продолжали работать так же, как для обычного
 * поля.
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
  // ⚠️ Значение, пришедшее СНАРУЖИ, кладётся в состояние уже отформатированным
  // маской. С клавиатуры маску накладывает сам imask и отдаёт готовую строку в
  // `onAccept`, а на `value`/`defaultValue` он её не зовёт — поле показывало
  // «30 000 000», а состояние держало «30000000». На состоянии висит замер
  // ширины числа, поэтому поле получалось на два пробела уже показанного
  // текста и знак «₽» садился на последнюю цифру (дизайн-чек от 13.09, №1).
  const [maskValue, setMaskValue] = React.useState(() => {
    const raw = String(value ?? defaultValue ?? "")
    return mask ? formatWithMask(mask, raw) : raw
  })

  // Пересинхронизируется, когда *управляемое* значение меняется снаружи
  // (например, выбор даты проталкивает день, который пользователь только
  // что нажал в календаре). Для неуправляемого использования (только
  // defaultValue) пропускается, чтобы не бороться с набором текста на
  // каждую отрисовку.
  React.useEffect(() => {
    if (mask && value !== undefined) {
      setMaskValue(formatWithMask(mask, String(value)))
    }
  }, [mask, value])

  const measureRef = React.useRef<HTMLSpanElement>(null)
  const [amountWidth, setAmountWidth] = React.useState<number>()
  const showAmountSuffix = mask === "amount" && Boolean(maskValue)

  React.useLayoutEffect(() => {
    if (mask !== "amount") return
    setAmountWidth(measureRef.current?.offsetWidth)
  }, [mask, maskValue])

  // ⚠️ Повторный замер после загрузки гарнитуры. Первый проходит на
  // подменном системном шрифте, и число выходит уже реального: поле берёт
  // эту ширину, а когда приезжает Object Sans, текст в него не помещается и
  // обрезается («90 000 0(₽» вместо «90 000 000 ₽»). Ловится только на
  // первом показе поля с готовым значением — при вводе с клавиатуры шрифт
  // давно загружен, поэтому дефект и переживал прошлые проверки.
  React.useEffect(() => {
    if (mask !== "amount") return
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (!fonts?.ready) return
    let cancelled = false
    fonts.ready.then(() => {
      if (!cancelled) setAmountWidth(measureRef.current?.offsetWidth)
    })
    return () => {
      cancelled = true
    }
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
