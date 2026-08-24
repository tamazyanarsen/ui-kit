import * as React from "react"

import { ChevronLeft, ChevronRight } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavHeaderProps {
  onPrev: () => void
  onNext: () => void
  children: React.ReactNode
  /** Figma's ELK/calendar has two different container paddings: the Day/
   * Range card is 14px horizontal with an 8px gap down to the weekday row
   * ("day"), while the Month/Year card is 16px horizontal with a 16px gap
   * down to the grid ("picker"). Both are baked in here as the header's own
   * side/bottom padding rather than a parent-level gap. */
  variant?: "day" | "picker"
}

// The prev/next arrows are `ELK / button` instances in Figma (32×32, 16px
// radius, 16px glyph, white fill) — exactly Button's `icon-sm` geometry, so
// they render the real Button. They previously hand-rolled a look-alike that
// borrowed `--calendar-range-bg` (#F4F4F4) for hover, but that token is the
// *day cell's* hover (Figma grey-109, node 7415:45489); a button instance
// takes Button's own #EFEFEF hover instead.
function NavHeader({ onPrev, onNext, children, variant = "day" }: NavHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4",
        variant === "picker" ? "px-4 pb-4" : "px-3.5 pb-2"
      )}
    >
      <Button
        variant="secondary-white"
        size="sm"
        iconPosition="only"
        icon={ChevronLeft}
        aria-label="Назад"
        onClick={onPrev}
      />
      <div className="flex items-center text-p2-medium text-[var(--calendar-fg)]">
        {children}
      </div>
      <Button
        variant="secondary-white"
        size="sm"
        iconPosition="only"
        icon={ChevronRight}
        aria-label="Вперёд"
        onClick={onNext}
      />
    </div>
  )
}

/** Подпись в шапке: таблетка-кнопка, если по ней можно переключить вид. */
function HeaderLabel({
  onClick,
  children,
}: {
  onClick?: () => void
  children: React.ReactNode
}) {
  if (!onClick) {
    return (
      <span className="inline-flex h-8 items-center rounded-[16px] px-4">
        {children}
      </span>
    )
  }
  // text-p2-medium override: Button's `sm` is text-p3-medium until
  // `desktop:`, but Figma's Mouth/Year pill is 14px/20 on both the desktop
  // card and the mobile sheet, so the size is pinned rather than
  // breakpoint-switched.
  return (
    <Button
      variant="secondary-white"
      size="sm"
      className="text-p2-medium"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export { HeaderLabel, NavHeader }
