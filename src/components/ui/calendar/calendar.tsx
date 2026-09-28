import * as React from "react"

import { addMonths, isSameDay, normalizeRange } from "@/lib/calendar"
import { CalendarDesktop } from "./calendar-desktop"
import { CalendarMobile } from "./calendar-mobile"
import type { CalendarProps, CalendarSingleMonth, CalendarView } from "./types"

// Конец окна из 12 лет. Обычно окно доходит до текущего года (свежие годы
// под рукой), но выбранный год обязан в него попасть: при 1990 окно
// 2015–2026 открывалось без выбора, и найти его можно было только листанием.
function decadeEndFor(year: number, currentYear: number) {
  return year > currentYear - 12 ? Math.max(year, currentYear) : year
}

/** Ключ календарного дня: два объекта Date одного дня дают один ключ. */
function dayKey(date: Date | null | undefined) {
  return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : ""
}

function viewFor(mode: CalendarProps["mode"]): CalendarView {
  return mode === "month" ? "months" : mode === "year" ? "years" : "days"
}

function monthOf(date: Date): CalendarSingleMonth {
  return { year: date.getFullYear(), month: date.getMonth() }
}

/** Первая дата диапазона: начало, а без него — конец. */
function rangeAnchor(range: [Date | null, Date | null] | undefined) {
  const [start, end] = normalizeRange(range?.[0] ?? null, range?.[1] ?? null)
  return start ?? end
}

/** Ключ диапазона: пара ключей дней. */
function rangeKeyOf(range: [Date | null, Date | null]) {
  return `${dayKey(range[0])}|${dayKey(range[1])}`
}

