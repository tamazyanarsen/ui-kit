// Форматирование значений для ячеек, собираемых по конфигу полей
// (см. `field.tsx`). Отдельным модулем — потому что это чистые функции без
// React: их проще проверить тестом и переиспользовать за пределами ячейки.
//
// Локаль зашита русская: кит — интерфейс ЕЛК, других локалей у него нет, а
// разделитель разрядов и порядок дат — часть макета, а не настройка
// пользователя.

// Приведение пробелов живёт в общем модуле формата чисел: ICU для `ru-RU`
// в части сборок отдаёт разряды узким неразрывным (U+202F), и это ломает две
// вещи разом — `withTabularDigits` ищет разрядный пробел, чтобы исключить его
// из копирования, а слот знака отбивает валюту ровно `NBSP`.
import { normalizeSpaces } from "@/lib/number-format"

const LOCALE = "ru-RU"

/** Число уже пришло строкой («10 000,00») — форматировать нечего. */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "bigint") return Number(value)
  return null
}

/**
 * Число из УЖЕ ОТФОРМАТИРОВАННОЙ строки — только для сортировки: «10 000,00»,
 * «−5,5 %», «+31 922 980 133 515,05 ₽». Показывается такая строка как
 * пришла (см. `toNumber`), а сравниваться обязана числом: текстом «100 000»
 * стояло раньше «20 000». Разряды — любые пробелы, минус — и дефис, и
 * типографский, хвост без цифр (валюта, «%», «шт.») отбрасывается. Всё, что
 * числом не читается целиком, — `null`.
 */
function parseNumericText(value: unknown): number | null {
  if (typeof value !== "string") return null
  // `\s` в JS покрывает и NBSP, и узкий U+202F; минус — U+2212 и тире U+2013.
  const compact = value.replace(/\s/g, "").replace(/[\u2212\u2013]/g, "-")
  const match = /^([+-]?)(\d+(?:[.,]\d+)?)\D*$/.exec(compact)
  if (!match) return null
  const number = Number(match[2].replace(",", "."))
  return match[1] === "-" ? -number : number
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
 * Дата из чего угодно: `Date`, миллисекунды, ISO-строка, русская запись
 * «дд.мм.гггг» (можно со временем «, чч:мм»). Всё остальное — `null`, и
 * тогда значение показывается как есть: подменять непонятную строку
 * прочерком нельзя, данные из ячейки так пропадут молча.
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
    const text = value.trim()
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text)
    if (dateOnly) {
      return calendarDate(Number(dateOnly[1]), Number(dateOnly[2]), Number(dateOnly[3]))
    }
    // ⚠️ «01.02.2026» `new Date` в V8 читает по-американски — как 2 января,
    // а «31.12.2026» не читает вовсе. Колонка вела себя вразнобой: одни даты
    // молча переставлялись, другие оставались строкой. Русская запись
    // разбирается явно, с проверкой, что такой день существует.
    const ru = /^(\d{2})\.(\d{2})\.(\d{4})(?:,?\s+(\d{2}):(\d{2}))?$/.exec(text)
    if (ru) {
      const date = calendarDate(Number(ru[3]), Number(ru[2]), Number(ru[1]))
      if (date && ru[4] !== undefined) {
        const hours = Number(ru[4])
        const minutes = Number(ru[5])
        if (hours > 23 || minutes > 59) return null
        date.setHours(hours, minutes)
      }
      return date
    }
    // Прочее — только ISO с временем. Произвольные строки `new Date` тоже
    // «понимает», но по правилам движка, а не по договорённости кита.
    if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(text)) return null
    const date = new Date(text)
    return Number.isNaN(date.getTime()) ? null : date
  }
  return null
}

/** Местная полночь дня; `null`, если такого дня нет (31.02, 13-й месяц). */
function calendarDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null
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
  parseNumericText,
  toNumber,
  withSign,
}
