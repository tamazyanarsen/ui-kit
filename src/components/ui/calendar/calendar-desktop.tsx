import { cn } from "@/lib/utils"
import { MONTHS_RU_FULL, addMonths, isInRange, isSameDay } from "@/lib/calendar"
import { CalendarFooter } from "./footer"
import { DayGrid, WeekdaysRow } from "./day-grid"
import { HeaderLabel, NavHeader } from "./nav-header"
import { MonthGrid, YearGrid } from "./picker-grid"
import type { CalendarMode, CalendarSingleMonth, CalendarView } from "./types"

interface CalendarDesktopProps {
  mode: CalendarMode
  className?: string
  footer: boolean
  onReset?: () => void
  onApply?: () => void

  view: CalendarView
  setView: (view: CalendarView) => void
  focus: CalendarSingleMonth
  today: Date
  decadeEnd: number

  value: Date | null
  monthValue?: { year: number; month: number } | null
  yearValue?: number | null
  normStart: Date | null
  normEnd: Date | null

  goPrev: () => void
  goNext: () => void
  onSelectDay: (date: Date) => void
  onSelectMonth: (month: number) => void
  onSelectYear: (year: number) => void
  disabledDate?: (date: Date) => boolean
}

export function CalendarDesktop({
  mode,
  className,
  footer,
  onReset,
  onApply,
  view,
  setView,
  focus,
  today,
  decadeEnd,
  value,
  monthValue,
  yearValue,
  normStart,
  normEnd,
  goPrev,
  goNext,
  onSelectDay,
  onSelectMonth,
  onSelectYear,
  disabledDate,
}: CalendarDesktopProps) {
  const monthCardIsSelected =
    mode === "single" ? (d: Date) => isSameDay(d, value) : () => false

  return (
    // Design-check #11/#12: min 280px per the Figma component — w-fit alone
    // let the Month/Year picker views (just a 3-column grid of short labels)
    // shrink well under that.
    <div
      className={cn(
        "w-fit min-w-[280px] overflow-hidden rounded-[16px] bg-white shadow-universal",
        className
      )}
    >
      {mode === "range" ? (
        <RangeBody
          focus={focus}
          today={today}
          normStart={normStart}
          normEnd={normEnd}
          onSelectDay={onSelectDay}
          onPrev={goPrev}
          onNext={goNext}
          disabledDate={disabledDate}
        />
      ) : view === "months" ? (
        <MonthsBody
          mode={mode}
          focus={focus}
          today={today}
          value={value}
          monthValue={monthValue}
          onPrev={goPrev}
          onNext={goNext}
          onSelectMonth={onSelectMonth}
        />
      ) : view === "years" ? (
        <YearsBody
          mode={mode}
          decadeEnd={decadeEnd}
          today={today}
          value={value}
          yearValue={yearValue}
          onPrev={goPrev}
          onNext={goNext}
          onSelectYear={onSelectYear}
        />
      ) : (
        <DaysBody
          focus={focus}
          today={today}
          isSelected={monthCardIsSelected}
          setView={setView}
          onPrev={goPrev}
          onNext={goNext}
          onSelectDay={onSelectDay}
          disabledDate={disabledDate}
        />
      )}
      {footer && <CalendarFooter onReset={onReset} onApply={onApply} />}
    </div>
  )
}

function MonthsBody({
  mode,
  focus,
  today,
  value,
  monthValue,
  onPrev,
  onNext,
  onSelectMonth,
}: {
  mode: CalendarMode
  focus: CalendarSingleMonth
  today: Date
  value: Date | null
  monthValue?: { year: number; month: number } | null
  onPrev: () => void
  onNext: () => void
  onSelectMonth: (month: number) => void
}) {
  const selectedMonth =
    mode === "month"
      ? monthValue?.year === focus.year
        ? monthValue.month
        : null
      : value && value.getFullYear() === focus.year
        ? value.getMonth()
        : null
  const currentMonth = focus.year === today.getFullYear() ? today.getMonth() : null

  return (
    <>
      <NavHeader onPrev={onPrev} onNext={onNext} variant="picker">
        <HeaderLabel>{focus.year}</HeaderLabel>
      </NavHeader>
      <MonthGrid
        selectedMonth={selectedMonth}
        currentMonth={currentMonth}
        onSelectMonth={onSelectMonth}
      />
    </>
  )
}

function YearsBody({
  mode,
  decadeEnd,
  today,
  value,
  yearValue,
  onPrev,
  onNext,
  onSelectYear,
}: {
  mode: CalendarMode
  decadeEnd: number
  today: Date
  value: Date | null
  yearValue?: number | null
  onPrev: () => void
  onNext: () => void
  onSelectYear: (year: number) => void
}) {
  const selectedYear = mode === "year" ? (yearValue ?? null) : (value?.getFullYear() ?? null)

  return (
    <>
      <NavHeader onPrev={onPrev} onNext={onNext} variant="picker">
        <HeaderLabel>
          {decadeEnd - 11} — {decadeEnd}
        </HeaderLabel>
      </NavHeader>
      <YearGrid
        decadeEnd={decadeEnd}
        selectedYear={selectedYear}
        currentYear={today.getFullYear()}
        onSelectYear={onSelectYear}
      />
    </>
  )
}

function DaysBody({
  focus,
  today,
  isSelected,
  setView,
  onPrev,
  onNext,
  onSelectDay,
  disabledDate,
}: {
  focus: CalendarSingleMonth
  today: Date
  isSelected: (date: Date) => boolean
  setView: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onSelectDay: (date: Date) => void
  disabledDate?: (date: Date) => boolean
}) {
  return (
    <>
      <NavHeader onPrev={onPrev} onNext={onNext}>
        <HeaderLabel onClick={() => setView("months")}>
          {MONTHS_RU_FULL[focus.month]}
        </HeaderLabel>
        <HeaderLabel onClick={() => setView("years")}>{focus.year}</HeaderLabel>
      </NavHeader>
      <WeekdaysRow />
      <DayGrid
        year={focus.year}
        month={focus.month}
        today={today}
        isSelected={isSelected}
        onSelectDay={onSelectDay}
        isDisabled={disabledDate}
      />
    </>
  )
}

function RangeBody({
  focus,
  today,
  normStart,
  normEnd,
  onSelectDay,
  onPrev,
  onNext,
  disabledDate,
}: {
  focus: CalendarSingleMonth
  today: Date
  normStart: Date | null
  normEnd: Date | null
  onSelectDay: (date: Date) => void
  onPrev: () => void
  onNext: () => void
  disabledDate?: (date: Date) => boolean
}) {
  const next = addMonths(focus.year, focus.month, 1)
  const months = [focus, next]

  return (
    // Design-check #10: no vertical divider between the two month grids —
    // ui/calendar/calendar@2x-1.png's own Range anatomy runs them together.
    <div className="flex">
      {months.map((m, i) => (
        <div key={i}>
          <NavHeader onPrev={onPrev} onNext={onNext}>
            <HeaderLabel>{MONTHS_RU_FULL[m.month]}</HeaderLabel>
            <HeaderLabel>{m.year}</HeaderLabel>
          </NavHeader>
          <WeekdaysRow />
          <DayGrid
            year={m.year}
            month={m.month}
            today={today}
            isSelected={() => false}
            isRangeStart={(d) => isSameDay(d, normStart)}
            isRangeEnd={(d) => isSameDay(d, normEnd)}
            isRangeMiddle={(d) => isInRange(d, normStart, normEnd)}
            onSelectDay={onSelectDay}
            isDisabled={disabledDate}
          />
        </div>
      ))}
    </div>
  )
}
