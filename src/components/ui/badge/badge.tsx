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

  // "Point" is an 8px dot centered in the same 16px hit box as Counter —
  // confirmed via get_design_context on the master ("ELK / badge"): the
  // outer container is a fixed size-[16px] anchor (so Point and Counter
  // line up identically wherever a badge is positioned, e.g. pinned to an
  // icon corner), but Point's own visible circle is a separate inner
  // size-[8px] element, not the full 16px box. An earlier pass filled the
  // whole 16px box for Point, rendering a dot twice the spec's diameter —
  // caught by cross-checking the master's literal JSX against the
  // screenshot, where Point dots are visibly half the size of Counter
  // pills.
  if (type === "point") {
    return (
      <span
        data-slot="badge"
        data-type={type}
        data-color={color}
        className={cn("inline-flex size-4 items-center justify-center", className)}
      >
        <span
          className="size-2 shrink-0 rounded-full"
          style={{
            backgroundColor: style.bg,
            border: style.border ? `1px solid ${style.border}` : undefined,
          }}
        />
      </span>
    )
  }

  return (
    <span
      data-slot="badge"
      data-type={type}
      data-color={color}
      className={cn(
        "inline-flex h-4 min-w-4 max-w-[33px] items-center justify-center rounded-full px-1 text-p3-regular",
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        border: style.border ? `1px solid ${style.border}` : undefined,
      }}
    >
      {formatBadgeCount(value)}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
