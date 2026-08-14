import type * as React from "react"

import { cn } from "@/lib/utils"
import { Icon, type IconName } from "@/components/ui/icon"

import { getTagStyle, type TagColor, type TagSize, type TagVariant } from "./variants"

// Tag — "Тег": a small, non-interactive label that marks status changes
// (Green/Orange/Red/Blue/Grey) or generic signs (Black/White/Grey-Info) on
// an object. Per spec it's not clickable and never shows a tooltip on hover.
interface TagProps {
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  /**
   * Ведущая иконка. Имя из набора кита (`"check"`, `"clock"`, …) либо
   * готовый узел, если нужен глиф не из набора.
   *
   * Раньше здесь стоял булев `showIcon`, который всегда рисовал галочку:
   * тег «В обработке» или «Отклонён» получал ту же `check`, что и
   * «Исполнено». В Figma иконка внутри тега — instance swap, то есть
   * выбирается, а не включается.
   */
  icon?: IconName | React.ReactNode
  className?: string
  children: React.ReactNode
}

function Tag({
  color = "green",
  variant = "main",
  size = "l",
  icon,
  className,
  children,
}: TagProps) {
  const style = getTagStyle(color, variant)

  return (
    <span
      data-slot="tag"
      data-color={color}
      data-variant={variant}
      data-size={size}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[4px] px-1.5 whitespace-nowrap",
        // The S box pads 2px off the top rather than centring (master
        // `Size=Mobile`: `pt-[2px]` on an 18px box with a 16px line), which
        // drops the digits/caps 1px below the geometric centre — same trick
        // Badge uses. L centres normally (`py-px` on 22/20).
        size === "l" ? "h-[22px] text-p2-medium" : "h-[18px] pt-[2px] text-p3-medium",
        style.border && "border",
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        borderColor: style.border,
      }}
    >
      {typeof icon === "string" ? (
        <Icon name={icon} aria-hidden="true" className="size-4 shrink-0" />
      ) : (
        icon
      )}
      {children}
    </span>
  )
}

export { Tag }
export type { TagProps }