function sameDayOrEmpty(a: Date | null, b: Date | null) {
  return a && b ? isSameDay(a, b) : !a && !b
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
  value: valueProp,
  onChange,
  rangeValue,
  onRangeChange,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
}: CalendarProps) {
  const today = React.useMemo(() => new Date(), [])

  // Неуправляемый режим: без `value` / `monthValue` / `yearValue` календарь
  // держит выбор сам. Раньше подсветка читала только пропсы, и в режимах
  // month и year, а в single без подвала — выбранное не отмечалось вовсе
  // (клик вызывал колбэк и ничего не показывал), хотя диапазон в том же
  // неуправляемом режиме работал через свой черновик.
  const [ownValue, setOwnValue] = React.useState<Date | null>(null)
  const [ownMonth, setOwnMonth] = React.useState<CalendarSingleMonth | null>(null)
  const [ownYear, setOwnYear] = React.useState<number | null>(null)
  const value = valueProp !== undefined ? valueProp : ownValue
  const resolvedMonth = monthValue !== undefined ? monthValue : ownMonth
  const resolvedYear = yearValue !== undefined ? yearValue : ownYear
  // Открывается на выбранном значении в любом режиме: раньше `monthValue` и
  // `yearValue` не учитывались, и сетка месяцев или лет открывалась на
  // текущем годе без подсвеченного выбора.
  const initial =
    defaultMonth ??
    value ??
    // Диапазон открывается на своём начале: раньше `rangeValue` не
    // учитывался, и фильтр по дате открывался на текущем месяце без
    // видимого выбранного периода.
    (mode === "range" ? rangeAnchor(rangeValue) : null) ??
    (mode === "month" && monthValue
      ? new Date(monthValue.year, monthValue.month, 1)
      : mode === "year" && yearValue != null
        ? new Date(yearValue, 0, 1)
        : today)
  const [view, setView] = React.useState<CalendarView>(viewFor(mode))
  // Вид следует за сменой `mode` на лету: раньше он задавался только при
  // монтировании, и календарь, переключённый в режим месяцев, продолжал
  // показывать сетку дней.
  const [syncedMode, setSyncedMode] = React.useState(mode)
  if (syncedMode !== mode) {
    setSyncedMode(mode)
    setView(viewFor(mode))
  }
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

  // ⚠️ Сверка по ДНЮ, а не по ссылке. Родитель, собирающий значение в
  // рендере (`value={iso ? new Date(iso) : null}` в Controller из
  // react-hook-form, `rangeValue={[null, null]}` прямо в JSX), на каждой
  // перерисовке отдаёт новый объект того же дня — и черновик стирался.
  const valueKey = dayKey(value)
  const [syncedValue, setSyncedValue] = React.useState(valueKey)
  // Значение, которое календарь только что отдал сам (клик без подвала,
  // «Применить»). Вернувшись через `value` / `rangeValue`, оно вид не
  // двигает: выбранная дата и так на экране. Без этого шторка, где лента
  // показывает сразу много месяцев, а видимым считался один `focus`,
  // переставляла якорь ленты — и под пальцем оказывались другие месяцы.
  const [emitted, setEmitted] = React.useState<string | null>(null)
  // Выбор, пришедший снаружи за пределы показанных месяцев (заготовка
  // периода, дата, введённая руками, переоткрытый фильтр), переводит
  // календарь на свой месяц — иначе его было не видно. Если на экране уже
  // есть хоть одна дата выбора, вид не трогается: пользователь, отметивший
  // начало и перелиставший к концу периода, не должен улетать обратно.
  function reveal(dates: (Date | null)[], anchor: Date | null) {
    if (!anchor) return
    const shown = mode === "range" ? [focus, addMonths(focus.year, focus.month, 1)] : [focus]
    const visible = (date: Date | null) =>
      date !== null &&
      shown.some((m) => m.year === date.getFullYear() && m.month === date.getMonth())
    if (dates.some(visible)) return
    const target = monthOf(anchor)
    setFocus(target)
    setDecadeEnd(decadeEndFor(target.year, today.getFullYear()))
  }

  if (syncedValue !== valueKey) {
    setSyncedValue(valueKey)
    setDraftValue(value)
    // Своё значение гасится при первом возврате: если позже то же значение
    // придёт уже снаружи, оно снова переводит вид.
    if (valueKey === emitted) setEmitted(null)
    else if (mode === "single") reveal([value], value)
  }

  const rangeKey = rangeValue ? rangeKeyOf(rangeValue) : null
  const [syncedRange, setSyncedRange] = React.useState(rangeKey)
  if (syncedRange !== rangeKey) {
    setSyncedRange(rangeKey)
    if (rangeValue) setDraftRange(rangeValue)
    if (rangeKey === emitted) setEmitted(null)
    else if (mode === "range" && rangeValue) reveal(rangeValue, rangeAnchor(rangeValue))
  }

  const activeValue = footer ? draftValue : value
  const activeRange = footer ? draftRange : (rangeValue ?? draftRange)
  const [normStart, normEnd] = normalizeRange(activeRange[0], activeRange[1])

  function setActiveRange(next: [Date | null, Date | null]) {
    if (footer) {
      setDraftRange(next)
      return
    }
    if (!rangeValue) setDraftRange(next)
    if (rangeKeyOf(next) !== rangeKey) setEmitted(rangeKeyOf(next))
    onRangeChange?.(next)
  }

  // Листание снимает метку «своего» значения: если родитель клик отклонил,
  // а позже та же дата пришла снаружи, пролиставшего пользователя она должна
  // перевести к себе, а не остаться незамеченной.
  function goPrev() {
    setEmitted(null)
    if (view === "days") setFocus((f) => addMonths(f.year, f.month, -1))
    else if (view === "months") setFocus((f) => ({ ...f, year: f.year - 1 }))
    else setDecadeEnd((y) => y - 12)
  }

  function goNext() {
    setEmitted(null)
    if (view === "days") setFocus((f) => addMonths(f.year, f.month, 1))
    else if (view === "months") setFocus((f) => ({ ...f, year: f.year + 1 }))
    else setDecadeEnd((y) => y + 12)
  }

  function shiftMonths(delta: number) {
    setEmitted(null)
    setFocus((f) => addMonths(f.year, f.month, delta))
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
    if (valueProp === undefined) setOwnValue(date)
    if (!sameDayOrEmpty(date, value)) setEmitted(dayKey(date))
    onChange?.(date)
  }

  function handleApply() {
    if (mode === "single") {
      if (valueProp === undefined) setOwnValue(draftValue)
      if (!sameDayOrEmpty(draftValue, value)) setEmitted(dayKey(draftValue))
      // «Сбросить» → «Применить» — это подтверждённый сброс: родитель
      // должен о нём узнать и без `onReset`.
      // `onChange` — «подтверждённое значение изменилось». Черновик, равный
      // уже подтверждённому, повторно не отдаётся: DatePicker сообщает дату
      // ещё при ручном вводе, и «Применить» после ввода давал второй
      // `onChange` с той же датой. `onApply` при этом вызывается всегда.
      if (draftValue) {
        if (!isSameDay(draftValue, value)) onChange?.(draftValue)
      } else if (value) onChange?.(null)
    } else if (mode === "range") {
      // То же для управляемого диапазона; в неуправляемом сравнивать не с
      // чем — подтверждённое значение знает только родитель.
      const same =
        rangeValue !== undefined &&
        sameDayOrEmpty(draftRange[0], rangeValue[0]) &&
        sameDayOrEmpty(draftRange[1], rangeValue[1])
      if (!same) {
        setEmitted(rangeKeyOf(draftRange))
        onRangeChange?.(draftRange)
      }
    }
    onApply?.()
  }

  function handleReset() {
    setDraftValue(null)
    setDraftRange([null, null])
    if (monthValue === undefined) setOwnMonth(null)
    if (yearValue === undefined) setOwnYear(null)
    onReset?.()
  }

  function chooseMonth(next: CalendarSingleMonth) {
    if (monthValue === undefined) setOwnMonth(next)
    onMonthChange?.(next)
  }

  function chooseYear(next: number) {
    if (yearValue === undefined) setOwnYear(next)
    onYearChange?.(next)
  }

  function handleSelectMonth(m: number) {
    if (mode === "month") {
      chooseMonth({ year: focus.year, month: m })
      return
    }
    // переход вглубь из вида одного дня
    setFocus((f) => ({ ...f, month: m }))
    setView("days")
  }

  function handleSelectYear(y: number) {
    if (mode === "year") {
      chooseYear(y)
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
        monthValue={resolvedMonth}
        onMonthChange={chooseMonth}
        yearValue={resolvedYear}
        onYearChange={chooseYear}
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
      monthValue={resolvedMonth}
      yearValue={resolvedYear}
      normStart={normStart}
      normEnd={normEnd}
      goPrev={goPrev}
      goNext={goNext}
      shiftMonths={shiftMonths}
      onSelectDay={handleSelectDay}
      onSelectMonth={handleSelectMonth}
      onSelectYear={handleSelectYear}
      disabledDate={disabledDate}
    />
  )
}

export { Calendar }
