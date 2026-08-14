import * as React from "react"
import { Eye, EyeOff } from "@/icons"

import { cn } from "@/lib/utils"
import { PaymentLogo } from "@/components/ui/thumbnail"
import type { PaymentSystem } from "@/components/ui/thumbnail"
import { useToast } from "@/components/ui/toast-message"

import { SKIN_STYLES, type BankCardSkin } from "./variants"

// BankCard — "ELK / cards": the full bank-card visual (not to be confused
// with the unrelated `Card` account-row component). Tapping the face flips
// to the back (спецификация: "по нажатию на иконку eye раскрывается номер
// карты или CVC/CVV-код. Одновременно оба значения в полях не могут быть
// открытыми"); revealing either value simultaneously copies it and shows a
// toast (спецификация: "Одновременно с раскрытием должно происходить
// копирование").
//
// Дизайн-чек №16: артворк каждой карты — настоящий векторный ассет из
// Figma (см. ./variants.ts). Прежний комментарий здесь утверждал, что
// «извлекаемых данных о цвете нет, поэтому это CSS-приближения по
// скриншоту» — это и было причиной «принципиальных различий» с макетом:
// ассеты у Figma есть, слоем `Card Image` внутри каждого символа.
interface BankCardProps {
  skin?: BankCardSkin
  paymentSystem?: PaymentSystem
  last4?: string
  cardNumber?: string
  cvc?: string
  cardholderName?: string
  expiry?: string
  balance?: React.ReactNode
  showPaymentSystem?: boolean
  showCardNumber?: boolean
  showBalance?: boolean
  showRequisites?: boolean
  className?: string
}

function RevealField({
  label,
  maskedValue,
  revealedValue,
  revealed,
  onToggle,
  className,
}: {
  label?: string
  maskedValue: string
  revealedValue: string
  revealed: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[8px] bg-[var(--badge-dark-grey-bg)] px-2 py-2.5",
        className
      )}
    >
      <span className="min-w-0 flex-1 truncate text-p1-medium text-white">
        {revealed ? revealedValue : maskedValue}
      </span>
      <button
        type="button"
        aria-label={revealed ? "Скрыть" : "Показать и скопировать"}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        className="flex shrink-0 cursor-pointer items-center justify-center text-white outline-none"
      >
        {revealed ? (
          <EyeOff aria-hidden="true" className="size-4" />
        ) : (
          <Eye aria-hidden="true" className="size-4" />
        )}
      </button>
      {label && <span className="shrink-0 text-p3-medium text-[#999]">{label}</span>}
    </div>
  )
}

