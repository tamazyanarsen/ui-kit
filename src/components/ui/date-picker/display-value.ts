import { formatDateRu, MONTHS_RU_FULL } from "@/lib/calendar"
import type { CalendarMode } from "@/components/ui/calendar"

/** Текст поля только для чтения: диапазон, месяц или год. */
function formatDisplayValue(
  mode: Exclude<CalendarMode, "single">,
  activeRange: [Date | null, Date | null],
  activeMonth: { year: number; month: number } | null,
  activeYear: number | null
): string {
  switch (mode) {
    case "range": {
      const [start, end] = activeRange
      if (!start) return ""
      return end
        ? `${formatDateRu(start)} — ${formatDateRu(end)}`
        : `${formatDateRu(start)} — `
    }
    case "month":
      return activeMonth
        ? `${MONTHS_RU_FULL[activeMonth.month]} ${activeMonth.year}`
        : ""
    case "year":
      return activeYear ? String(activeYear) : ""
  }
}

export { formatDisplayValue }
