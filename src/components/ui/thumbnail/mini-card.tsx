import { cn } from "@/lib/utils"

import { PaymentIcon } from "./payment-icon"
import swoosh from "./payment-icons/card-swoosh.svg"
import type { PaymentSystem } from "./variants"

// Type=Card и Type=Sticker мастера «ELK / thumbnail» — миниатюра `IB / card
// account`: тёмная карта с белой рамкой 1px, значок платёжной системы 14×6 на
// (3, 3), окончание номера P4 Regular у правого нижнего края (right 3, строка
// 12 прижата к низу). Размер L / Desktop — 48×34, остальные (M и обе мобильные
// формы) — 40×28; значок и цифры при этом не масштабируются.
//
// Card добавляет справа светло-серый «блик» (вектор 25×34 на L, 19×28 на M —
// один и тот же SVG, растянутый на коробку, как и в мастере), Sticker — серый
// квадрат 12×12 с радиусом bl 4 в правом верхнем углу.
//
// Собственная копия, а не `CardAccount`: тот импортирует Thumbnail ради
// `PaymentIcon`, и обратная ссылка дала бы цикл.
function MiniCard({
  kind,
  compact,
  system,
  last4,
  disabled,
}: {
  kind: "card" | "sticker"
  /** M-размер: 40×28 на любой форме (у L это только мобильная форма). */
  compact: boolean
  system: PaymentSystem
  last4: string
  disabled?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      data-slot="thumbnail-mini-card"
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-[4px] border border-white bg-[var(--card-thumb-bg)]",
        compact ? "h-7 w-10" : "h-7 w-10 desktop:h-[34px] desktop:w-12"
      )}
    >
      {kind === "card" && (
        <img
          src={swoosh}
          alt=""
          className={cn(
            "absolute -top-px -right-px max-w-none",
            compact ? "h-7 w-[19px]" : "h-7 w-[19px] desktop:h-[34px] desktop:w-[25px]"
          )}
        />
      )}
      {kind === "sticker" && (
        <span className="absolute -top-px -right-px size-3 rounded-bl-[4px] bg-[var(--grey-284)]" />
      )}
      <PaymentIcon
        system={system}
        size="14x6"
        disabled={disabled}
        className="absolute top-[3px] left-[3px]"
      />
      {last4 !== "" && (
        <span className="absolute right-[3px] bottom-0 text-p4-regular text-white">
          {last4}
        </span>
      )}
    </span>
  )
}

export { MiniCard }
