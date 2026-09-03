import * as React from "react"

import { cn } from "@/lib/utils"
import { MONTHS_RU_SHORT, getDecadeYears } from "@/lib/calendar"

import type { GridSize } from "./day-grid"

/**
 * Сетка 3×N для выбора месяца или года.
 *
 * Desktop MonthYear cells are 36px tall with a 16px/24px column/row gap;
 * mobile cells are 48px tall with a 35px/16px column/row gap (Figma's
 * MonthYear (Desktop, ELK) vs MonthYear (Mobile, ELK) Date grids). The
 * container's own px-4 pb-4 stays constant — only measured for desktop, but
 * the mobile per-year/decade heading (see calendar-mobile.tsx) supplies its
 * own matching pt/gap above the grid, so no size-specific container padding
 * is needed here.
 *
 * Месяцы и годы отличаются только списком значений и подписью — сама сетка,
 * состояния и попадание «сегодня» у них общие.
 */
function PickerGrid<T extends string | number>({
  values,
  label,
  selected,
  current,
  onSelect,
  size = "desktop",
}: {
  values: T[]
  /** Подпись ячейки; по умолчанию — само значение. */
  label?: (value: T) => React.ReactNode
  /** Выбранное значение или `null`, если выбора ещё не было. */
  selected: T | null
  /** Значение, попадающее на сегодняшний день, — подсвечивается акцентом. */
  current: T | null
  onSelect: (value: T) => void
  size?: GridSize
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 px-4 pb-4",
        size === "mobile" ? "gap-x-[35px] gap-y-4" : "gap-x-4 gap-y-6"
      )}
    >
      {values.map((value) => {
        const isSelected = selected === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "flex items-center justify-center rounded-[8px] text-p2-medium outline-none transition-colors focus-visible:focus-ring",
              size === "mobile" ? "h-12" : "h-9",
              isSelected
                ? "bg-[var(--calendar-selected-bg)] text-[var(--calendar-selected-fg)]"
                : "text-[var(--calendar-fg)] hover:bg-[var(--calendar-range-bg)]",
              !isSelected && current === value && "text-[var(--calendar-accent-fg)]"
            )}
          >
            {label ? label(value) : value}
          </button>
        )
      })}
    </div>
  )
}

const MONTH_INDEXES = MONTHS_RU_SHORT.map((_, index) => index)

function MonthGrid({
  selectedMonth,
  currentMonth,
  onSelectMonth,
  size = "desktop",
}: {
  selectedMonth: number | null
  currentMonth: number | null
  onSelectMonth: (month: number) => void
  size?: GridSize
}) {
  return (
    <PickerGrid
      values={MONTH_INDEXES}
      label={(month) => MONTHS_RU_SHORT[month]}
      selected={selectedMonth}
      current={currentMonth}
      onSelect={onSelectMonth}
      size={size}
    />
  )
}

function YearGrid({
  decadeEnd,
  selectedYear,
  currentYear,
  onSelectYear,
  size = "desktop",
}: {
  decadeEnd: number
  selectedYear: number | null
  currentYear: number
  onSelectYear: (year: number) => void
  size?: GridSize
}) {
  return (
    <PickerGrid
      values={getDecadeYears(decadeEnd)}
      selected={selectedYear}
      current={currentYear}
      onSelect={onSelectYear}
      size={size}
    />
  )
}

export { MonthGrid, PickerGrid, YearGrid }
