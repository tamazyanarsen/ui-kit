import * as React from "react"
import { ChevronLeft, ChevronRight } from "@/icons"

import { cn } from "@/lib/utils"
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
}

export function NavHeader({ onPrev, onNext, children }: NavHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <button
        type="button"
        aria-label="Назад"
        onClick={onPrev}
        className="flex size-8 items-center justify-center rounded-full text-[var(--calendar-fg)] outline-none hover:bg-[var(--calendar-range-bg)] focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ChevronLeft className="size-4" />
      </button>
      <div className="flex items-center gap-1 text-sm font-medium text-[var(--calendar-fg)]">
        {children}
      </div>
      <button
        type="button"
        aria-label="Вперёд"
        onClick={onNext}
        className="flex size-8 items-center justify-center rounded-full text-[var(--calendar-fg)] outline-none hover:bg-[var(--calendar-range-bg)] focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ChevronRight className="size-4" />
      </button>
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
    return <span className="rounded-lg px-2 py-1">{children}</span>
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-2 py-1 outline-none hover:bg-[var(--calendar-range-bg)] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {children}
    </button>
  )
}

export function WeekdaysRow() {
  return (
    <div className="flex px-4 pt-4 pb-1">
      {WEEKDAYS_RU.map((d) => (
        <span
          key={d}
          className="flex h-8 w-9 items-center justify-center text-xs text-[var(--calendar-muted-fg)]"
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
  onSelectDay: (date: Date) => void
}

export function DayGrid({
  year,
  month,
  today,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  onSelectDay,
}: DayGridProps) {
  const weeks = getMonthMatrix(year, month)

  return (
    <div className="flex flex-col gap-2 px-4 pb-4">
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
              onSelectDay={onSelectDay}
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
  onSelectDay,
}: {
  cell: DayCell | null
} & Omit<DayGridProps, "year" | "month">) {
  if (!cell) return <span className="h-8 w-9 shrink-0" />

  const selected = isSelected(cell.date)
  const rangeStart = isRangeStart?.(cell.date) ?? false
  const rangeEnd = isRangeEnd?.(cell.date) ?? false
  const rangeMiddle = isRangeMiddle?.(cell.date) ?? false
  const isToday = isSameDay(cell.date, today)
  const inRangeEdge = rangeStart || rangeEnd

  return (
    <span
      className={cn(
        "flex h-8 w-9 shrink-0 items-center justify-center",
        rangeMiddle && "bg-[var(--calendar-range-bg)]",
        rangeStart && "rounded-l-lg bg-[var(--calendar-range-bg)]",
        rangeEnd && "rounded-r-lg bg-[var(--calendar-range-bg)]"
      )}
    >
      <button
        type="button"
        onClick={() => onSelectDay(cell.date)}
        className={cn(
          "z-10 flex size-8 shrink-0 items-center justify-center rounded-lg text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          selected || inRangeEdge
            ? "bg-[var(--calendar-selected-bg)] text-[var(--calendar-selected-fg)]"
            : "text-[var(--calendar-fg)] hover:bg-[var(--calendar-range-bg)]",
          !selected && !inRangeEdge && isToday && "text-[var(--calendar-accent-fg)]"
        )}
      >
        {cell.day}
      </button>
    </span>
  )
}

export function MonthGrid({
  selectedMonth,
  currentMonth,
  onSelectMonth,
}: {
  selectedMonth: number | null
  currentMonth: number | null
  onSelectMonth: (month: number) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2 px-4 pb-4">
      {MONTHS_RU_SHORT.map((label, i) => {
        const selected = selectedMonth === i
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelectMonth(i)}
            className={cn(
              "flex h-12 items-center justify-center rounded-lg text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
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
}: {
  decadeEnd: number
  selectedYear: number | null
  currentYear: number
  onSelectYear: (year: number) => void
}) {
  const years = getDecadeYears(decadeEnd)
  return (
    <div className="grid grid-cols-3 gap-2 px-4 pb-4">
      {years.map((year) => {
        const selected = selectedYear === year
        return (
          <button
            key={year}
            type="button"
            onClick={() => onSelectYear(year)}
            className={cn(
              "flex h-9 items-center justify-center rounded-lg text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
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

export function CalendarFooter({
  onReset,
  onApply,
}: {
  onReset?: () => void
  onApply?: () => void
}) {
  return (
    <div className="flex h-14 border-t border-[var(--calendar-divider)]">
      <button
        type="button"
        onClick={onReset}
        className="flex flex-1 items-center justify-center px-3 text-sm font-medium text-[var(--calendar-fg)] outline-none hover:bg-[var(--calendar-range-bg)] focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Сбросить
      </button>
      <div className="w-px bg-[var(--calendar-divider)]" />
      <button
        type="button"
        onClick={onApply}
        className="flex flex-1 items-center justify-center px-3 text-sm font-medium text-[var(--calendar-fg)] outline-none hover:bg-[var(--calendar-range-bg)] focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Применить
      </button>
    </div>
  )
}
