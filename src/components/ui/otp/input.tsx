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
  ...props
}: OtpInputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = error ? `${inputId}-caption` : undefined

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
      className={cn("mx-auto w-full md:w-[368px]", containerClassName)}
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
        className={cn(
          "w-full border-0 border-b border-[var(--otp-underline)] bg-transparent pb-3 text-center text-4xl font-semibold tracking-[0.5em] indent-[0.5em] text-[var(--otp-fg)] outline-none",
          "placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:indent-0 placeholder:text-[var(--otp-placeholder-fg)]",
          invalid && "text-[var(--otp-error-fg)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {error && (
        <p
          id={captionId}
          className="mt-1.5 text-center text-xs text-[var(--otp-error-fg)]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export { OtpInput }
