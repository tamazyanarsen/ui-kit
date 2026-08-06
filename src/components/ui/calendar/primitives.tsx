import * as React from "react"
import { ChevronLeft, ChevronRight } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import {
  WEEKDAYS_RU,
  MONTHS_RU_SHORT,
  getMonthMatrix,
  getDecadeYears,
  isSameDay,
  type DayCell,
} from "@/lib/calendar"

// Shared building blocks used by both the desktop (popover) and mobile
// (sheet) layouts — kept here so neither layout duplicates the other's
// markup, only composes it differently.

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
export function NavHeader({ onPrev, onNext, children, variant = "day" }: NavHeaderProps) {
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

export function HeaderLabel({
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
  // text-p2-medium override: Button's `sm` is text-p3-medium until `md:`,
  // but Figma's Mouth/Year pill is 14px/20 on both the desktop card and the
  // mobile sheet, so the size is pinned rather than breakpoint-switched.
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

/** Desktop day cells are 36px wide with a 14px card gutter and 0px gap down
 * to the day grid; mobile cells are 48px wide with a 12px gutter and an 8px
 * gap down to the day grid — both measured off Figma's Day (Desktop/Mobile)
 * ELK/calendar variants. */
export function WeekdaysRow({ size = "desktop" }: { size?: "desktop" | "mobile" }) {
  return (
    <div className={cn("flex", size === "mobile" ? "px-3 pb-2" : "px-3.5")}>
      {WEEKDAYS_RU.map((d) => (
        <span
          key={d}
          className={cn(
            "flex h-8 items-center justify-center text-p3-regular text-[var(--calendar-muted-fg)]",
            size === "mobile" ? "w-12" : "w-9"
          )}
        >
          {d}
        </span>
      ))}
    </div>
  )
}

export interface DayGridProps {
  year: number
  month: number
  today: Date
  isSelected: (date: Date) => boolean
  isRangeStart?: (date: Date) => boolean
  isRangeEnd?: (date: Date) => boolean
  isRangeMiddle?: (date: Date) => boolean
  /** Figma's "Disabled" day state — e.g. dates outside a min/max range.
   * Disabled days render muted and can't be clicked or focused. */
  isDisabled?: (date: Date) => boolean
  onSelectDay: (date: Date) => void
  /** See WeekdaysRow — desktop cells are 36px/8px-row-gap/14px-gutter;
   * mobile cells are 48px/24px-row-gap/12px-gutter (Figma's Date grid gap
   * is `8px 0px` on desktop vs `24px 0px` on mobile). */
  size?: "desktop" | "mobile"
}

export function DayGrid({
  year,
  month,
  today,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  isDisabled,
  onSelectDay,
  size = "desktop",
}: DayGridProps) {
  const weeks = getMonthMatrix(year, month)

  return (
    <div
      className={cn(
        "flex flex-col",
        size === "mobile" ? "gap-6 px-3 pb-2" : "gap-2 px-3.5 pb-4"
      )}
    >
      {weeks.map((week, i) => (
        <div key={i} className="flex">
          {week.map((cell, j) => (
            <DayButton
              key={j}
              cell={cell}
              today={today}
              isSelected={isSelected}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              isRangeMiddle={isRangeMiddle}
              isDisabled={isDisabled}
              onSelectDay={onSelectDay}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function DayButton({
  cell,
  today,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  isDisabled,
  onSelectDay,
  size = "desktop",
}: {
  cell: DayCell | null
} & Omit<DayGridProps, "year" | "month">) {
  const cellWidth = size === "mobile" ? "w-12" : "w-9"
  if (!cell) return <span className={cn("h-8 shrink-0", cellWidth)} />

  const selected = isSelected(cell.date)
  const rangeStart = isRangeStart?.(cell.date) ?? false
  const rangeEnd = isRangeEnd?.(cell.date) ?? false
  const rangeMiddle = isRangeMiddle?.(cell.date) ?? false
  const isToday = isSameDay(cell.date, today)
  const inRangeEdge = rangeStart || rangeEnd
  const disabled = isDisabled?.(cell.date) ?? false

  return (
    <span
      className={cn(
        "flex h-8 shrink-0 items-center justify-center",
        cellWidth,
        rangeMiddle && "bg-[var(--calendar-range-bg)]",
        rangeStart && "rounded-l-[8px] bg-[var(--calendar-range-bg)]",
        rangeEnd && "rounded-r-[8px] bg-[var(--calendar-range-bg)]"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectDay(cell.date)}
        className={cn(
          "z-10 flex size-8 shrink-0 items-center justify-center rounded-[8px] text-p2-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          disabled
            ? "cursor-not-allowed text-[var(--calendar-disabled-fg)]"
            : selected || inRangeEdge
              ? "bg-[var(--calendar-selected-bg)] text-[var(--calendar-selected-fg)]"
              : "text-[var(--calendar-fg)] hover:bg-[var(--calendar-range-bg)]",
          !disabled &&
            !selected &&
            !inRangeEdge &&
            isToday &&
            "text-[var(--calendar-accent-fg)]"
        )}
      >
        {cell.day}
      </button>
    </span>
  )
}

/** Desktop MonthYear cells are 36px tall with a 16px/24px column/row gap;
 * mobile cells are 48px tall with a 35px/16px column/row gap (Figma's
 * MonthYear (Desktop, ELK) vs MonthYear (Mobile, ELK) Date grids). The
 * container's own px-4 pb-4 stays constant — only measured for desktop, but
 * the mobile per-year/decade heading (see calendar-mobile.tsx) supplies its
 * own matching pt/gap above the grid, so no size-specific container padding
 * is needed here. */
export function MonthGrid({
  selectedMonth,
  currentMonth,
  onSelectMonth,
  size = "desktop",
}: {
  selectedMonth: number | null
  currentMonth: number | null
  onSelectMonth: (month: number) => void
  size?: "desktop" | "mobile"
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 px-4 pb-4",
        size === "mobile" ? "gap-x-[35px] gap-y-4" : "gap-x-4 gap-y-6"
      )}
    >
      {MONTHS_RU_SHORT.map((label, i) => {
        const selected = selectedMonth === i
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelectMonth(i)}
            className={cn(
              "flex items-center justify-center rounded-[8px] text-p2-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              size === "mobile" ? "h-12" : "h-9",
              selected
                ? "bg-[var(--calendar-selected-bg)] text-[var(--calendar-selected-fg)]"
                : "text-[var(--calendar-fg)] hover:bg-[var(--calendar-range-bg)]",
              !selected &&
                currentMonth === i &&
                "text-[var(--calendar-accent-fg)]"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function YearGrid({
  decadeEnd,
  selectedYear,
  currentYear,
  onSelectYear,
  size = "desktop",
}: {
  decadeEnd: number
  selectedYear: number | null
  currentYear: number
  onSelectYear: (year: number) => void
  size?: "desktop" | "mobile"
}) {
  const years = getDecadeYears(decadeEnd)
  return (
    <div
      className={cn(
        "grid grid-cols-3 px-4 pb-4",
        size === "mobile" ? "gap-x-[35px] gap-y-4" : "gap-x-4 gap-y-6"
      )}
    >
      {years.map((year) => {
        const selected = selectedYear === year
        return (
          <button
            key={year}
            type="button"
            onClick={() => onSelectYear(year)}
            className={cn(
              "flex items-center justify-center rounded-[8px] text-p2-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              size === "mobile" ? "h-12" : "h-9",
              selected
                ? "bg-[var(--calendar-selected-bg)] text-[var(--calendar-selected-fg)]"
                : "text-[var(--calendar-fg)] hover:bg-[var(--calendar-range-bg)]",
              !selected && currentYear === year && "text-[var(--calendar-accent-fg)]"
            )}
          >
            {year}
          </button>
        )
      })}
    </div>
  )
}

// Figma models both footer actions as `ELK / button` instances (node
// 32:9064), so they render the real Button rather than a look-alike — that
// is where the white/#252628/#EFEFEF-hover tokens come from. Two caveats
// drive the overrides below:
//   * radius — the buttons sit flush against the card's own rounded,
//     overflow-hidden shell (same flush-row pattern as Dropdown/DropdownItem),
//     so their hover fill must run edge-to-edge with no radius of its own;
//   * sizing — the calendar picks its footer form from the `compact` prop,
//     not from a breakpoint, so Button's `md:` half of the `lg` variant has
//     to be pinned to the same value as the base or a mobile sheet viewed at
//     ≥768px would silently grow to the desktop 56px/32px/16px form.
// Desktop = 56px tall, 32px sides, P1 Medium 16/24 (node 7415:58522);
// mobile = 48px tall, 24px sides, P1 Medium Mobile 14/20 (node 7415:58832).
const FOOTER_BUTTON_CLASS = "flex-1 rounded-none"
const FOOTER_REGULAR = "h-14 px-8 text-p1-medium md:h-14 md:px-8 md:text-p1-medium"
const FOOTER_COMPACT = "h-12 px-6 text-p2-medium md:h-12 md:px-6 md:text-p2-medium"

export function CalendarFooter({
  compact,
  onReset,
  onApply,
}: {
  /** Mobile sheet uses the M-size button footer (48px); desktop popover
   * uses L (56px) — the two layouts are chosen explicitly by the caller via
   * `layout`, not by a CSS breakpoint, so this is a prop, not a `md:` class. */
  compact?: boolean
  onReset?: () => void
  onApply?: () => void
}) {
  return (
    <div
      className={cn(
        "flex border-t border-[var(--calendar-divider)]",
        compact ? "h-12" : "h-14"
      )}
    >
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onReset}
        className={cn(FOOTER_BUTTON_CLASS, compact ? FOOTER_COMPACT : FOOTER_REGULAR)}
      >
        Сбросить
      </Button>
      <Divider orientation="vertical" />
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onApply}
        className={cn(FOOTER_BUTTON_CLASS, compact ? FOOTER_COMPACT : FOOTER_REGULAR)}
      >
        Применить
      </Button>
    </div>
  )
}
