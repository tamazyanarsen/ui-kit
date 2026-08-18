import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"
import { OtpInput } from "./input"
import { ResendCode } from "./resend-code"

// OtpConfirmCard — the "Подтвердите контактные данные" dialog.
//
// Figma composes `ELK / otp-code` as a literal `ELK / Modal` instance
// (Modal Top/Body Small + an `ELK / button` close + `ELK / scrollbar`, with
// `Input Code (Desktop/Mobile)` dropped into the slot), so this renders the
// kit's real Modal rather than a look-alike card. Everything the old
// hand-rolled shell carried turned out to be a byte-for-byte copy of
// Modal's chrome — 592px wide (`size="m"`), 32px radius, the close button
// on #F4F4F4/#252628 (--otp-close-* == --btn-secondary-grey-*), and the
// title/subtitle typography that ModalTitle/ModalDescription already own.
//
// Note this makes the component a real dialog: portal, backdrop, focus trap
// and Esc all come from Base UI's Dialog. That is the intended usage in this
// system; if an inline, non-dialog OTP widget is ever needed, split it out
// as its own component rather than making this one render both ways.
//
// Figma puts no title in the Modal Top bar — the Title/Text pair sits at the
// start of the Body (the kit's documented "Modal Top: None" arrangement), so
// there is no ModalHeader here.
interface OtpConfirmCardProps {
  /** Controlled open state. Omit for an uncontrolled dialog driven by
   * `defaultOpen` and/or `trigger`. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Element that opens the dialog, rendered through ModalTrigger. */
  trigger?: React.ReactElement
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
  className?: string
}

function OtpConfirmCard({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
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
    <Modal open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <ModalTrigger render={trigger} />}
      <ModalContent size="m" data-slot="otp-confirm-card">
        {/* Figma's Small-modal body insets are 48px on every side (Texts and
            Slot both start at x=48 inside the 592px card), wider than
            ModalBody's default 32px desktop padding. */}
        <ModalBody
          className={cn("flex flex-col gap-8 desktop:px-12 desktop:py-12", className)}
        >
          <div className="flex flex-col gap-4 desktop:gap-2">
            <ModalTitle>{title}</ModalTitle>
            <ModalDescription>
              {subtitle ??
                (phone
                  ? `Код подтверждения отправлен на номер ${phone}`
                  : null)}
            </ModalDescription>
          </div>

          <form
            className="flex flex-col gap-12"
            onSubmit={(event) => {
              event.preventDefault()
              if (complete) onSubmit?.(code)
            }}
          >
            <OtpInput
              length={length}
              value={code}
              onChange={handleChange}
              error={error}
            />

            <div className="flex flex-col gap-6">
              <ResendCode seconds={resendSeconds} onResend={onResend} />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!complete}
              >
                Подтвердить
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { OtpConfirmCard }
export type { OtpConfirmCardProps }
