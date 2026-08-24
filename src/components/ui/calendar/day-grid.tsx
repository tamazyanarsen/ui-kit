import { cn } from "@/lib/utils"
import { WEEKDAYS_RU, getMonthMatrix, isSameDay, type DayCell } from "@/lib/calendar"

/** Габариты ячейки дня: десктоп 36px, мобила 48px — с Figma Day (Desktop/
 * Mobile) ELK/calendar. Отсюда же поля карточки и зазоры сетки. */
type GridSize = "desktop" | "mobile"

const CELL_WIDTH: Record<GridSize, string> = {
  desktop: "w-9",
  mobile: "w-12",
}

/** Desktop day cells are 36px wide with a 14px card gutter and 0px gap down
 * to the day grid; mobile cells are 48px wide with a 12px gutter and an 8px
 * gap down to the day grid. */
function WeekdaysRow({ size = "desktop" }: { size?: GridSize }) {
  return (
    <div className={cn("flex", size === "mobile" ? "px-3 pb-2" : "px-3.5")}>
      {WEEKDAYS_RU.map((day) => (
        <span
          key={day}
          className={cn(
            "flex h-8 items-center justify-center text-p3-regular text-[var(--calendar-muted-fg)]",
            CELL_WIDTH[size]
          )}
        >
          {day}
        </span>
      ))}
    </div>
  )
}

interface DayGridProps {
  year: number
  month: number
  today: Date
  isSelected: (date: Date) => boolean
  isRangeStart?: (date: Date) => boolean
  isRangeEnd?: (date: Date) => boolean
  isRangeMiddle?: (date: Date) => boolean
  /** Figma's "Disabled" day state — e.g. dates outside a min/max range.
   * Disabled days render muted and can't be clicked or focused. */
  isDisabled?: (date: Date) => boolean
  onSelectDay: (date: Date) => void
  /** See WeekdaysRow — desktop cells are 36px/8px-row-gap/14px-gutter;
   * mobile cells are 48px/24px-row-gap/12px-gutter (Figma's Date grid gap
   * is `8px 0px` on desktop vs `24px 0px` on mobile). */
  size?: GridSize
}

function DayGrid({ year, month, size = "desktop", ...day }: DayGridProps) {
  const weeks = getMonthMatrix(year, month)

  return (
    <div
      className={cn(
        "flex flex-col",
        size === "mobile" ? "gap-6 px-3 pb-2" : "gap-2 px-3.5 pb-4"
      )}
    >
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex">
          {week.map((cell, cellIndex) => (
            <DayButton key={cellIndex} cell={cell} size={size} {...day} />
          ))}
        </div>
      ))}
    </div>
  )
}

function DayButton({
  cell,
  today,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  isDisabled,
  onSelectDay,
  size = "desktop",
}: { cell: DayCell | null } & Omit<DayGridProps, "year" | "month">) {
  const cellWidth = CELL_WIDTH[size]
  if (!cell) return <span className={cn("h-8 shrink-0", cellWidth)} />

  const selected = isSelected(cell.date)
  const rangeStart = isRangeStart?.(cell.date) ?? false
  const rangeEnd = isRangeEnd?.(cell.date) ?? false
  const rangeMiddle = isRangeMiddle?.(cell.date) ?? false
  const isToday = isSameDay(cell.date, today)
  const inRangeEdge = rangeStart || rangeEnd
  const disabled = isDisabled?.(cell.date) ?? false

  return (
    <span
      className={cn(
        "flex h-8 shrink-0 items-center justify-center",
        cellWidth,
        rangeMiddle && "bg-[var(--calendar-range-bg)]",
        rangeStart && "rounded-l-[8px] bg-[var(--calendar-range-bg)]",
        rangeEnd && "rounded-r-[8px] bg-[var(--calendar-range-bg)]"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectDay(cell.date)}
        className={cn(
          "z-10 flex size-8 shrink-0 items-center justify-center rounded-[8px] text-p2-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          disabled
            ? "cursor-not-allowed text-[var(--calendar-disabled-fg)]"
            : selected || inRangeEdge
              ? "bg-[var(--calendar-selected-bg)] text-[var(--calendar-selected-fg)]"
              : "text-[var(--calendar-fg)] hover:bg-[var(--calendar-range-bg)]",
          !disabled &&
            !selected &&
            !inRangeEdge &&
            isToday &&
            "text-[var(--calendar-accent-fg)]"
        )}
      >
        {cell.day}
      </button>
    </span>
  )
}

export { DayGrid, WeekdaysRow }
export type { DayGridProps, GridSize }
