import * as React from "react"

import { cn } from "@/lib/utils"
import type { PaymentSystem } from "@/components/ui/thumbnail"
import { useToast } from "@/components/ui/toast-message"

import { CardBack, CardFace, type BankCardSize } from "./faces"
import type { BankCardSkin } from "./variants"

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
  /** Свойство `Size` — Desktop (332×208) или Mobile (254×160). */
  size?: BankCardSize
  /**
   * Свойство `Type` — какой стороной лежит карта. Управляемый близнец
   * внутреннего переворота по клику: задан — сторона фиксирована снаружи,
   * не задан — картой управляет клик по ней.
   */
  type?: "face" | "back"
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

function BankCard({
  skin = "mono",
  size = "desktop",
  type,
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
  const [internalSide, setInternalSide] = React.useState<"face" | "back">("face")
  const side = type ?? internalSide
  const setSide = React.useCallback(
    (next: "face" | "back") => {
      if (type === undefined) setInternalSide(next)
    },
    [type]
  )
  const [revealed, setRevealed] = React.useState<"number" | "cvc" | null>(null)
  const { add } = useToast()

  function flip() {
    setSide(side === "face" ? "back" : "face")
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
      className={cn(
        "relative cursor-pointer outline-none focus-visible:focus-ring",
        size === "mobile" ? "h-[160px] w-[254px]" : "h-[208px] w-[332px]",
        className
      )}
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
          size={size}
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
          size={size}
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
export type { BankCardProps, BankCardSize }
