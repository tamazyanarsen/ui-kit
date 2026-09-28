import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { CalendarDays } from "@/icons"
import { useComposedRefs } from "@/lib/compose-refs"

import { formatDateRu, parseDateRu } from "@/lib/calendar"
import { Calendar } from "@/components/ui/calendar"
import type { CalendarMode } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import type { InputSize } from "@/components/ui/input"

import { formatDisplayValue } from "./display-value"
import { useFieldPopoverFocus } from "./use-field-popover-focus"

const ICON_SIZE = { sm: "size-3.5", lg: "size-4" } as const

// ⚠️ Минимальной ширины у поля БОЛЬШЕ НЕТ — дизайн-чек от 08.09, замечание
// 18: «Снять минимальную ширину с инпутов/селектов».
//
// Здесь стоял `min-w-[280px]` под шириной одномесячного календаря: поле —
// сжимающийся триггер, и без пола оно выходило уже выпадающего списка под
// ним. Плата за это оказалась дороже: в двухколоночной строке блока (замер
// на «Отчётах по проектам» — колонка 199px при поле 280) пара полей просто
// вылезала за правый край блока, и никакой класс снаружи это не лечил —
// минимум бьёт `w-full`.
//
// Так что поле теперь честно берёт ширину контейнера, а выпадающий список
// остаётся при своих 280 (`calendar-desktop`): список позиционируется
// отдельно и шире поля быть вправе.

const DEFAULT_LABEL: Record<CalendarMode, string> = {
  single: "Дата",
  range: "Дата начала — Дата окончания",
  month: "Месяц",
  year: "Год",
}

// Форматирует значение поля только для чтения в трёх режимах, кроме
// «single» (тот остаётся редактируемым <Input> с маской и разбирается
// отдельно — см. mode === "single" ниже). Пустая строка означает «ещё
// ничего не выбрано».
// DatePicker — недостающее звено между Calendar (чистое содержимое, без
// собственного поповера и триггера — так задумано, см. calendar-demo.tsx) и
// Input (у которого уже есть и `mask="date"`, и значок календаря). По
// макету зазор от поля до выпадающего списка — 8px. Клик по дню, месяцу
// или году только *выбирает* его (обновляет поле, подсвечивает ячейку), а
// список остаётся открытым, пока «Применить» не подтвердит выбор и не
// закроет его, — одинаково во всех четырёх режимах. При повторном открытии
// ранее выбранное значение показано как Active, и это получается само
// собой: поповер при закрытии размонтирует Calendar, поэтому тот каждый раз
// монтируется заново (перечитывая текущее значение как свой `defaultMonth`),
// и возвращать ему фокус вручную не нужно.
//
// Поповер открывается кликом по полю или стрелкой вниз, но само поле — НЕ
// Popover.Trigger. Раньше триггером было всё поле (`div role=button` с
// textbox внутри): лишняя остановка Tab, вложенный интерактив, и клик
// уводил фокус в календарь, так что дату было не напечатать. Теперь поле
// обычное, поповер привязан к нему через `anchor`, а клик по полю при
// открытом календаре отсекается в `handleOpenChange`.
//
// Ручной ввод (mask="date") подключён только для `mode="single"` — ровно
// как в самом макете, где пометка «ручной ввод доступен» стоит лишь у поля
// одиночной даты. Диапазон, месяц и год остаются только для выбора (их поле
// только для чтения): надёжный разбор введённого руками диапазона
// «DD.MM.YYYY – DD.MM.YYYY» — заметно большая задача, чем покрывает этот
// проход.
interface DatePickerProps {
  mode?: CalendarMode
  size?: InputSize
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  disabled?: boolean
  footer?: boolean
  containerClassName?: string
  /** Имя поля ввода — для форм и `Controller` из react-hook-form. */
  name?: string
  /**
   * Фокус ушёл из пикера ЦЕЛИКОМ — из поля, значка и календаря. Переход
   * между ними уходом не считается: иначе `mode: "onTouched"` в
   * react-hook-form проверял бы поле, едва человек открыл календарь.
   */
  onBlur?: () => void

  // mode="single"
  value?: Date | null
  onChange?: (date: Date | null) => void

  // mode="range"
  rangeValue?: [Date | null, Date | null]
  onRangeChange?: (range: [Date | null, Date | null]) => void

  // mode="month"
  monthValue?: { year: number; month: number } | null
  /** `null` — месяц сброшен кнопкой «Сбросить». */
  onMonthChange?: (value: { year: number; month: number } | null) => void

  // mode="year"
  yearValue?: number | null
  /** `null` — год сброшен кнопкой «Сбросить». */
  onYearChange?: (year: number | null) => void
}

