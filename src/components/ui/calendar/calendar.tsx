import * as React from "react"

import { addMonths, normalizeRange } from "@/lib/calendar"
import { CalendarDesktop } from "./calendar-desktop"
import { CalendarMobile } from "./calendar-mobile"
import type { CalendarProps, CalendarSingleMonth, CalendarView } from "./types"

// Конец окна из 12 лет. Обычно окно доходит до текущего года (свежие годы
// под рукой), но выбранный год обязан в него попасть: при 1990 окно
// 2015–2026 открывалось без выбора, и найти его можно было только листанием.
function decadeEndFor(year: number, currentYear: number) {
  return year > currentYear - 12 ? Math.max(year, currentYear) : year
}

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
  // Открывается на выбранном значении в любом режиме: раньше `monthValue` и
  // `yearValue` не учитывались, и сетка месяцев или лет открывалась на
  // текущем годе без подсвеченного выбора.
  const initial =
    defaultMonth ??
    value ??
    (mode === "month" && monthValue
      ? new Date(monthValue.year, monthValue.month, 1)
      : mode === "year" && yearValue != null
        ? new Date(yearValue, 0, 1)
        : today)
  const [view, setView] = React.useState<CalendarView>(
    mode === "month" ? "months" : mode === "year" ? "years" : "days"
  )
  const [focus, setFocus] = React.useState<CalendarSingleMonth>({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  })
  const [decadeEnd, setDecadeEnd] = React.useState(() =>
    decadeEndFor(initial.getFullYear(), today.getFullYear())
  )

  // Выбор дня и диапазона остаётся локальным черновиком, пока «Применить»
  // не подтвердит его через onChange или onRangeChange: клик по дате
  // обновляет только подсветку в сетке. Это соответствует формулировкам
  // самого подвала («Сбросить» очищает черновик, «Применить» подтверждает
  // его; ни то, ни другое не должно происходить просто от клика по дню).
  // Пересинхронизируется всякий раз, когда *подтверждённое* значение
  // меняется снаружи (например, родитель его сбросил или поповер
  // переоткрылся с новым значением). Без подвала подтверждать нечем, и в
  // этом случае поведение откатывается к немедленному вызову onChange или
  // onRangeChange на каждый клик, как было раньше.
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
    if (mode === "single") {
      // «Сбросить» → «Применить» — это подтверждённый сброс: родитель
      // должен о нём узнать и без `onReset`.
      if (draftValue) onChange?.(draftValue)
      else if (value) onChange?.(null)
    } else if (mode === "range") onRangeChange?.(draftRange)
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
    // переход вглубь из вида одного дня
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
