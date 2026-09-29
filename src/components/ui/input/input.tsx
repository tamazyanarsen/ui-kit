import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { IMaskInput } from "react-imask"

import { cn } from "@/lib/utils"
import { useCopyWithoutSeparators } from "@/lib/use-copy-without-separators"

import { AmountSuffix } from "./amount-suffix"
import { FieldTooltip, useHoverTooltip } from "./hover-tooltip"
import {
  MASK_GROUP_SEPARATORS,
  getImaskProps,
  type MaskName,
} from "./mask"
import { InputTrailingSlot, hasTrailingSlot } from "./trailing-slot"
import { resolveCaption } from "./caption"
import { useComposedRefs } from "@/lib/compose-refs"
import { resolvePlaceholder, useMask } from "./use-mask"
import { useStableInputRef } from "./use-stable-input-ref"
import {
  LEADING_ICON_SIZE,
  floatingLabelVariants,
  inputBoxVariants,
  inputFieldVariants,
  type InputSize,
} from "./variants"

interface InputOwnProps {
  size?: InputSize
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  locked?: boolean
  // Причина, по которой поле нельзя редактировать; показывается в
  // подсказке по наведению — макет требует пояснения у каждого Lock Input.
  lockedHint?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  containerClassName?: string
  // Слот ведущего значка (календарь у Date, лупа у Search или любой
  // другой глиф) — чисто оформительский, на маску не влияет.
  iconLeft?: React.ReactNode
  // Крутилка «идёт поиск» в стиле Search. Забирает себе замыкающий слот.
  loading?: boolean
  // Свой замыкающий значок (например, галочка проверки промокода),
  // который полностью заменяет кнопку очистки и, в отличие от неё, на
  // наведение не реагирует.
  trailingIcon?: React.ReactNode
  // Заготовка цифровой маски — см. ./mask.ts. Переформатирует значение на
  // каждое нажатие и отдаёт отформатированную строку обычным onChange.
  mask?: MaskName
}

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  Omit<VariantProps<typeof inputBoxVariants>, "invalid" | "interactive"> &
  InputOwnProps

/** Типы, на которых работает выделение, а значит, и маска. */
const MASKABLE_TYPES = new Set(["text", "tel", "search", "url", "password"])

