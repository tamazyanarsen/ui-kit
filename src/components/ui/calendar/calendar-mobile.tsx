import * as React from "react"

import { cn } from "@/lib/utils"
import { Scrollbar } from "@/components/ui/scrollbar"

import { CalendarFooter } from "./footer"
import { SheetHeader, SheetNav } from "./mobile-chrome"
import {
  SheetDecadeSections,
  SheetMonthSections,
  SheetYearSections,
} from "./mobile-sections"
import { HeaderLabel, NavHeader } from "./nav-header"
import { YearGrid } from "./picker-grid"
import type { CalendarMode, CalendarSingleMonth } from "./types"
import { useInfiniteCount } from "./use-infinite-count"

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

function CalendarMobile({
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

  function openJumpPicker() {
    setJumpDecadeEnd(focus.year)
    setJumpOpen(true)
  }

  function handleJumpToYear(year: number) {
    setFocus((current) => ({ ...current, year }))
    setJumpOpen(false)
    monthsInfinite.reset()
    yearsInfinite.reset()
    sheetScrollRef.current?.scrollTo({ top: 0 })
  }

  function shiftDecade(step: number) {
    setDecadeEnd((year) => year + step)
    decadesInfinite.reset()
  }

  // The header nav and the scrollable body below it each switch between
  // three entirely different states (jump-to-year picker / year mode /
  // month|day mode) — early returns instead of a nested ternary chain, one
  // state per branch.
  function renderHeaderNav() {
    if (jumpOpen) {
      return (
        <NavHeader
          onPrev={() => setJumpDecadeEnd((year) => year - 12)}
          onNext={() => setJumpDecadeEnd((year) => year + 12)}
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
          onPrev={() => shiftDecade(-12)}
          onNext={() => shiftDecade(12)}
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
            onSelectMonth={(year, month) => onMonthChange?.({ year, month })}
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
            onSelectYear={(year) => onYearChange?.(year)}
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
        "flex h-full w-full flex-col overflow-hidden bg-white shadow-universal",
        className
      )}
    >
      <SheetHeader title={title} onClose={onClose} />
      {renderHeaderNav()}
      {/* Figma's real mobile mock stacks repeated month sections with a
          24px gap ("Calendar" wrapper, gap-[24px]) — applied uniformly to
          the month/year/decade lists here. */}
      <Scrollbar ref={sheetScrollRef} className="flex flex-1 flex-col gap-6">
        {renderSheetBody()}
      </Scrollbar>
      {footer && <CalendarFooter compact onReset={onReset} onApply={onApply} />}
    </div>
  )
}

export { CalendarMobile }
