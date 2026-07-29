import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OtpInput } from "./input"
import { ResendCode } from "./resend-code"

// OtpConfirmCard — the "Подтвердите контактные данные" card from the
// anatomy diagram (title/subtitle/close + OtpInput + ResendCode + Confirm
// button). Renders content only, like Calendar's sheet layout — wrapping
// it in a modal/dialog (backdrop, Esc, drag-safe outside click) is a
// page-level concern the spec's "Использование в макете" section
// documents as integration guidance, not part of this component.
interface OtpConfirmCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  phone?: string
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  error?: React.ReactNode
  resendSeconds?: number
  onResend?: () => void
  onSubmit?: (code: string) => void
  onClose?: () => void
  className?: string
}

function OtpConfirmCard({
  title = "Подтвердите контактные данные",
  subtitle,
  phone,
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  error,
  resendSeconds = 60,
  onResend,
  onSubmit,
  onClose,
  className,
}: OtpConfirmCardProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const code = value ?? uncontrolled
  const complete = code.length === length

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <form
      className={cn(
        "relative flex w-full flex-col gap-8 rounded-[32px] bg-white p-12 sm:max-w-[592px]",
        className
      )}
      onSubmit={(event) => {
        event.preventDefault()
        if (complete) onSubmit?.(code)
      }}
    >
      {onClose && (
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute top-8 right-8 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--otp-close-bg)] text-[var(--otp-close-fg)] outline-none"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}

      <div className="flex flex-col gap-2 pr-10">
        <h2 className="text-2xl font-semibold text-[var(--otp-title-fg)]">
          {title}
        </h2>
        <p className="text-sm text-[var(--otp-subtitle-fg)]">
          {subtitle ?? (phone ? `Код подтверждения отправлен на номер ${phone}` : null)}
        </p>
      </div>

      <OtpInput
        length={length}
        value={code}
        onChange={handleChange}
        error={error}
      />

      <ResendCode seconds={resendSeconds} onResend={onResend} />

      <Button type="submit" variant="primary" size="lg" disabled={!complete}>
        Подтвердить
      </Button>
    </form>
  )
}

export { OtpConfirmCard }
