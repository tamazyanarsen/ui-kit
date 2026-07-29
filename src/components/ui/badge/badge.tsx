import { cn } from "@/lib/utils"

import {
  BADGE_COLORS,
  disabledBadgeStyle,
  formatBadgeCount,
  type BadgeColor,
  type BadgeType,
} from "./variants"

// Badge — "Счётчик": a small status/count indicator used instead of a chip
// when the case calls for it. `type="counter"` shows a number (1–99
// unchanged, 100+ shown as "99+"); `type="point"` is just the filled
// circle, no text. Fixed 16px minimum size, growing into a pill only when
// the counter text needs more room — it never squashes below a circle.
interface BadgeProps {
  type?: BadgeType
  color?: BadgeColor
  value?: number
  disabled?: boolean
  className?: string
}

function Badge({
  type = "counter",
  color = "red",
  value = 0,
  disabled = false,
  className,
}: BadgeProps) {
  const style = disabled ? disabledBadgeStyle(color) : BADGE_COLORS[color]

  return (
    <span
      data-slot="badge"
      data-type={type}
      data-color={color}
      className={cn(
        "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium",
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        boxShadow: style.border ? `0 0 0 2px ${style.border}` : undefined,
      }}
    >
      {type === "counter" && formatBadgeCount(value)}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
