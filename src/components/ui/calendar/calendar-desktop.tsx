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
}: CalendarDesktopProps) {
  const monthCardIsSelected =
    mode === "single" ? (d: Date) => isSameDay(d, value) : () => false

  return (
    <div
      className={cn(
        "w-fit overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-foreground/10",
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
        />
      ) : view === "months" ? (
        <>
          <NavHeader onPrev={goPrev} onNext={goNext}>
            <HeaderLabel>{focus.year}</HeaderLabel>
          </NavHeader>
          <MonthGrid
            selectedMonth={
              mode === "month"
                ? monthValue?.year === focus.year
                  ? monthValue.month
                  : null
                : value && value.getFullYear() === focus.year
                  ? value.getMonth()
                  : null
            }
            currentMonth={
              focus.year === today.getFullYear() ? today.getMonth() : null
            }
            onSelectMonth={onSelectMonth}
          />
        </>
      ) : view === "years" ? (
        <>
          <NavHeader onPrev={goPrev} onNext={goNext}>
            <HeaderLabel>
              {decadeEnd - 11} — {decadeEnd}
            </HeaderLabel>
          </NavHeader>
          <YearGrid
            decadeEnd={decadeEnd}
            selectedYear={mode === "year" ? (yearValue ?? null) : (value?.getFullYear() ?? null)}
            currentYear={today.getFullYear()}
            onSelectYear={onSelectYear}
          />
        </>
      ) : (
        <>
          <NavHeader onPrev={goPrev} onNext={goNext}>
            <HeaderLabel onClick={() => setView("months")}>
              {MONTHS_RU_FULL[focus.month]}
            </HeaderLabel>
            <HeaderLabel onClick={() => setView("years")}>
              {focus.year}
            </HeaderLabel>
          </NavHeader>
          <WeekdaysRow />
          <DayGrid
            year={focus.year}
            month={focus.month}
            today={today}
            isSelected={monthCardIsSelected}
            onSelectDay={onSelectDay}
          />
        </>
      )}
      {footer && <CalendarFooter onReset={onReset} onApply={onApply} />}
    </div>
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
}: {
  focus: CalendarSingleMonth
  today: Date
  normStart: Date | null
  normEnd: Date | null
  onSelectDay: (date: Date) => void
  onPrev: () => void
  onNext: () => void
}) {
  const next = addMonths(focus.year, focus.month, 1)
  const months = [focus, next]

  return (
    <div className="flex">
      {months.map((m, i) => (
        <div key={i} className={cn(i === 0 && "border-r border-[var(--calendar-divider)]")}>
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
          />
        </div>
      ))}
    </div>
  )
}