// `ref` — на текстовое поле: `Controller` из react-hook-form ставит фокус
// на поле с ошибкой через `field.ref`, и до этой правки ему было некуда.
const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({
  mode = "single",
  size = "lg",
  label,
  comment,
  error,
  disabled = false,
  footer = true,
  containerClassName,
  name,
  onBlur,
  value,
  onChange,
  rangeValue,
  onRangeChange,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
}, ref) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const fieldRef = React.useRef<HTMLInputElement>(null)
  const setFieldRef = useComposedRefs(fieldRef, ref)

  // Уход фокуса из пикера целиком. Календарь — в портале, но синтетические
  // события React всплывают по дереву компонентов, поэтому одного
  // обработчика на корне хватает и для поля, и для календаря. Защитные span
  // Base UI (переход по Tab между полем и календарём) — тоже «внутри».
  //
  // ⚠️ Одно нативное событие из портала React доставляет сюда дважды (его
  // ловят и контейнер портала Base UI, и body), поэтому повтор того же
  // события отсекается — иначе `onBlur` звучал бы дважды за один уход.
  const lastBlur = React.useRef<Event | null>(null)
  function handlePickerBlur(event: React.FocusEvent) {
    if (!onBlur || lastBlur.current === event.nativeEvent) return
    lastBlur.current = event.nativeEvent
    const next = event.relatedTarget
    if (
      next instanceof Element &&
      (anchorRef.current?.contains(next) ||
        popupRef.current?.contains(next) ||
        next.hasAttribute("data-base-ui-focus-guard"))
    ) {
      return
    }
    onBlur()
  }

  // Запасное неуправляемое состояние: читается и пишется только то, что
  // соответствует активному режиму `mode`.
  const [internalValue, setInternalValue] = React.useState<Date | null>(null)
  const [internalRange, setInternalRange] = React.useState<
    [Date | null, Date | null]
  >([null, null])
  const [internalMonth, setInternalMonth] = React.useState<{
    year: number
    month: number
  } | null>(null)
  const [internalYear, setInternalYear] = React.useState<number | null>(null)

  const activeValue = value !== undefined ? value : internalValue
  const activeRange = rangeValue ?? internalRange
  const activeMonth = monthValue !== undefined ? monthValue : internalMonth
  const activeYear = yearValue !== undefined ? yearValue : internalYear

  const defaultLabel = DEFAULT_LABEL[mode]

  const icon = <CalendarDays aria-hidden="true" className={ICON_SIZE[size]} />

  // Текст поля одиночной даты — своё состояние, а не производное от даты:
  // пока пользователь набирает «15.0», даты ещё нет, но и затирать
  // набранное нельзя. С датой текст сверяется при каждой её смене снаружи
  // (выбор в календаре, «Сбросить», новое `value` от родителя); набранный
  // руками текст, который уже разбирается в ту же дату, не трогается.
  const [text, setText] = React.useState(() =>
    activeValue ? formatDateRu(activeValue) : ""
  )
  const activeTime = activeValue ? activeValue.getTime() : null
  React.useEffect(() => {
    setText((prev) => {
      const typed = parseDateRu(prev)
      if ((typed ? typed.getTime() : null) === activeTime) return prev
      return activeTime === null ? "" : formatDateRu(new Date(activeTime))
    })
  }, [activeTime])

  function handleSelectDay(date: Date | null) {
    if (value === undefined) setInternalValue(date)
    onChange?.(date)
  }

  function handleRangeChange(range: [Date | null, Date | null]) {
    if (rangeValue === undefined) setInternalRange(range)
    onRangeChange?.(range)
  }

  function handleMonthChange(next: { year: number; month: number } | null) {
    if (monthValue === undefined) setInternalMonth(next)
    onMonthChange?.(next)
  }

  function handleYearChange(next: number | null) {
    if (yearValue === undefined) setInternalYear(next)
    onYearChange?.(next)
  }

  // Сброс очищает черновой выбор, но — по паре с «Применить» из макета —
  // оставляет список открытым для нового выбора. ⚠️ Во всех режимах сброс
  // идёт через колбэк: раньше месяц и год чистили только внутреннее
  // состояние, и в управляемом режиме «Сбросить» не делал ничего.
  function handleReset() {
    if (mode === "range") handleRangeChange([null, null])
    else if (mode === "month") handleMonthChange(null)
    else if (mode === "year") handleYearChange(null)
    else handleSelectDay(null)
  }

  // Текст поля приводится к выбранной дате, когда ввод закончен: на уходе
  // фокуса и на «Применить». Эффект выше срабатывает только на СМЕНУ даты —
  // недописанное «15.0» оставалось в поле, если человек выбирал в
  // календаре тот же день, что уже стоял.
  function normalizeText() {
    if (mode !== "single") return
    setText(activeValue ? formatDateRu(activeValue) : "")
  }

  const fieldFocus = useFieldPopoverFocus({
    open,
    setOpen,
    disabled,
    single: mode === "single",
    popupRef,
    anchorRef,
    fieldRef,
    onClose: normalizeText,
  })

  // Значок — настоящий Trigger поповера: на него Base UI опирает защитные
  // span (Tab с последней кнопки календаря ведёт к элементу после пикера).
  // ⚠️ В обходе по Tab он только пока календарь открыт (`triggerTabIndex`):
  // защитный span ищет «следующий после триггера» среди доступных по Tab.
  // У закрытого пикера остановка одна — поле; с клавиатуры календарь
  // открывает стрелка вниз.
  const trigger = (
    <PopoverPrimitive.Trigger
      disabled={disabled}
      tabIndex={fieldFocus.triggerTabIndex}
      aria-label="Открыть календарь"
      render={<button type="button" className="flex outline-none" />}
    >
      {icon}
    </PopoverPrimitive.Trigger>
  )

  function handleApply() {
    fieldFocus.close("return")
  }

  // Неполная строка («15.0») дату не меняет, а полностью стёртое поле —
  // это сброс даты: иначе родитель держал бы старую дату при пустом поле.
  function handleMaskChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setText(next)
    const parsed = parseDateRu(next)
    if (parsed) handleSelectDay(parsed)
    else if (next.replace(/[\s._]/g, "") === "" && activeValue) handleSelectDay(null)
  }

  const defaultMonth =
    mode === "range"
      ? (activeRange[0] ?? undefined)
      : mode === "single"
        ? (activeValue ?? undefined)
        : undefined

  return (
    // У Popover.Root нет собственного узла DOM, поэтому его дети — включая
    // защитные span для фокуса, которые Base UI вставляет и убирает при
    // открытии, — иначе попадали бы прямо в то, во что
    // вызывающий код обернул DatePicker. Раскладка, разводящая детей
    // внешними отступами (например, space-y-* в Tailwind), приняла бы эти
    // защитные элементы за дополнительные пункты и заметно выросла бы при
    // открытии поповера. Этот div держит их внутри, чтобы DatePicker всегда
    // выглядел ровно одним ребёнком.
    // ⚠️ `w-full min-w-0`, а НЕ `w-fit`. Дизайн-чек от 08.09, замечание 18
    // («снять минимальную ширину с инпутов/селектов») и 26 («строка полей
    // должна упираться в правый край блока»): `w-fit` брал у поля ширину
    // содержимого, то есть собственный размер `<input>` (~250px), и в
    // двухколоночной строке блока поле вылезало за свою колонку — замер на
    // «Отчётах по проектам» давал колонку 199 при поле 250.
    //
    // `min-w-0` обязателен рядом с `w-full`: у элемента сетки и флекса
    // автоматический минимум — это min-content, и он один способен
    // раздвинуть колонку, сколько бы `w-full` ни просил. Сам `Input` внутри
    // и так `w-full`, так что теперь оба ведут себя одинаково.
    <div className="w-full min-w-0" onBlur={handlePickerBlur}>
      <PopoverPrimitive.Root open={disabled ? false : open} onOpenChange={fieldFocus.handleOpenChange}>
        <div ref={anchorRef} className="w-full min-w-0">
          {mode === "single" ? (
            <Input
              ref={setFieldRef}
              name={name}
              size={size}
              label={label ?? defaultLabel}
              mask="date"
              value={text}
              onChange={handleMaskChange}
              disabled={disabled}
              comment={comment}
              error={error}
              clearable={false}
              trailingIcon={trigger}
              containerClassName={containerClassName}
              {...fieldFocus.fieldProps}
            />
          ) : (
            <Input
              ref={setFieldRef}
              name={name}
              size={size}
              label={label ?? defaultLabel}
              readOnly
              value={formatDisplayValue(mode, activeRange, activeMonth, activeYear)}
              onChange={() => {}}
              disabled={disabled}
              comment={comment}
              error={error}
              clearable={false}
              trailingIcon={trigger}
              containerClassName={containerClassName}
              {...fieldFocus.fieldProps}
            />
          )}
        </div>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            anchor={anchorRef}
            side="bottom"
            align="start"
            sideOffset={8}
            className="z-50"
          >
            <PopoverPrimitive.Popup
              ref={popupRef}
              // Куда уходит фокус при открытии и куда возвращается при
              // закрытии — см. `useFieldPopoverFocus`.
              initialFocus={fieldFocus.initialFocus}
              // В поле фокус возвращается только после Escape, «Применить» и
              // значка; закрытие уходом его не трогает.
              finalFocus={fieldFocus.finalFocus}
              data-slot="date-picker-content"
              className="outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              <Calendar
                mode={mode}
                layout="popover"
                footer={footer}
                defaultMonth={defaultMonth}
                value={mode === "single" ? activeValue : undefined}
                onChange={mode === "single" ? handleSelectDay : undefined}
                rangeValue={mode === "range" ? activeRange : undefined}
                onRangeChange={mode === "range" ? handleRangeChange : undefined}
                monthValue={mode === "month" ? activeMonth : undefined}
                onMonthChange={mode === "month" ? handleMonthChange : undefined}
                yearValue={mode === "year" ? activeYear : undefined}
                onYearChange={mode === "year" ? handleYearChange : undefined}
                onReset={handleReset}
                onApply={handleApply}
              />
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  )
})

export { DatePicker }
export type { DatePickerProps }
