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
        // `px-[2px] pt-[2px]`, not `px-1`/centered — the master's counter
        // (`ELK / badge`, 34:17385) pads 2px on the sides and pushes its
        // 14px-tall text box down by 2px from the top, which both keeps
        // two-digit counters 4px narrower than a 4px padding would and drops
        // the digits 1px below the geometric centre (they read as centred
        // because digits have no descenders).
        "inline-flex h-4 min-w-4 max-w-[33px] items-center justify-center rounded-full px-[2px] pt-[2px] text-p3-regular",
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
