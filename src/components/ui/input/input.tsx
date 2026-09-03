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
import { resolvePlaceholder, useMask } from "./use-mask"
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
  // Reason a locked field can't be edited, shown in a Tooltip on hover —
  // Figma requires the explanation on every Lock Input (canvas 666:12).
  lockedHint?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  containerClassName?: string
  // Leading icon slot (calendar for Date, magnifier for Search, or any
  // custom glyph) — purely presentational, doesn't affect masking.
  iconLeft?: React.ReactNode
  // Search-style "actively looking" spinner. Takes over the trailing slot.
  loading?: boolean
  // Custom trailing icon (e.g. Промокод's validity checkmark) that replaces
  // the clear button outright — unlike clear, it doesn't react to hover.
  trailingIcon?: React.ReactNode
  // Digit-mask preset — see ./mask.ts. Reformats on every keystroke and
  // reports the formatted string back through the normal onChange.
  mask?: MaskName
}

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  Omit<VariantProps<typeof inputBoxVariants>, "invalid" | "interactive"> &
  InputOwnProps

function Input({
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
  onChange,
  defaultValue,
  value,
  ...props
}: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${inputId}-caption` : undefined
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const isPassword = type === "password"

  const {
    maskValue,
    setMaskValue,
    handleAccept,
    amountWidth,
    measureRef,
    showAmountSuffix,
  } = useMask({ mask, value, defaultValue, onChange })

  // Floating label needs the peer's :placeholder-shown state, so at S size
  // (no floating label) the label prop just becomes the native placeholder.
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
  })

  function handleClear() {
    if (mask) {
      setMaskValue("")
      inputRef.current?.focus()
      onClear?.()
      return
    }
    const input = inputRef.current
    if (input) {
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
    readOnly: locked || disabled,
    placeholder: resolvedPlaceholder,
    "aria-invalid": invalid || undefined,
    "aria-describedby": captionId,
    "aria-readonly": locked || undefined,
    "aria-label": !floating && typeof label === "string" ? label : undefined,
  }

  // react-imask's IMaskInput prop type is a large discriminated union keyed
  // off `mask`. TS can't reconcile it once native <input> rest props
  // (`...props`) are merged in alongside it, even though the merged shape is
  // valid at runtime — hence the cast at the end.
  const maskProps = mask
    ? ({
        ...getImaskProps(mask),
        ...fieldProps,
        inputRef,
        value: maskValue,
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
    // Round-2 audit: was gap-1.5 (6px) — every ELK/input symbol with a
    // Comment/Error caption (215:6570, 215:6676, 215:6684, 215:6680, both
    // sizes/breakpoints) gives a literal gap-[4px] between the box and the
    // caption row, not 6px.
    <div className="flex w-full flex-col gap-1">
      <FieldTooltip content={hoverTooltip}>
        <div
          className={cn(
            inputBoxVariants({ size, invalid, interactive: !locked }),
            containerClassName
          )}
          onClick={() => {
            // Design-check #29: only the text itself was hit-testable —
            // clicking the box's own padding/gap area (or the leading icon)
            // silently did nothing. The field fills the box via flex-1, so
            // focusing it programmatically on any box click covers those
            // gaps.
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
              ref={inputRef}
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
                // Flush with the value text: the box pads 16px, and a
                // leading icon adds its own width plus the 8px gap (16 + 16
                // + 8 = 40 at S-sized glyphs, 16 + 24 + 8 = 48 once the L
                // row's 24px one kicks in). The old `desktop:left-5` put the
                // label 4px right of the value it labels.
                iconLeft ? "left-10 desktop:left-12" : "left-4",
                // Without a right edge, `truncate` has nothing to clip
                // against — an absolutely positioned label just grows to fit
                // its text, so a long label (e.g. DatePicker's "Дата начала
                // — Дата окончания") renders straight through the trailing
                // icon instead of eliding before it.
                hasTrailingSlot({
                  locked,
                  loading,
                  isPassword,
                  trailingIcon,
                  clearable,
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
            clearable={clearable}
            onClear={handleClear}
            disabled={disabled}
          />
        </div>
      </FieldTooltip>

      {(comment || error) && (
        <p
          id={captionId}
          className={cn(
            // Round-2 audit: was missing font-medium — get_design_context
            // on every Comment/Error caption instance (215:6570, 215:6676)
            // wraps the <p> in a font-['Object_Sans:Medium'] parent (P3
            // Medium, weight 500), not the browser default 400.
            // `px-4`: the spec's "Comment (ELK)" frame is indented 16px so
            // the caption lines up with the field's own text, not with the
            // box's outer edge.
            "px-4 text-p3-medium",
            error
              ? "text-[var(--input-caption-error-fg)]"
              : "text-[var(--input-caption-fg)]"
          )}
        >
          {error ?? comment}
        </p>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
