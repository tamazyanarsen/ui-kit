import * as React from "react"

import { ChevronLeft, X } from "@/icons"
import { Button } from "@/components/ui/button"

import { HeaderLabel } from "./nav-header"

// Обвязка мобильного листа: заголовок, строка навигации и две подписи
// секций внутри бесконечной прокрутки.

// Figma's "Title" row: pt-24/pb-8/px-16, 18px/medium/24-leading text, close
// button on a #f4f4f4 (--calendar-range-bg) circle — measured off the real
// mobile bottom-sheet usage mock, not the isolated anatomy symbol.
function SheetHeader({
  title,
  onClose,
}: {
  title: string
  onClose?: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 pt-6 pb-2">
      <h2 className="text-h4-mobile text-[var(--calendar-fg)]">{title}</h2>
      {/* `ELK / button` instance in Figma (node 7415:58839) on a grey-109
          #F4F4F4 fill — that is Button's own `secondary-grey`, not the
          calendar's day-hover token that happens to share the hex. */}
      <Button
        variant="secondary-grey"
        size="sm"
        iconPosition="only"
        icon={X}
        aria-label="Закрыть"
        onClick={onClose}
        className="shrink-0"
      />
    </div>
  )
}

// Figma's "Subtitle" nav row: same gap-8 as coded (gap-2), but pb-8 (pb-2),
// not pb-3 — measured off the same real bottom-sheet mock as SheetHeader.
function SheetNav({ label, onBack }: { label: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-2">
      {onBack && (
        // `ELK / button` instance in Figma (node 7415:58841), white fill.
        <Button
          variant="secondary-white"
          size="sm"
          iconPosition="only"
          icon={ChevronLeft}
          aria-label="Назад"
          onClick={onBack}
          className="shrink-0"
        />
      )}
      {/* Matches the desktop nav pill's "Май"/"2024" label
          (get_design_context on 7415:58522) — Object Sans Medium (P2
          Medium), not Regular. */}
      <span className="text-p2-medium text-[var(--calendar-fg)]">{label}</span>
    </div>
  )
}

// Per-month heading used inside the Day/Range infinite scroll (mode="single"
// | "range"): Figma renders this as the same rounded pill/label used for the
// desktop nav ("Май"), not a plain heading — confirmed against the real
// bottom-sheet usage mock (title "Выберите даты" → nav "2024" → pill "Май").
function MonthPillHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start px-3 pt-2 pb-4 text-p2-medium text-[var(--calendar-fg)]">
      <HeaderLabel>{children}</HeaderLabel>
    </div>
  )
}

// Per-year/decade heading used inside the Month/Year infinite scroll
// (mode="month" | "year"): Figma's MonthYear (Mobile) anatomy shows this as
// a 22px/medium/30-leading heading ("2024", "2013 – 2024"), not text-lg
// font-semibold.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-4 pt-[22px] pb-4 text-h2-mobile text-[var(--calendar-fg)]">
      {children}
    </h3>
  )
}

export { MonthPillHeading, SectionHeading, SheetHeader, SheetNav }
