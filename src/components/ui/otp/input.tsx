import * as React from "react"

import { cn } from "@/lib/utils"

// OtpInput — a single native <input>, not Base UI's OTPField (6 separate
// slot inputs). The spec shows one continuous underline with a centered
// caret in the empty/focused state and a full-width placeholder
// ("Введите код из СМС") — both are plain single-input behavior; a 6-slot
// model would put the caret in slot 1 and has no concept of a placeholder
// spanning all slots. Paste/backspace/arrow-key editing all come for free
// from the native input this way.
interface OtpInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "size" | "onChange"> {
  length?: number
  error?: React.ReactNode
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onComplete?: (value: string) => void
  containerClassName?: string
}

/** Значение из пропа приводим к тем же правилам, что и ввод с клавиатуры:
 *  только цифры и не длиннее `length`. С клавиатуры лишнее не ввести
 *  (maxLength + handleChange), а переданное программно значение рисовалось
 *  целиком — в матрице колонка «4 знака» показывала шестизначный код. */
function clampCode(
  raw: React.ComponentProps<"input">["value"],
  length: number
) {
  return raw === undefined
    ? undefined
    : String(raw).replace(/\D/g, "").slice(0, length)
}

function OtpInput({
  length = 6,
  error,
  className,
  containerClassName,
  onChange,
  onComplete,
  disabled,
  id,
  placeholder = "Введите код из СМС",
  value,
  defaultValue,
  ...props
}: OtpInputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = error ? `${inputId}-caption` : undefined
  // Отдаём инпуту ровно один из value/defaultValue — иначе React ругается на
  // одновременно контролируемое и неконтролируемое поле.
  const codeProps =
    value !== undefined
      ? { value: clampCode(value, length) }
      : { defaultValue: clampCode(defaultValue, length) }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, length)
    if (digits !== event.target.value) {
      event.target.value = digits
    }
    onChange?.(event)
    if (digits.length === length) onComplete?.(digits)
  }

  return (
    <div
      className={cn("mx-auto w-full desktop:w-[368px]", containerClassName)}
    >
      <input
        id={inputId}
        data-slot="otp-input"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={captionId}
        onChange={handleChange}
        {...codeProps}
        className={cn(
          "w-full border-0 border-b border-[var(--otp-underline)] bg-transparent pb-3 text-center text-[28px] leading-[38px] font-medium tracking-[0.29em] indent-[0.29em] text-[var(--otp-fg)] outline-none focus-visible:focus-ring desktop:text-h1 desktop:tracking-[0.35em] desktop:indent-[0.35em]",
          "placeholder:text-p2-medium placeholder: placeholder:tracking-normal placeholder:indent-0 placeholder:text-[var(--otp-placeholder-fg)] desktop:placeholder:text-p1-medium",
          invalid && "text-[var(--otp-error-fg)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {error && (
        <p
          id={captionId}
          className="mt-4 text-center text-p3-regular text-[var(--otp-error-fg)] desktop:mt-2"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { OtpInput }
