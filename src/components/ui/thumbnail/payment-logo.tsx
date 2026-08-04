import { cn } from "@/lib/utils"

import type { PaymentSystem } from "./variants"

// Simplified brand marks — this is a spec-verification demo kit, not a
// place to vendor real payment-network SVG assets, so each logo is a
// small approximation (color + wordmark) rather than the literal brand
// artwork shown in the Figma export.
//
// `size="sm"` is the same mark scaled down for Card's tiny 48×34 mini-card
// tile (see ui/card) — proportioned to sit legibly in that corner rather
// than a literal transform-scale of the "md" mark used by Thumbnail.
const MIR_TEXT_SIZE = { sm: "text-[6px]", md: "text-[10px]", lg: "text-[17px]" }
const MASTERCARD_BOX = { sm: "h-2.5 w-4", md: "h-4 w-6", lg: "h-[26px] w-[39px]" }
const MASTERCARD_CIRCLE = { sm: "size-2.5", md: "size-4", lg: "size-[26px]" }
const UNIONPAY_TEXT_SIZE = { sm: "text-[5px]", md: "text-[9px]", lg: "text-[15px]" }
const VISA_TEXT_SIZE = { sm: "text-[6px]", md: "text-xs", lg: "text-[20px]" }

function PaymentLogo({
  system,
  disabled,
  size = "md",
  className,
}: {
  system: PaymentSystem
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  if (system === "mir") {
    return (
      <span
        className={cn(
          MIR_TEXT_SIZE[size],
          "font-extrabold tracking-tight",
          disabled ? "text-white/70" : "text-[#5CC862]",
          className
        )}
      >
        МИР
      </span>
    )
  }

  if (system === "mastercard") {
    return (
      <span className={cn("relative inline-flex", MASTERCARD_BOX[size], className)}>
        <span
          className={cn(
            "absolute left-0 rounded-full",
            MASTERCARD_CIRCLE[size],
            disabled ? "bg-white/50" : "bg-[#EB001B]"
          )}
        />
        <span
          className={cn(
            "absolute right-0 rounded-full mix-blend-hard-light",
            MASTERCARD_CIRCLE[size],
            disabled ? "bg-white/50" : "bg-[#F79E1B]"
          )}
        />
      </span>
    )
  }

  if (system === "unionpay") {
    return (
      <span
        className={cn(
          UNIONPAY_TEXT_SIZE[size],
          "font-extrabold tracking-tighter",
          disabled ? "text-white/70" : "text-white",
          className
        )}
      >
        UnionPay
      </span>
    )
  }

  return (
    <span
      className={cn(
        VISA_TEXT_SIZE[size],
        "font-bold italic tracking-tight",
        disabled ? "text-white/70" : "text-white",
        className
      )}
    >
      VISA
    </span>
  )
}

export { PaymentLogo }
