import { cn } from "@/lib/utils"
import { MONTHS_RU_FULL, addMonths, isInRange, isSameDay } from "@/lib/calendar"
import { CalendarFooter } from "./footer"
import { DayGrid, WeekdaysRow } from "./day-grid"
import { HeaderLabel, NavHeader } from "./nav-header"
import { MonthGrid, YearGrid } from "./picker-grid"
import type { CalendarMode, CalendarSingleMonth, CalendarView } from "./types"
import { useDayFocus } from "./use-day-focus"

interface CalendarDesktopProps {
  mode: CalendarMode
  className?: string
  footer: boolean
  showSecondaryButton?: boolean
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
  /** Сдвиг показанных месяцев с клавиатуры сетки дней (PageUp, стрелки). */
  shiftMonths: (delta: number) => void
  onSelectDay: (date: Date) => void
  onSelectMonth: (month: number) => void
  onSelectYear: (year: number) => void
  disabledDate?: (date: Date) => boolean
}

export function CalendarDesktop({
  mode,
  className,
  footer,
  showSecondaryButton = true,
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
  shiftMonths,
  onSelectDay,
  onSelectMonth,
  onSelectYear,
  disabledDate,
}: CalendarDesktopProps) {
  const monthCardIsSelected =
    mode === "single" ? (d: Date) => isSameDay(d, value) : () => false

  return (
    // Дизайн-чек, замечания 11 и 12: минимум 280px по компоненту макета —
    // один лишь w-fit позволял видам выбора месяца и года (а это просто
    // сетка из трёх колонок с короткими подписями) ужиматься заметно
    // меньше.
    <div
      data-slot="calendar"
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
          shiftMonths={shiftMonths}
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
          selected={mode === "single" ? value : null}
          isSelected={monthCardIsSelected}
          setView={setView}
          onPrev={goPrev}
          onNext={goNext}
          shiftMonths={shiftMonths}
          onSelectDay={onSelectDay}
          disabledDate={disabledDate}
        />
      )}
      {footer && (
        <CalendarFooter
          showSecondary={showSecondaryButton}
          onReset={onReset}
          onApply={onApply}
        />
      )}
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
  selected,
  isSelected,
  setView,
  onPrev,
  onNext,
  shiftMonths,
  onSelectDay,
  disabledDate,
}: {
  focus: CalendarSingleMonth
  today: Date
  selected: Date | null
  isSelected: (date: Date) => boolean
  setView: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  shiftMonths: (delta: number) => void
  onSelectDay: (date: Date) => void
  disabledDate?: (date: Date) => boolean
}) {
  const dayFocus = useDayFocus({
    months: [focus],
    preferred: [selected],
    today,
    isDisabled: disabledDate,
    onShiftMonths: shiftMonths,
  })

  return (
    <>
      <NavHeader onPrev={onPrev} onNext={onNext}>
        <HeaderLabel onClick={() => setView("months")}>
          {MONTHS_RU_FULL[focus.month]}
        </HeaderLabel>
        <HeaderLabel onClick={() => setView("years")}>{focus.year}</HeaderLabel>
      </NavHeader>
      {/* Обёртка — граница поиска дня для фокуса с клавиатуры: на странице
          бывает несколько календарей с одними и теми же датами. */}
      <div ref={dayFocus.containerRef}>
        <WeekdaysRow />
        <DayGrid
          year={focus.year}
          month={focus.month}
          today={today}
          isSelected={isSelected}
          onSelectDay={onSelectDay}
          isDisabled={disabledDate}
          {...dayFocus.gridProps}
        />
      </div>
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
  shiftMonths,
  disabledDate,
}: {
  focus: CalendarSingleMonth
  today: Date
  normStart: Date | null
  normEnd: Date | null
  onSelectDay: (date: Date) => void
  onPrev: () => void
  onNext: () => void
  shiftMonths: (delta: number) => void
  disabledDate?: (date: Date) => boolean
}) {
  const next = addMonths(focus.year, focus.month, 1)
  const months = [focus, next]
  // Одна остановка Tab на обе сетки: стрелка с конца первого месяца
  // переходит во второй, а не в соседнюю сетку по Tab.
  const dayFocus = useDayFocus({
    months,
    preferred: [normStart, normEnd],
    today,
    isDisabled: disabledDate,
    onShiftMonths: shiftMonths,
  })

  return (
    // Дизайн-чек, замечание 10: вертикального разделителя между двумя
    // сетками месяцев нет — в собственной анатомии Range в макете они идут
    // вплотную.
    <div ref={dayFocus.containerRef} className="flex">
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
            {...dayFocus.gridProps}
          />
        </div>
      ))}
    </div>
  )
}
