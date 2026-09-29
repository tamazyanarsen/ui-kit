export const WEEKDAYS_RU = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"] as const

export const MONTHS_RU_FULL = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const

export const MONTHS_RU_SHORT = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
] as const

export interface DayCell {
  date: Date
  day: number
}

/** Сетка недель с началом в понедельник для заданного месяца. Ведущие и
 * замыкающие позиции вне месяца равны `null` (дизайн оставляет их пустыми,
 * без цифр соседних месяцев). Возвращает от 4 до 6 строк в зависимости от
 * месяца. */
export function getMonthMatrix(year: number, month: number): (DayCell | null)[][] {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // getDay(): Sun=0..Sat=6. Convert to Mon=0..Sun=6.
  const leading = (firstOfMonth.getDay() + 6) % 7

  const cells: (DayCell | null)[] = Array.from({ length: leading }, () => null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), day })
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (DayCell | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isBeforeDay(a: Date, b: Date) {
  return (
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() &&
      (a.getMonth() < b.getMonth() ||
        (a.getMonth() === b.getMonth() && a.getDate() < b.getDate())))
  )
}

export function isSameMonth(a: Date, year: number, month: number) {
  return a.getFullYear() === year && a.getMonth() === month
}

/** Упорядочивает (возможно, перевёрнутый) диапазон так, чтобы начало было не позже конца. */
export function normalizeRange(
  a: Date | null,
  b: Date | null
): [Date | null, Date | null] {
  if (!a || !b) return [a, b]
  return isBeforeDay(b, a) ? [b, a] : [a, b]
}

export function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  return (
    (isBeforeDay(start, date) || isSameDay(start, date)) &&
    (isBeforeDay(date, end) || isSameDay(date, end))
  )
}

/** Окно из 12 лет, последний — `endYear`: например, endYear=2024 даёт
 * 2013…2024. */
export function getDecadeYears(endYear: number): number[] {
  const start = endYear - 11
  return Array.from({ length: 12 }, (_, i) => start + i)
}

export function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

/** «DD.MM.YYYY» — формат, которым макет пользуется и для поля одного дня, и
 * для каждой половины поля диапазона («DD.MM.YYYY – DD.MM.YYYY»). */
export function formatDateRu(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  // Год добивается нулями до четырёх знаков: «01.01.999» ни маска, ни
  // `parseDateRu` не читают обратно.
  const yyyy = String(date.getFullYear()).padStart(4, "0")
  return `${dd}.${mm}.${yyyy}`
}

/** Обратная к formatDateRu. Отвергает и неверно составленные строки, и
 * даты, которые переполнились (например, «31.02.2024», переехавшее в
 * март), а не принимает их молча. */
export function parseDateRu(value: string): Date | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  if (!match) return null
  const day = Number(match[1])
  const month = Number(match[2]) - 1
  const year = Number(match[3])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}
