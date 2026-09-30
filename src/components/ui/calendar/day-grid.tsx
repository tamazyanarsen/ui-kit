import { cn } from "@/lib/utils"
import { WEEKDAYS_RU, getMonthMatrix, isSameDay, type DayCell } from "@/lib/calendar"
import { dateKey } from "./use-day-focus"

/** Габариты ячейки дня: десктоп 36px, мобила 48px — с Figma Day (Desktop/
 * Mobile) ELK/calendar. Отсюда же поля карточки и зазоры сетки. */
type GridSize = "desktop" | "mobile"

const CELL_WIDTH: Record<GridSize, string> = {
  desktop: "w-9",
  mobile: "w-12",
}

/** Десктопные ячейки дней шириной 36px с полем карточки 14px и нулевым
 * зазором вниз до сетки дней; мобильные — шириной 48px с полем 12px и
 * зазором 8px вниз до сетки дней. */
function WeekdaysRow({ size = "desktop" }: { size?: GridSize }) {
  return (
    <div className={cn("flex", size === "mobile" ? "px-3 pb-2" : "px-3.5")}>
      {WEEKDAYS_RU.map((day) => (
        <span
          key={day}
          className={cn(
            // Полный проход 30.09: подписи дней недели в макете — Regular
            // (P3 Regular, 400) на обеих формах, а не Medium.
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
  /** Состояние дня «Disabled» из макета — например, даты вне диапазона
   * min/max. Выключенные дни рисуются приглушённо, их нельзя ни нажать, ни
   * взять в фокус. */
  isDisabled?: (date: Date) => boolean
  onSelectDay: (date: Date) => void
  /** См. WeekdaysRow: у десктопных ячеек 36px, зазор строк 8px и поле
   * 14px; у мобильных — 48px, зазор строк 24px и поле 12px (зазор сетки дат
   * в макете это `8px 0px` на десктопе против `24px 0px` на мобильном). */
  size?: GridSize
  /** Roving tabindex (`useDayFocus`): единственный день в порядке Tab. Без
   * него в порядке Tab все дни, как раньше. */
  tabbableDate?: Date | null
  onDayKeyDown?: (date: Date, event: React.KeyboardEvent) => void
  onDayFocus?: (date: Date) => void
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
  tabbableDate,
  onDayKeyDown,
  onDayFocus,
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

  const roving = tabbableDate != null && isSameDay(cell.date, tabbableDate)

  return (
    <span
      className={cn(
        "relative flex h-8 shrink-0 items-center justify-center",
        cellWidth,
        rangeMiddle && !rangeStart && !rangeEnd && "bg-[var(--calendar-range-bg)]",
        // Полный проход 30.09: полоса диапазона у крайних дней — не во всю
        // ячейку, а от края самой плитки дня: FirstInRange начинается на её
        // левом краю (на десктопе x=2 из 36, на мобильном x=8 из 48),
        // LastInRange кончается на правом. Раньше серая полоса торчала за
        // плитку на 2px (8px на мобильном), и вокруг скруглённого угла
        // выступала серая кайма.
        rangeStart &&
          "before:absolute before:inset-y-0 before:right-0 before:left-[calc(50%-16px)] before:rounded-l-[8px] before:bg-[var(--calendar-range-bg)]",
        rangeEnd &&
          "after:absolute after:inset-y-0 after:left-0 after:right-[calc(50%-16px)] after:rounded-r-[8px] after:bg-[var(--calendar-range-bg)]"
      )}
    >
      <button
        type="button"
        data-slot="calendar-day"
        data-selected={selected || undefined}
        data-today={isToday || undefined}
        data-date={dateKey(cell.date)}
        // Метка дня-остановки для DatePicker: по ней ставится фокус при
        // открытии с клавиатуры. По самому `tabindex` искать нельзя — Base UI,
        // пока фокус вне поповера, переписывает его у всех кнопок на -1.
        data-roving={roving || undefined}
        tabIndex={tabbableDate === undefined ? undefined : roving ? 0 : -1}
        disabled={disabled}
        onClick={() => onSelectDay(cell.date)}
        onKeyDown={onDayKeyDown && ((event) => onDayKeyDown(cell.date, event))}
        onFocus={onDayFocus && (() => onDayFocus(cell.date))}
        className={cn(
          "z-10 flex size-8 shrink-0 items-center justify-center rounded-[8px] text-p2-medium outline-none transition-colors focus-visible:focus-ring",
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