// `forwardRef` — чтобы ref потребителя доезжал до нативного `<input>`:
// `<Input {...register("x")} />` из react-hook-form держится именно на нём
// (фокус на ошибке, чтение значения). На React 18 обычная функция его молча
// теряет, хотя тип `ComponentProps<"input">` его и объявляет.
const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({
  className,
  containerClassName,
  size = "lg",
  label,
  comment,
  error,
  locked = false,
  lockedHint,
  clearable = true,
  disabled,
  id,
  placeholder,
  onClear,
  iconLeft,
  loading = false,
  trailingIcon,
  mask,
  type,
  readOnly,
  onChange,
  defaultValue,
  value,
  ...props
}, ref) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const captionId = caption ? `${inputId}-caption` : undefined
  const inputRef = React.useRef<HTMLInputElement>(null)
  const setInputRef = useComposedRefs(inputRef, ref)
  // Маске — постоянный ref: react-imask вызывает `inputRef` только при
  // создании (см. use-stable-input-ref.ts).
  const setMaskInputRef = useStableInputRef(inputRef, ref)
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const isPassword = type === "password"

  const {
    maskValue,
    valueProps,
    imaskRef,
    clearMask,
    handleAccept,
    amountWidth,
    measureRef,
    showAmountSuffix,
  } = useMask({ mask, value, defaultValue, onChange, inputRef })

  // Плавающей подписи нужно состояние :placeholder-shown соседа, поэтому
  // на размере S, где плавающей подписи нет, пропс label просто становится
  // нативным placeholder.
  const floating = Boolean(label) && size !== "sm"
  const resolvedPlaceholder = resolvePlaceholder({
    mask,
    floating,
    placeholder,
    label,
    clearable,
  })

  const hoverTooltip = useHoverTooltip({
    inputRef,
    locked,
    lockedHint,
    valueKey: `${value ?? ""}|${defaultValue ?? ""}|${maskValue}`,
    secret: isPassword,
    masked: Boolean(mask),
  })

  // Обычное поле чистится настоящим событием `input`: React видит его как
  // ввод, и `onChange` родителя вызывается. Маскированное — через API маски
  // (см. `clearMask`): событие imask считает от сохранённой каретки.
  // Поле только для чтения — от потребителя (`readOnly`) или заблокированное —
  // очистке не подлежит: крестик у него не рисуется (см. ниже), а сама
  // очистка на всякий случай тоже ничего не делает.
  const readOnlyField = Boolean(readOnly || locked || disabled)
  // Крестик — только у поля, которое можно править. Выключенное прячет его
  // само (`disabled:hidden`), заблокированное рисует замок; поле только для
  // чтения от потребителя раньше показывало живой крестик, и клик очищал
  // значение, которое править нельзя.
  const showClear = clearable && !readOnly

  function handleClear() {
    if (readOnlyField) return
    const input = inputRef.current
    if (input && mask && clearMask(input)) {
      input.focus()
    } else if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set
      setter?.call(input, "")
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.focus()
    }
    onClear?.()
  }

  // Разрядный пробел — отбивка по 3 разряда, а не символ значения, и в
  // буфер он попадать не должен: «120 000 000,00 ₽» копируется как
  // «120000000,00 ₽», знак валюты при этом ОСТАЁТСЯ — он часть значения.
  //
  // Обработчики ставятся только там, где маска объявила разделители: у
  // свободного поля их нет вовсе (см. MASK_GROUP_SEPARATORS).
  const copyWithoutSeparators = useCopyWithoutSeparators(
    mask ? MASK_GROUP_SEPARATORS[mask] : undefined
  )

  // Общие для обеих реализаций поля (нативной и маскированной) атрибуты.
  // ⚠️ Заблокированное поле ПРИНИМАЕТ TAB.
  //
  // Нативный `disabled` убирает элемент из обхода клавиатурой полностью, и
  // человек, идущий по форме табом, не узнаёт о существовании поля вовсе —
  // ни его подписи, ни причины блокировки. Поэтому блокировка выражается
  // парой `readOnly` + `aria-disabled`: редактировать нельзя, а дойти и
  // прочитать — можно. Кольцо фокуса при этом обязательно (см. variants.ts):
  // рамка у заблокированного поля своя и на фокус не реагирует.
  //
  // Следствие, о котором надо знать: значение такого поля УХОДИТ в нативную
  // отправку формы (у `disabled` этого не происходило). Кит всюду
  // управляемый, полезную нагрузку собирает приложение, — но если поле
  // стоит в настоящей `<form>` с `name`, нужное поведение задаёт она.
  const fieldProps = {
    ...copyWithoutSeparators,
    id: inputId,
    "data-slot": "input",
    "aria-disabled": disabled || undefined,
    readOnly: readOnlyField,
    placeholder: resolvedPlaceholder,
    "aria-invalid": invalid || undefined,
    "aria-describedby": captionId,
    "aria-readonly": locked || undefined,
    "aria-label": !floating && typeof label === "string" ? label : undefined,
  }

  // Тип пропсов IMaskInput из react-imask — это большое размеченное
  // объединение с ключом по `mask`. TypeScript не может свести его с
  // нативными пропсами <input>, подмешанными через `...props`, хотя
  // получающаяся форма во время выполнения корректна: отсюда приведение
  // типа в конце.
  const maskProps = mask
    ? ({
        ...getImaskProps(mask),
        ...fieldProps,
        // Тип поля доезжает и до маскированного `<input>`: без него
        // `type="tel"` терялся, и на мобильном открывалась полная клавиатура
        // вместо цифровой. Только типы, где работает выделение
        // (`setSelectionRange`), — на остальных imask не может ставить каретку.
        // Пароль переключается «глазом» так же, как в поле без маски: иначе
        // маскированный пароль оставался скрытым при нажатой кнопке.
        type: isPassword
          ? passwordVisible
            ? "text"
            : "password"
          : type && MASKABLE_TYPES.has(type)
            ? type
            : undefined,
        ref: imaskRef,
        inputRef: setMaskInputRef,
        ...valueProps,
        onAccept: handleAccept,
        style:
          showAmountSuffix && amountWidth !== undefined
            ? { width: amountWidth }
            : undefined,
        className: cn(
          inputFieldVariants({ size, floating }),
          showAmountSuffix && "flex-none",
          className
        ),
        ...props,
      } as unknown as React.ComponentProps<typeof IMaskInput>)
    : null

  return (
    // Второй проход: стояло gap-1.5 (6px), а каждый символ ELK/input с
    // подписью Comment или Error (оба размера и оба брейкпоинта) даёт
    // литеральный gap-[4px] между коробкой и строкой подписи, а не 6px.
    <div className="flex w-full flex-col gap-1">
      <FieldTooltip content={hoverTooltip}>
        <div
          className={cn(
            inputBoxVariants({ size, invalid, interactive: !locked }),
            containerClassName
          )}
          onClick={() => {
            // Дизайн-чек, замечание 29: нажималcя только сам текст — клик
            // по отступам и зазорам внутри коробки (или по ведущему значку)
            // молча ничего не делал. Поле занимает коробку через flex-1,
            // поэтому программная установка фокуса на любой клик по коробке
            // закрывает эти зазоры.
            if (!disabled && !locked) inputRef.current?.focus()
          }}
        >
          {iconLeft && (
            <span
              aria-hidden="true"
              className={cn(
                LEADING_ICON_SIZE[size],
                "shrink-0 [&>svg]:size-full text-[var(--input-icon-fg)]"
              )}
            >
              {iconLeft}
            </span>
          )}

          {maskProps ? (
            <>
              <IMaskInput {...maskProps} />
              {showAmountSuffix && (
                <AmountSuffix
                  value={maskValue}
                  size={size}
                  floating={floating}
                  measureRef={measureRef}
                />
              )}
            </>
          ) : (
            <input
              ref={setInputRef}
              {...fieldProps}
              type={isPassword ? (passwordVisible ? "text" : "password") : type}
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
              className={cn(inputFieldVariants({ size, floating }), className)}
              {...props}
            />
          )}

          {floating && (
            <label
              htmlFor={inputId}
              className={cn(
                floatingLabelVariants,
                // Вровень с текстом значения: коробка даёт отступ 16px, а
                // ведущий значок добавляет свою ширину плюс зазор 8px
                // (16 + 16 + 8 = 40 при значках размера S и
                // 16 + 24 + 8 = 48, когда включается 24-пиксельный значок
                // ряда L). Прежний `desktop:left-5` ставил подпись на 4px
                // правее значения, которое она подписывает.
                iconLeft ? "left-10 desktop:left-12" : "left-4",
                // Без правой границы `truncate` не об что обрезать:
                // абсолютно спозиционированная подпись просто растёт под
                // свой текст, и длинная подпись (например, «Дата начала —
                // Дата окончания» у DatePicker) уезжает прямо сквозь
                // замыкающий значок вместо того, чтобы оборваться до него.
                hasTrailingSlot({
                  locked,
                  loading,
                  isPassword,
                  trailingIcon,
                  clearable: showClear,
                })
                  ? "right-10"
                  : "right-4"
              )}
            >
              {label}
            </label>
          )}

          <InputTrailingSlot
            size={size}
            locked={locked}
            loading={loading}
            isPassword={isPassword}
            passwordVisible={passwordVisible}
            onPasswordVisibleChange={setPasswordVisible}
            trailingIcon={trailingIcon}
            clearable={showClear}
            onClear={handleClear}
            disabled={disabled}
          />
        </div>
      </FieldTooltip>

      {caption && (
        <p
          id={captionId}
          className={cn(
            // Второй проход: не хватало font-medium — у каждого инстанса
            // подписи Comment или Error <p> обёрнут в родителя с
            // font-['Object_Sans:Medium'] (P3 Medium, насыщенность 500), а
            // не в браузерные 400 по умолчанию.
            // `px-4`: кадр «Comment (ELK)» в макете сдвинут на 16px, чтобы
            // подпись встала по тексту самого поля, а не по внешнему краю
            // коробки.
            // `break-words`: неразрывное слово (номер договора, имя файла)
            // переносится внутри подписи, а не выходит за поле (аудит 18).
            "px-4 text-p3-medium break-words",
            error
              ? "text-[var(--input-caption-error-fg)]"
              : "text-[var(--input-caption-fg)]"
          )}
        >
          {caption}
        </p>
      )}
    </div>
  )
})

export { Input }
export type { InputProps }
