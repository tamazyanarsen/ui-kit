import { MONTHS_RU_FULL, addMonths, isInRange, isSameDay } from "@/lib/calendar"

import { DayGrid, WeekdaysRow } from "./day-grid"
import { MonthPillHeading, SectionHeading } from "./mobile-chrome"
import { MonthGrid, YearGrid } from "./picker-grid"
import type { CalendarMode, CalendarSingleMonth } from "./types"

// Повторяющиеся секции бесконечной прокрутки мобильного листа: месяцы (дни),
// годы (месяцы) и десятилетия (годы). Сколько секций показать, решает
// `useInfiniteCount` у вызывающей стороны — здесь только их отрисовка.

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
  // Первая секция — предыдущий месяц: прокрутка вверх должна упираться не в
  // текущий месяц, а на шаг раньше.
  const sections = Array.from({ length: count }, (_, index) =>
    addMonths(anchor.year, anchor.month, index - 1)
  )
  const isRange = mode === "range"

  return (
    <>
      {sections.map((section, index) => (
        <div key={index}>
          <MonthPillHeading>{MONTHS_RU_FULL[section.month]}</MonthPillHeading>
          <WeekdaysRow size="mobile" />
          <DayGrid
            year={section.year}
            month={section.month}
            today={today}
            isSelected={
              mode === "single" ? (date) => isSameDay(date, value) : () => false
            }
            isRangeStart={
              isRange ? (date) => isSameDay(date, normStart) : undefined
            }
            isRangeEnd={isRange ? (date) => isSameDay(date, normEnd) : undefined}
            isRangeMiddle={
              isRange ? (date) => isInRange(date, normStart, normEnd) : undefined
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
  const years = Array.from({ length: count }, (_, index) => anchorYear - 1 + index)

  return (
    <>
      {years.map((year) => (
        <div key={year}>
          <SectionHeading>{year}</SectionHeading>
          <MonthGrid
            selectedMonth={monthValue?.year === year ? monthValue.month : null}
            currentMonth={year === today.getFullYear() ? today.getMonth() : null}
            onSelectMonth={(month) => onSelectMonth(year, month)}
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
    (_, index) => anchorDecadeEnd + index * 12
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

export { SheetDecadeSections, SheetMonthSections, SheetYearSections }
