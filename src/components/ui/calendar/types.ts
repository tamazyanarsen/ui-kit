export type CalendarMode = "single" | "range" | "month" | "year"
export type CalendarView = "days" | "months" | "years"

export interface CalendarSingleMonth {
  year: number
  month: number
}

export interface CalendarProps {
  mode?: CalendarMode
  /** "popover" is the desktop widget (paginated, fixed width). "sheet" is
   * the mobile widget: title + close button, a single back nav, and a
   * continuously scrollable list of months/years/decades. The "sheet"
   * layout renders its own content only — host it in whatever
   * modal/bottom-sheet primitive the page uses. */
  layout?: "popover" | "sheet"
  title?: string
  onClose?: () => void
  className?: string
  footer?: boolean
  onReset?: () => void
  onApply?: () => void
  defaultMonth?: Date
  /** Marks individual days as unselectable (e.g. outside a min/max range) —
   * Figma's "Disabled" day state. Only applies to day cells (single/range
   * modes), not the month/year pickers. */
  disabledDate?: (date: Date) => boolean

  // mode="single"
  value?: Date | null
  onChange?: (date: Date) => void

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
