// Форматирование значений для ячеек, собираемых по конфигу полей
// (см. `field.tsx`). Отдельным модулем — потому что это чистые функции без
// React: их проще проверить тестом и переиспользовать за пределами ячейки.
//
// Локаль зашита русская: кит — интерфейс ЕЛК, других локалей у него нет, а
// разделитель разрядов и порядок дат — часть макета, а не настройка
// пользователя.

import { NBSP } from "./number-cell"

const LOCALE = "ru-RU"

/**
 * Узкий неразрывный пробел. ICU для `ru-RU` в части сборок отдаёт разряды
 * именно им (U+202F), а не обычным неразрывным. Разница невидима глазом, но
 * ломает две вещи разом: `withTabularDigits` ищет разрядный пробел, чтобы
 * исключить его из копирования, а `TableCellUnit` отделяет знак валюты
 * ровно `NBSP`. Поэтому всё, что приходит из `Intl`, приводится к одному
 * символу.
 */
const NARROW_NBSP = "\u202F"

function normalizeSpaces(text: string) {
  return text.replaceAll(NARROW_NBSP, NBSP)
}

/** Число уже пришло строкой («10 000,00») — форматировать нечего. */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "bigint") return Number(value)
  return null
}

/**
 * Число с разрядами по-русски. `decimals` фиксирует и минимум, и максимум
 * знаков после запятой: в колонке денег «10 000,00» и «10 000,5» друг под
 * другом не выравниваются, поэтому дробная часть у всей колонки одна.
 */
function formatNumber(value: number, decimals?: number) {
  return normalizeSpaces(
    new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  )
}

/**
 * Знак перед положительным числом. В макете поступление подписано
 * «+31 922 980 133 515,05 ₽» и покрашено в зелёный — знак и цвет включаются
 * одним флагом `signed`, порознь они не встречаются.
 */
function withSign(text: string, value: number, signed: boolean | undefined) {
  return signed && value > 0 ? `+${text}` : text
}

/**
 * Дата из чего угодно: `Date`, миллисекунды, ISO-строка. Всё остальное —
 * `null`, и тогда значение показывается как есть: подменять непонятную
 * строку прочерком нельзя, данные из ячейки так пропадут молча.
 */
function parseDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === "number") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (typeof value === "string" && value.trim() !== "") {
    // ⚠️ «2026-08-25» без времени спецификация языка велит читать как ПОЛНОЧЬ
    // UTC, а показывается дата по местному времени — западнее Гринвича такая
    // дата уезжала бы на сутки назад. Дата без времени — это календарный
    // день, а не момент, поэтому собирается местной полночью.
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
    const date = dateOnly
      ? new Date(
          Number(dateOnly[1]),
          Number(dateOnly[2]) - 1,
          Number(dateOnly[3])
        )
      : new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  return null
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/** «31.12.2026». */
function formatDate(date: Date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}

/** «14:05». */
function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * «31.12.2026, 14:05» — запятая, как её ставит `Intl.DateTimeFormat` для
 * русской локали, чтобы дата и время не слипались в одно число.
 */
function formatDateTime(date: Date) {
  return `${formatDate(date)}, ${formatTime(date)}`
}

export {
  LOCALE,
  formatDate,
  formatDateTime,
  formatNumber,
  formatTime,
  normalizeSpaces,
  parseDate,
  toNumber,
  withSign,
}
