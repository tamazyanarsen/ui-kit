import type * as React from "react"

import { cn } from "@/lib/utils"
import { Icon, type IconName } from "@/components/ui/icon"

import { getTagStyle, type TagColor, type TagVariant } from "./variants"

// Tag — "Тег": a small, non-interactive label that marks status changes
// (Green/Orange/Red/Blue/Grey) or generic signs (Black/White/Grey-Info) on
// an object. Per spec it's not clickable and never shows a tooltip on hover.
//
// Свойства компонент-сета `ELK / tag` (847:53629) — ровно три: Size
// (Desktop/Mobile), Style (13 значений) и Show Icon. Style разложен здесь
// на пару `color` + `variant` (5 статусных цветов × сплошной/контурный + 3
// «признака» = те же 13 сочетаний), Show Icon — это `icon`.
//
// Дизайн-чек №3 №1: «У тега много лишних вариантов и нет разбивки
// desktop/mobile». Проп `size` (l/s) убран: в Figma это не самостоятельное
// свойство, а те же Desktop (22px, P2) и Mobile (18px, P3), поэтому размер
// переключается вариантом `desktop:`, как у остальных компонентов кита.
interface TagProps {
  color?: TagColor
  variant?: TagVariant
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
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[4px] px-1.5 whitespace-nowrap",
        // Mobile-first, как и везде в ките. Мобильная коробка не центрирует
        // текст, а сдвигает его на 2px вниз (мастер `Size=Mobile`:
        // `pt-[2px]` на 18px при 16px строке) — тот же приём, что у Badge;
        // десктопная (22/20) центрируется обычным `py-px`.
        "h-[18px] pt-[2px] text-p3-medium desktop:h-[22px] desktop:pt-0 desktop:text-p2-medium",
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
