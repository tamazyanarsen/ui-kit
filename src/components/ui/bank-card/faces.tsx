import * as React from "react"
import { Eye, EyeOff } from "@/icons"

import { cn } from "@/lib/utils"
import { PaymentLogo } from "@/components/ui/thumbnail"
import type { PaymentSystem } from "@/components/ui/thumbnail"

import { SKIN_STYLES, type BankCardSkin } from "./variants"

// Две стороны карты и поле с раскрытием значения. Вынесены из
// `bank-card.tsx`: там остаётся сам компонент с его состоянием переворота.

/**
 * Свойство `Size` компонент-сета ` ELK / cards`.
 *
 * Дизайн-чек Storybook (Аня Багрова) №19: «отсутствует вариант Mobile». В
 * макете это отдельные символы (`Size=Mobile, …`, напр. 52969:11687), а не
 * та же карта под медиазапросом: коробка 254×160 вместо 332×208, логотип
 * платёжной системы 52×17 вместо 80×26 и зазор между ним и номером 4 вместо
 * 6. Внутренние поля, скругление и размеры шрифтов совпадают.
 */
export type BankCardSize = "desktop" | "mobile"

const CARD_BOX: Record<BankCardSize, string> = {
  desktop: "h-[208px] w-[332px]",
  mobile: "h-[160px] w-[254px]",
}

function RevealField({
  compact = false,
  maskedValue,
  revealedValue,
  revealed,
  onToggle,
  className,
}: {
  /** Мобильная карта: подпись поля 14/20 вместо 16/24 (52969:11796). */
  compact?: boolean
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
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-white",
          compact ? "text-p2-medium" : "text-p1-medium"
        )}
      >
        {revealed ? revealedValue : maskedValue}
      </span>
      <button
        type="button"
        aria-label={revealed ? "Скрыть" : "Показать и скопировать"}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        className="flex shrink-0 cursor-pointer items-center justify-center text-white outline-none focus-visible:focus-ring"
      >
        {revealed ? (
          <EyeOff aria-hidden="true" className="size-4" />
        ) : (
          <Eye aria-hidden="true" className="size-4" />
        )}
      </button>
    </div>
  )
}

function CardFace({
  skin,
  size = "desktop",
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
  size?: BankCardSize
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
        "relative flex flex-col gap-4 overflow-hidden rounded-[16px] border border-white p-4 shadow-[0px_23px_12px_-15px_rgba(0,0,0,0.15)]",
        CARD_BOX[size],
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
        // master's "PS and number" column is `gap-[6px]`, not 4. У мобильного
        // символа (52969:11709) он же 4.
        <div
          className={cn(
            "relative flex flex-1 flex-col items-start",
            size === "mobile" ? "gap-1" : "gap-1.5"
          )}
        >
          <PaymentLogo
            system={paymentSystem}
            size={size === "mobile" ? "md" : "lg"}
          />
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
              className="w-fit cursor-pointer text-p3-medium text-white outline-none focus-visible:focus-ring hover:underline"
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
  size = "desktop",
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
  size?: BankCardSize
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
        // Десктопная сторона распирает блоки по краям, мобильная (52969:11793)
        // ставит их подряд с зазором 9.
        "flex flex-col overflow-hidden rounded-[16px] border border-white bg-[var(--tag-black-bg)] p-4 shadow-[0px_23px_12px_-15px_rgba(37,38,40,0.15)]",
        size === "mobile" ? "gap-[9px]" : "justify-between",
        CARD_BOX[size],
        className
      )}
      style={style}
    >
      <div className="flex flex-col gap-4">
        <RevealField
          compact={size === "mobile"}
          maskedValue={`···· ···· ···· ${last4}`}
          revealedValue={cardNumber}
          revealed={revealed === "number"}
          onToggle={() => onToggleReveal("number")}
        />
        {/* Подпись «CVC/CVV» — сосед плашки, а не её содержимое: в макете
            (52969:11798) она стоит рядом с 72px-плашкой во flex-строке.
            Раньше она лежала внутри и потому налезала на глаз. */}
        <div className="flex items-center gap-2">
          <RevealField
            compact={size === "mobile"}
            maskedValue="···"
            revealedValue={cvc}
            revealed={revealed === "cvc"}
            onToggle={() => onToggleReveal("cvc")}
            className="w-[72px] shrink-0"
          />
          <span className="text-p3-medium text-[#999]">CVC/CVV</span>
        </div>
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

export { CardBack, CardFace }
