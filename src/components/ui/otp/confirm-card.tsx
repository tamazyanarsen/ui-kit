import * as React from "react"

import { cn } from "@/lib/utils"
import { hasContent } from "@/lib/has-content"
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

// OtpConfirmCard — окно «Подтвердите контактные данные».
//
// В макете `ELK / otp-code` собран как буквальный инстанс `ELK / Modal`
// (Modal Top/Body Small плюс закрывающая `ELK / button` и
// `ELK / scrollbar`, с `Input Code (Desktop/Mobile)` в слоте), поэтому
// здесь рисуется настоящий Modal кита, а не похожая на него карточка. Всё,
// что несла прежняя самодельная оболочка, оказалось побайтовой копией
// обрамления Modal: ширина 592px (`size="m"`), радиус 32px, кнопка закрытия
// на #F4F4F4/#252628 (то есть на общем --btn-secondary-grey-*: своей пары
// токенов у крестика OTP больше нет — плашку красит один общий) и
// типографика заголовка с подзаголовком, которой и так владеют ModalTitle и
// ModalDescription.
//
// Учтите, что из-за этого компонент становится настоящим диалогом: портал,
// подложка, ловушка фокуса и Esc приходят из Dialog в Base UI. В этой
// системе так и задумано; если когда-нибудь понадобится встроенный
// не-диалоговый виджет OTP, его следует выделить отдельным компонентом, а
// не учить этот рисоваться двумя способами.
//
// Заголовка в полосе Modal Top макет не ставит: пара «заголовок и текст»
// стоит в начале тела (документированная в ките раскладка «Modal Top:
// None»), поэтому ModalHeader здесь нет.
interface OtpConfirmCardProps {
  /** Управляемое состояние открытия. Опустите для неуправляемого диалога,
   * которым правят `defaultOpen` и/или `trigger`. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Элемент, открывающий диалог; рисуется через ModalTrigger. */
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
  // Пустой подзаголовок не рисуется вовсе: иначе пустой абзац занимал место
  // в колонке с зазором.
  const description =
    subtitle ??
    (phone ? `Код подтверждения отправлен на номер ${phone}` : null)

  return (
    <Modal open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <ModalTrigger render={trigger} />}
      <ModalContent size="m" data-slot="otp-confirm-card">
        {/* Тело маленького окна в макете: слева и справа 48px (Texts и Slot
            начинаются с x=48 внутри карточки 592px), СВЕРХУ отступа нет —
            заголовок стоит сразу под полосой Modal Top (y=48), а 48px снизу
            даёт нижний Holder. Высота карточки 48 + 392 + 48 = 488.
            Разделители ModalBody места не занимают (внутренняя тень), поэтому
            компенсации отступа не нужно. */}
        <ModalBody
          className={cn(
            "flex flex-col gap-8 desktop:px-12 desktop:pt-0 desktop:pb-12",
            className
          )}
        >
          <div className="flex flex-col gap-4 desktop:gap-2">
            <ModalTitle>{title}</ModalTitle>
            {hasContent(description) && (
              <ModalDescription>{description}</ModalDescription>
            )}
          </div>

          <OtpConfirmForm
            length={length}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            error={error}
            resendSeconds={resendSeconds}
            onResend={onResend}
            onSubmit={onSubmit}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

/**
 * Форма кода. Неуправляемый код живёт ЗДЕСЬ, внутри содержимого окна, а не
 * в самом OtpConfirmCard: содержимое закрытого диалога размонтируется, и код
 * сбрасывается вместе с таймером ResendCode. Раньше состояние жило снаружи
 * диалога — после закрытия и повторного открытия в поле стоял прежний код,
 * а «Подтвердить» была сразу активна.
 */
function OtpConfirmForm({
  length,
  value,
  defaultValue,
  onValueChange,
  error,
  resendSeconds,
  onResend,
  onSubmit,
}: Required<Pick<OtpConfirmCardProps, "length" | "defaultValue" | "resendSeconds">> &
  Pick<OtpConfirmCardProps, "value" | "onValueChange" | "error" | "onResend" | "onSubmit">) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const code = value ?? uncontrolled
  // Полнота и уходящий наружу код считаются по цифрам, как их читает поле:
  // «12 34 56» из внешнего значения — это шесть цифр, а не восемь знаков.
  const digits = code.replace(/\D/g, "").slice(0, length)
  const complete = digits.length === length

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <form
      className="flex flex-col gap-12"
      onSubmit={(event) => {
        event.preventDefault()
        if (complete) onSubmit?.(digits)
      }}
    >
      <OtpInput length={length} value={code} onChange={handleChange} error={error} />

      <div className="flex flex-col gap-6">
        <ResendCode seconds={resendSeconds} onResend={onResend} />

        <Button type="submit" variant="primary" size="lg" disabled={!complete}>
          Подтвердить
        </Button>
      </div>
    </form>
  )
}

export { OtpConfirmCard }
export type { OtpConfirmCardProps }