function CardFace({
  skin,
  paymentSystem,
  last4,
  balance,
  showPaymentSystem,
  showCardNumber,
  showBalance,
  showRequisites,
  onShowRequisites,
  style,
  className,
}: {
  skin: BankCardSkin
  paymentSystem: PaymentSystem
  last4: string
  balance: React.ReactNode
  showPaymentSystem: boolean
  showCardNumber: boolean
  showBalance: boolean
  showRequisites: boolean
  onShowRequisites: () => void
  style: React.CSSProperties
  className?: string
}) {
  const skinStyle = SKIN_STYLES[skin]

  return (
    <div
      data-slot="bank-card-face"
      className={cn(
        "relative flex h-[208px] w-[332px] flex-col gap-4 overflow-hidden rounded-[16px] border border-white p-4 shadow-[0px_23px_12px_-15px_rgba(0,0,0,0.15)]",
        className
      )}
      style={style}
    >
      {/* Дизайн-чек №16: артворк карты — векторный ассет из макета (слой
          `Card Image`, например нода 52969:11716 внутри Face/Mono), а не
          CSS-градиент «на глаз». Он же приносит водяной знак — здание
          ДОМ.РФ, стикер или облако, — поэтому отдельного слоя больше нет.
          В макете картинка лежит от −1px и на 1px больше карты с обеих
          сторон, перекрывая белую рамку. */}
      <img
        src={skinStyle.art}
        alt=""
        aria-hidden="true"
        className="absolute -top-px -left-px h-[calc(100%+2px)] w-[calc(100%+2px)] max-w-none"
      />

      {showPaymentSystem && (
        // 6px between the payment-system logo and the masked number — the
        // master's "PS and number" column is `gap-[6px]`, not 4.
        <div className="relative flex flex-1 flex-col items-start gap-1.5">
          <PaymentLogo system={paymentSystem} size="lg" />
          {showCardNumber && (
            // get_design_context on the "Face, Style=Mono" master (52969:11715):
            // the masked number line is Medium (500), not the browser default.
            <span className="text-p3-medium text-white">· {last4}</span>
          )}
        </div>
      )}

      {showBalance && (
        <div className="relative flex flex-col gap-0.5 text-white">
          <span className="text-p1-medium">{balance}</span>
          {showRequisites && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onShowRequisites()
              }}
              // "Показать реквизиты" sits in the same font-['Object_Sans:Medium']
              // "Balance" wrapper as the balance amount above it (52969:11715).
              className="w-fit cursor-pointer text-p3-medium text-white outline-none hover:underline"
            >
              Показать реквизиты
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function CardBack({
  last4,
  cardNumber,
  cvc,
  cardholderName,
  expiry,
  revealed,
  onToggleReveal,
  style,
  className,
}: {
  last4: string
  cardNumber: string
  cvc: string
  cardholderName: string
  expiry: string
  revealed: "number" | "cvc" | null
  onToggleReveal: (field: "number" | "cvc") => void
  style: React.CSSProperties
  className?: string
}) {
  return (
    <div
      data-slot="bank-card-back"
      className={cn(
        "flex h-[208px] w-[332px] flex-col justify-between overflow-hidden rounded-[16px] border border-white bg-[var(--tag-black-bg)] p-4 shadow-[0px_23px_12px_-15px_rgba(37,38,40,0.15)]",
        className
      )}
      style={style}
    >
      <div className="flex flex-col gap-4">
        <RevealField
          maskedValue={`···· ···· ···· ${last4}`}
          revealedValue={cardNumber}
          revealed={revealed === "number"}
          onToggle={() => onToggleReveal("number")}
        />
        <RevealField
          maskedValue="···"
          revealedValue={cvc}
          revealed={revealed === "cvc"}
          onToggle={() => onToggleReveal("cvc")}
          label="CVC/CVV"
          className="w-[72px]"
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="w-full text-p4-regular text-white uppercase">
          {cardholderName}
        </span>
        <span className="text-p3-medium text-[#999]">до {expiry}</span>
      </div>
    </div>
  )
}

function BankCard({
  skin = "mono",
  paymentSystem = "mir",
  last4 = "4498",
  cardNumber = "2200 1234 5678 4498",
  cvc = "123",
  cardholderName = "KONSTANTIN KONSTANTINOPOLSKY",
  expiry = "01/2025",
  balance = "1 200 101,16 ₽",
  showPaymentSystem = true,
  showCardNumber = true,
  showBalance = true,
  showRequisites = true,
  className,
}: BankCardProps) {
  const [side, setSide] = React.useState<"face" | "back">("face")
  const [revealed, setRevealed] = React.useState<"number" | "cvc" | null>(null)
  const { add } = useToast()

  function flip() {
    setSide((prev) => (prev === "face" ? "back" : "face"))
  }

  function toggleReveal(field: "number" | "cvc") {
    if (revealed === field) {
      setRevealed(null)
      return
    }
    setRevealed(field)
    const value = field === "number" ? cardNumber : cvc
    const label = field === "number" ? "Номер карты скопирован" : "CVC-код скопирован"
    navigator.clipboard?.writeText(value.replace(/\s/g, ""))
    add({ type: "checked", title: label, timeout: 3000 })
  }

  return (
    <div
      data-slot="bank-card"
      role="button"
      tabIndex={0}
      onClick={flip}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          flip()
        }
      }}
      className={cn("relative h-[208px] w-[332px] cursor-pointer outline-none", className)}
      style={{ perspective: "1200px" }}
    >
      <div
        className="relative size-full transition-transform duration-250 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: side === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardFace
          skin={skin}
          paymentSystem={paymentSystem}
          last4={last4}
          balance={balance}
          showPaymentSystem={showPaymentSystem}
          showCardNumber={showCardNumber}
          showBalance={showBalance}
          showRequisites={showRequisites}
          onShowRequisites={() => setSide("back")}
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0"
        />
        <CardBack
          last4={last4}
          cardNumber={cardNumber}
          cvc={cvc}
          cardholderName={cardholderName}
          expiry={expiry}
          revealed={revealed}
          onToggleReveal={toggleReveal}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0"
        />
      </div>
    </div>
  )
}

export { BankCard }
export type { BankCardProps }
