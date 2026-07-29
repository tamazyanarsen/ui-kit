import * as React from "react"
import { ChevronLeft, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { MONTHS_RU_FULL, addMonths, isInRange, isSameDay } from "@/lib/calendar"
import {
  CalendarFooter,
  DayGrid,
  HeaderLabel,
  MonthGrid,
  NavHeader,
  WeekdaysRow,
  YearGrid,
} from "./primitives"
import { useInfiniteCount } from "./use-infinite-count"
import type { CalendarMode, CalendarSingleMonth } from "./types"

function SheetHeader({
  title,
  onClose,
}: {
  title: string
  onClose?: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <h2 className="text-base font-semibold text-[var(--calendar-fg)]">
        {title}
      </h2>
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="flex size-8 items-center justify-center rounded-full bg-[var(--calendar-range-bg)] text-[var(--calendar-fg)] outline-none hover:bg-[var(--btn-secondary-grey-bg-hover)] focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

function SheetNav({ label, onBack }: { label: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      {onBack && (
        <button
          type="button"
          aria-label="Назад"
          onClick={onBack}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[var(--calendar-fg)] outline-none hover:bg-[var(--calendar-range-bg)] focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      <span className="text-sm text-[var(--calendar-fg)]">{label}</span>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-4 pt-4 pb-1 text-lg font-semibold text-[var(--calendar-fg)]">
      {children}
    </h3>
  )
}

function SheetMonthSections({
  mode,
  anchor,
  count,
  today,
  value,
  normStart,
  normEnd,
  onSelectDay,
}: {
  mode: CalendarMode
  anchor: CalendarSingleMonth
  count: number
  today: Date
  value: Date | null
  normStart: Date | null
  normEnd: Date | null
  onSelectDay: (date: Date) => void
}) {
  const sections = Array.from({ length: count }, (_, i) =>
    addMonths(anchor.year, anchor.month, i - 1)
  )
  return (
    <>
      {sections.map((m, i) => (
        <div key={i}>
          <SectionHeading>{MONTHS_RU_FULL[m.month]}</SectionHeading>
          <WeekdaysRow />
          <DayGrid
            year={m.year}
            month={m.month}
            today={today}
            isSelected={mode === "single" ? (d) => isSameDay(d, value) : () => false}
            isRangeStart={
              mode === "range" ? (d) => isSameDay(d, normStart) : undefined
            }
            isRangeEnd={
              mode === "range" ? (d) => isSameDay(d, normEnd) : undefined
            }
            isRangeMiddle={
              mode === "range" ? (d) => isInRange(d, normStart, normEnd) : undefined
            }
            onSelectDay={onSelectDay}
          />
        </div>
      ))}
    </>
  )
}

function SheetYearSections({
  anchorYear,
  count,
  today,
  monthValue,
  onSelectMonth,
}: {
  anchorYear: number
  count: number
  today: Date
  monthValue: { year: number; month: number } | null | undefined
  onSelectMonth: (year: number, month: number) => void
}) {
  const years = Array.from({ length: count }, (_, i) => anchorYear - 1 + i)
  return (
    <>
      {years.map((y) => (
        <div key={y}>
          <SectionHeading>{y}</SectionHeading>
          <MonthGrid
            selectedMonth={monthValue?.year === y ? monthValue.month : null}
            currentMonth={y === today.getFullYear() ? today.getMonth() : null}
            onSelectMonth={(m) => onSelectMonth(y, m)}
          />
        </div>
      ))}
    </>
  )
}

function SheetDecadeSections({
  anchorDecadeEnd,
  count,
  today,
  yearValue,
  onSelectYear,
}: {
  anchorDecadeEnd: number
  count: number
  today: Date
  yearValue: number | null
  onSelectYear: (year: number) => void
}) {
  const decadeEnds = Array.from(
    { length: count },
    (_, i) => anchorDecadeEnd + i * 12
  )
  return (
    <>
      {decadeEnds.map((end) => (
        <div key={end}>
          <SectionHeading>
            {end - 11} — {end}
          </SectionHeading>
          <YearGrid
            decadeEnd={end}
            selectedYear={yearValue}
            currentYear={today.getFullYear()}
            onSelectYear={onSelectYear}
          />
        </div>
      ))}
    </>
  )
}

interface CalendarMobileProps {
  mode: CalendarMode
  title: string
  onClose?: () => void
  className?: string
  footer: boolean
  onReset?: () => void
  onApply?: () => void

  today: Date
  focus: CalendarSingleMonth
  setFocus: React.Dispatch<React.SetStateAction<CalendarSingleMonth>>
  decadeEnd: number
  setDecadeEnd: React.Dispatch<React.SetStateAction<number>>

  value: Date | null
  normStart: Date | null
  normEnd: Date | null
  monthValue?: { year: number; month: number } | null
  onMonthChange?: (value: { year: number; month: number }) => void
  yearValue?: number | null
  onYearChange?: (year: number) => void
  onSelectDay: (date: Date) => void
}

export function CalendarMobile({
  mode,
  title,
  onClose,
  className,
  footer,
  onReset,
  onApply,
  today,
  focus,
  setFocus,
  decadeEnd,
  setDecadeEnd,
  value,
  normStart,
  normEnd,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
  onSelectDay,
}: CalendarMobileProps) {
  // Infinite-forward scroll + a jump-to-year picker reached by tapping the
  // nav label, instead of a one-way "back 12" button that could strand you
  // with no way back to today. Sheet-only — the popover paginates instead.
  const sheetScrollRef = React.useRef<HTMLDivElement>(null)
  const monthsInfinite = useInfiniteCount(sheetScrollRef, 6, 6)
  const yearsInfinite = useInfiniteCount(sheetScrollRef, 3, 3)
  const decadesInfinite = useInfiniteCount(sheetScrollRef, 2, 2)
  const [jumpOpen, setJumpOpen] = React.useState(false)
  const [jumpDecadeEnd, setJumpDecadeEnd] = React.useState(decadeEnd)

  function resetSheetScroll() {
    monthsInfinite.reset()
    yearsInfinite.reset()
    sheetScrollRef.current?.scrollTo({ top: 0 })
  }

  function openJumpPicker() {
    setJumpDecadeEnd(focus.year)
    setJumpOpen(true)
  }

  function handleJumpToYear(y: number) {
    setFocus((f) => ({ ...f, year: y }))
    setJumpOpen(false)
    resetSheetScroll()
  }

  // The header nav and the scrollable body below it each switch between
  // three entirely different states (jump-to-year picker / year mode /
  // month|day mode) — early returns instead of a nested ternary chain, one
  // state per branch.
  function renderHeaderNav() {
    if (jumpOpen) {
      return (
        <NavHeader
          onPrev={() => setJumpDecadeEnd((y) => y - 12)}
          onNext={() => setJumpDecadeEnd((y) => y + 12)}
        >
          <HeaderLabel>
            {jumpDecadeEnd - 11} — {jumpDecadeEnd}
          </HeaderLabel>
        </NavHeader>
      )
    }
    if (mode === "year") {
      return (
        <NavHeader
          onPrev={() => {
            setDecadeEnd((y) => y - 12)
            decadesInfinite.reset()
          }}
          onNext={() => {
            setDecadeEnd((y) => y + 12)
            decadesInfinite.reset()
          }}
        >
          <HeaderLabel>
            {decadeEnd - 11} — {decadeEnd}
          </HeaderLabel>
        </NavHeader>
      )
    }
    return (
      <SheetNav
        label={
          mode === "month"
            ? `${focus.year - 11} — ${focus.year}`
            : String(focus.year)
        }
        onBack={openJumpPicker}
      />
    )
  }

  function renderSheetBody() {
    if (jumpOpen) {
      return (
        <YearGrid
          decadeEnd={jumpDecadeEnd}
          selectedYear={focus.year}
          currentYear={today.getFullYear()}
          onSelectYear={handleJumpToYear}
        />
      )
    }
    if (mode === "month") {
      return (
        <>
          <SheetYearSections
            anchorYear={focus.year}
            count={yearsInfinite.count}
            today={today}
            monthValue={monthValue}
            onSelectMonth={(year, m) => onMonthChange?.({ year, month: m })}
          />
          <div ref={yearsInfinite.sentinelRef} className="h-px" />
        </>
      )
    }
    if (mode === "year") {
      return (
        <>
          <SheetDecadeSections
            anchorDecadeEnd={decadeEnd}
            count={decadesInfinite.count}
            today={today}
            yearValue={yearValue ?? null}
            onSelectYear={(y) => onYearChange?.(y)}
          />
          <div ref={decadesInfinite.sentinelRef} className="h-px" />
        </>
      )
    }
    return (
      <>
        <SheetMonthSections
          mode={mode}
          anchor={focus}
          count={monthsInfinite.count}
          today={today}
          value={value}
          normStart={normStart}
          normEnd={normEnd}
          onSelectDay={onSelectDay}
        />
        <div ref={monthsInfinite.sentinelRef} className="h-px" />
      </>
    )
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-foreground/10",
        className
      )}
    >
      <SheetHeader title={title} onClose={onClose} />
      {renderHeaderNav()}
      <div ref={sheetScrollRef} className="max-h-[60vh] overflow-y-auto">
        {renderSheetBody()}
      </div>
      {footer && <CalendarFooter onReset={onReset} onApply={onApply} />}
    </div>
  )
}
