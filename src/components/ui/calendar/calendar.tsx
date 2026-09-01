import * as React from "react"

import { addMonths, normalizeRange } from "@/lib/calendar"
import { CalendarDesktop } from "./calendar-desktop"
import { CalendarMobile } from "./calendar-mobile"
import type { CalendarProps, CalendarSingleMonth, CalendarView } from "./types"

function Calendar({
  mode = "single",
  layout = "popover",
  title = "Выберите даты",
  onClose,
  className,
  footer = true,
  showSecondaryButton = true,
  onReset,
  onApply,
  defaultMonth,
  disabledDate,
  value = null,
  onChange,
  rangeValue,
  onRangeChange,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
}: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])
  const initial = defaultMonth ?? value ?? today
  const [view, setView] = React.useState<CalendarView>(
    mode === "month" ? "months" : mode === "year" ? "years" : "days"
  )
  const [focus, setFocus] = React.useState<CalendarSingleMonth>({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  })
  const [decadeEnd, setDecadeEnd] = React.useState(
    Math.max(initial.getFullYear(), today.getFullYear())
  )

  // Day/range selection is a local draft until "Применить" commits it via
  // onChange/onRangeChange — clicking a date only updates the grid's own
  // highlight, matching the footer's own Reset/Apply wording (Reset clears
  // the draft, Apply commits it; neither should happen just from clicking a
  // day). Re-synced whenever the *committed* value changes from outside
  // (e.g. the parent resets it, or the popover reopens with a fresh value).
  // Without a footer there's no Apply to ever commit through, so that case
  // falls back to firing onChange/onRangeChange immediately per click, same
  // as before.
  const [draftValue, setDraftValue] = React.useState<Date | null>(value)
  const [draftRange, setDraftRange] = React.useState<[Date | null, Date | null]>(
    rangeValue ?? [null, null]
  )

  React.useEffect(() => {
    setDraftValue(value)
  }, [value])

  React.useEffect(() => {
    if (rangeValue) setDraftRange(rangeValue)
  }, [rangeValue])

  const activeValue = footer ? draftValue : value
  const activeRange = footer ? draftRange : (rangeValue ?? draftRange)
  const [normStart, normEnd] = normalizeRange(activeRange[0], activeRange[1])

  function setActiveRange(next: [Date | null, Date | null]) {
    if (footer) {
      setDraftRange(next)
      return
    }
    if (!rangeValue) setDraftRange(next)
    onRangeChange?.(next)
  }

  function goPrev() {
    if (view === "days") setFocus((f) => addMonths(f.year, f.month, -1))
    else if (view === "months") setFocus((f) => ({ ...f, year: f.year - 1 }))
    else setDecadeEnd((y) => y - 12)
  }

  function goNext() {
    if (view === "days") setFocus((f) => addMonths(f.year, f.month, 1))
    else if (view === "months") setFocus((f) => ({ ...f, year: f.year + 1 }))
    else setDecadeEnd((y) => y + 12)
  }

  function handleSelectDay(date: Date) {
    if (mode === "range") {
      if (!normStart || (normStart && normEnd)) {
        setActiveRange([date, null])
      } else {
        setActiveRange(normalizeRange(normStart, date))
      }
      return
    }
    if (footer) {
      setDraftValue(date)
      return
    }
    onChange?.(date)
  }

  function handleApply() {
    if (mode === "single" && draftValue) onChange?.(draftValue)
    else if (mode === "range") onRangeChange?.(draftRange)
    onApply?.()
  }

  function handleReset() {
    setDraftValue(null)
    setDraftRange([null, null])
    onReset?.()
  }

  function handleSelectMonth(m: number) {
    if (mode === "month") {
      onMonthChange?.({ year: focus.year, month: m })
      return
    }
    // drill-down from the single day view
    setFocus((f) => ({ ...f, month: m }))
    setView("days")
  }

  function handleSelectYear(y: number) {
    if (mode === "year") {
      onYearChange?.(y)
      return
    }
    setFocus((f) => ({ ...f, year: y }))
    setDecadeEnd(y)
    setView(mode === "single" ? "months" : "days")
  }

  if (layout === "sheet") {
    return (
      <CalendarMobile
        mode={mode}
        title={title}
        onClose={onClose}
        className={className}
        footer={footer}
        showSecondaryButton={showSecondaryButton}
        onReset={handleReset}
        onApply={handleApply}
        today={today}
        focus={focus}
        setFocus={setFocus}
        decadeEnd={decadeEnd}
        setDecadeEnd={setDecadeEnd}
        value={activeValue}
        normStart={normStart}
        normEnd={normEnd}
        monthValue={monthValue}
        onMonthChange={onMonthChange}
        yearValue={yearValue}
        onYearChange={onYearChange}
        onSelectDay={handleSelectDay}
        disabledDate={disabledDate}
      />
    )
  }

  return (
    <CalendarDesktop
      mode={mode}
      className={className}
      footer={footer}
      showSecondaryButton={showSecondaryButton}
      onReset={handleReset}
      onApply={handleApply}
      view={view}
      setView={setView}
      focus={focus}
      today={today}
      decadeEnd={decadeEnd}
      value={activeValue}
      monthValue={monthValue}
      yearValue={yearValue}
      normStart={normStart}
      normEnd={normEnd}
      goPrev={goPrev}
      goNext={goNext}
      onSelectDay={handleSelectDay}
      onSelectMonth={handleSelectMonth}
      onSelectYear={handleSelectYear}
      disabledDate={disabledDate}
    />
  )
}

export { Calendar }
