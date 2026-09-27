import { cn } from "@/lib/utils"

import type { PaymentSystem } from "./variants"

// Упрощённые фирменные знаки: это кит для сверки с макетом, а не место для
// переноса настоящих SVG-ассетов платёжных систем, поэтому каждый логотип —
// небольшое приближение (цвет плюс надпись), а не буквальная фирменная
// графика из выгрузки макета.
//
// `size="sm"` — тот же знак, уменьшенный под крошечную плитку мини-карты
// 48×34 у Card (см. ui/card): пропорции подобраны, чтобы он читался в этом
// углу, а не буквальным transform-scale знака «md», который использует
// Thumbnail.
const MIR_TEXT_SIZE = { sm: "text-[6px]", md: "text-[10px]", lg: "text-[17px]" }
const MASTERCARD_BOX = { sm: "h-2.5 w-4", md: "h-4 w-6", lg: "h-[26px] w-[39px]" }
const MASTERCARD_CIRCLE = { sm: "size-2.5", md: "size-4", lg: "size-[26px]" }
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
  // Дизайн-чек «Storybook 3», замечание 9: у знака «МИР» два начертания —
  // фирменное зелёное и белое. Белым он стоит на тёмной миниатюре
  // бизнес-карты; раньше на её месте был UnionPay, которого в продукте нет.
  if (system === "mir" || system === "mir-white") {
    return (
      <span
        className={cn(
          MIR_TEXT_SIZE[size],
          "font-extrabold tracking-tight",
          disabled
            ? "text-white/70"
            : system === "mir-white"
              ? "text-white"
              : "text-[#5CC862]",
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
