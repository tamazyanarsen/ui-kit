import { cn } from "@/lib/utils"

import type { PaymentSystem } from "./variants"

// Simplified brand marks — this is a spec-verification demo kit, not a
// place to vendor real payment-network SVG assets, so each logo is a
// small approximation (color + wordmark) rather than the literal brand
// artwork shown in the Figma export.
function PaymentLogo({
  system,
  disabled,
  className,
}: {
  system: PaymentSystem
  disabled?: boolean
  className?: string
}) {
  if (system === "mir") {
    return (
      <span
        className={cn(
          "text-[10px] font-extrabold tracking-tight",
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
      <span className={cn("relative inline-flex h-4 w-6", className)}>
        <span
          className={cn(
            "absolute left-0 size-4 rounded-full",
            disabled ? "bg-white/50" : "bg-[#EB001B]"
          )}
        />
        <span
          className={cn(
            "absolute right-0 size-4 rounded-full mix-blend-hard-light",
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
          "text-[9px] font-extrabold tracking-tighter",
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
        "text-xs font-bold italic tracking-tight",
        disabled ? "text-white/70" : "text-white",
        className
      )}
    >
      VISA
    </span>
  )
}

export { PaymentLogo }
