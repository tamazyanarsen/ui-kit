import { cn } from "@/lib/utils"

import { PaymentLogo } from "./payment-logo"
import type { PaymentSystem } from "./variants"

import mastercard14x6 from "./payment-icons/mastercard-14x6.svg"
import mastercard24 from "./payment-icons/mastercard-24.svg"
import mastercard24x6 from "./payment-icons/mastercard-24x6.svg"
import mir24 from "./payment-icons/mir-24.svg"
import mir24x6 from "./payment-icons/mir-24x6.svg"
import visa24 from "./payment-icons/visa-24.svg"
import visa24x6 from "./payment-icons/visa-24x6.svg"

/**
 * Настоящие значки платёжных систем из макета — компоненты `icon / mir
 * default`, `icon / mastercard` и `icon / visa white`. Раньше везде стоял
 * `PaymentLogo`: цвет и надпись, набранные на глаз.
 *
 * У значка в макете три формата, и каждый нужен своему месту:
 *
 *   24×24  плитка Thumbnail Type=Card (значок по центру, поля 12/8);
 *   24×6   плитка Thumbnail SBP Card / SBP Card Account (значок над цифрами);
 *   14×6   миниатюра `IB / card account` в Card: коробка 14×6, у Mastercard
 *          рисунок занимает левые 76.53% (10.71×6, `inset-[0_23.47%_0_0]`).
 *
 * Файлы — ровно те SVG, что отдаёт Figma; фирменные заливки в них свои
 * (у Mastercard 14×6 это #DC3030/#FF9F1A, у 24×24 и 24×6 — #EB001B/#F79E1B),
 * поэтому подменять цвет «под тему» нельзя. Каждый значок — отдельный файл и
 * показывается через `<img>`: у MIR внутри градиент с id, и при вставке
 * разметкой два значка на странице перебивали бы друг другу заливку.
 *
 * Чего в макете нет, остаётся на `PaymentLogo`: белый «МИР» (`mir-white`) и
 * Visa 14×6 — у мастера миниатюры карты есть только Mastercard, а у мастера
 * значка не разрешается узел Visa этого размера. Правило проекта: не с чем
 * сравнить — оставляем как есть.
 */
type PaymentIconSize = "24" | "24x6" | "14x6"

const ICONS: Partial<
  Record<PaymentIconSize, Partial<Record<PaymentSystem, string>>>
> = {
  "24": { mir: mir24, mastercard: mastercard24, visa: visa24 },
  "24x6": { mir: mir24x6, mastercard: mastercard24x6, visa: visa24x6 },
  "14x6": { mastercard: mastercard14x6 },
}

/** Размер коробки и рисунка, px. У Mastercard 14×6 рисунок уже коробки. */
const BOX: Record<PaymentIconSize, { w: number; h: number; imgW: number }> = {
  "24": { w: 24, h: 24, imgW: 24 },
  "24x6": { w: 24, h: 6, imgW: 24 },
  "14x6": { w: 14, h: 6, imgW: 10.7142 },
}

const FALLBACK_SIZE = { "24": "md", "24x6": "sm", "14x6": "sm" } as const

function PaymentIcon({
  system,
  size,
  disabled,
  className,
}: {
  system: PaymentSystem
  size: PaymentIconSize
  /** Только для запасного `PaymentLogo`: у плитки Disabled — плоский opacity. */
  disabled?: boolean
  className?: string
}) {
  const src = ICONS[size]?.[system]
  if (!src) {
    return (
      <PaymentLogo
        system={system}
        size={FALLBACK_SIZE[size]}
        disabled={disabled}
        className={className}
      />
    )
  }
  const { w, h, imgW } = BOX[size]
  return (
    <span
      data-slot="payment-icon"
      data-system={system}
      data-size={size}
      aria-hidden="true"
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: w, height: h }}
    >
      {/* Явные width/height: у SVG из Figma `preserveAspectRatio="none"`,
          без них рисунок тянется по коробке. */}
      <img
        src={src}
        alt=""
        width={imgW}
        height={h}
        draggable={false}
        className="absolute top-0 left-0 block max-w-none"
      />
    </span>
  )
}

export { PaymentIcon }
export type { PaymentIconSize }
