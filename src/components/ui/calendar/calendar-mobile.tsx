import * as React from "react"
import { ChevronLeft, X } from "@/icons"

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
      <h2 className="text-lg leading-6 font-medium text-[var(--calendar-fg)]">
        {title}
      </h2>
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--calendar-range-bg)] text-[var(--calendar-fg)] outline-none hover:bg-[var(--btn-secondary-grey-bg-hover)] focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

// Figma's "Subtitle" nav row: same gap-8 as coded (gap-2), but pb-8 (pb-2),
// not pb-3 — measured off the same real bottom-sheet mock as SheetHeader.
function SheetNav({ label, onBack }: { label: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-2">
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
    <h3 className="px-4 pt-[22px] pb-4 text-[22px] leading-[30px] font-medium text-[var(--calendar-fg)]">
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
  disabledDate,
}: {
  mode: CalendarMode
  anchor: CalendarSingleMonth
  count: number
  today: Date
  value: Date | null
  normStart: Date | null
  normEnd: Date | null
  onSelectDay: (date: Date) => void
  disabledDate?: (date: Date) => boolean
}) {
  const sections = Array.from({ length: count }, (_, i) =>
    addMonths(anchor.year, anchor.month, i - 1)
  )
  return (
    <>
      {sections.map((m, i) => (
        <div key={i}>
          <MonthPillHeading>{MONTHS_RU_FULL[m.month]}</MonthPillHeading>
          <WeekdaysRow size="mobile" />
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
            isDisabled={disabledDate}
            size="mobile"
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
            size="mobile"
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
            size="mobile"
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
  disabledDate?: (date: Date) => boolean
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
  disabledDate,
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
          variant="picker"
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
          variant="picker"
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
          size="mobile"
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
          disabledDate={disabledDate}
        />
        <div ref={monthsInfinite.sentinelRef} className="h-px" />
      </>
    )
  }

  return (
    // Figma: "Календарь открывается в Bottom Sheet на весь экран, без
    // скруглений" — full-screen, no rounded corners. This component renders
    // only its own content (per CalendarProps.layout's doc comment); the
    // page hosts it inside its actual bottom-sheet/modal primitive, so here
    // that just means no radius and no max-width cap of its own.
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_4px_12px_rgba(139,153,169,0.24)]",
        className
      )}
    >
      <SheetHeader title={title} onClose={onClose} />
      {renderHeaderNav()}
      {/* Figma's real mobile mock stacks repeated month sections with a
          24px gap ("Calendar" wrapper, gap-[24px]) — applied uniformly to
          the month/year/decade lists here. */}
      <div
        ref={sheetScrollRef}
        className="flex flex-1 flex-col gap-6 overflow-y-auto"
      >
        {renderSheetBody()}
      </div>
      {footer && <CalendarFooter compact onReset={onReset} onApply={onApply} />}
    </div>
  )
}
