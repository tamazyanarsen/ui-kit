export type CalendarMode = "single" | "range" | "month" | "year"
export type CalendarView = "days" | "months" | "years"

export interface CalendarSingleMonth {
  year: number
  month: number
}

export interface CalendarProps {
  mode?: CalendarMode
  /** «popover» — десктопный виджет (листается страницами, фиксированной
   * ширины). «sheet» — мобильный: заголовок с кнопкой закрытия, одна
   * навигация «назад» и непрерывно прокручиваемый список месяцев, лет и
   * десятилетий. Раскладка «sheet» рисует только собственное содержимое —
   * размещайте её в том примитиве модального окна или нижней шторки,
   * которым пользуется страница. */
  layout?: "popover" | "sheet"
  title?: string
  onClose?: () => void
  className?: string
  footer?: boolean
  /** Свойство `Show Secondary Button` — кнопка «Сбросить» в подвале. */
  showSecondaryButton?: boolean
  onReset?: () => void
  onApply?: () => void
  defaultMonth?: Date
  /** Помечает отдельные дни как невыбираемые (например, вне диапазона
   * min/max) — состояние дня «Disabled» из макета. Действует только на
   * ячейки дней (режимы single и range), но не на выбор месяца и года. */
  disabledDate?: (date: Date) => boolean

  // mode="single"
  value?: Date | null
  /** `null` — дата сброшена: «Сбросить», затем «Применить». */
  onChange?: (date: Date | null) => void

  // mode="range"
  rangeValue?: [Date | null, Date | null]
  onRangeChange?: (range: [Date | null, Date | null]) => void

  // mode="month"
  monthValue?: { year: number; month: number } | null
  onMonthChange?: (value: { year: number; month: number }) => void

  // mode="year"
  yearValue?: number | null
  onYearChange?: (year: number) => void
}
