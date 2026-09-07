import { NBSP, unitSeparator } from "@/lib/number-format"

// Форматирование чисел и дат песочниц одним модулем.
//
// Заведено потому, что своим `Intl`-вызовом на экран деньги в двух местах
// одной страницы разъезжались по числу знаков после запятой — ровно тот
// дефект, из-за которого в таблице появился слой типов полей (см.
// `table/field-types.ts`). Здесь та же мысль для нетабличного содержимого.

const MONEY = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const INTEGER = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

/** «30 000 000,00 ₽» — с неразрывным пробелом перед знаком валюты. */
function money(value: number, currency = "₽") {
  return `${MONEY.format(value)}${NBSP}${currency}`
}

/** «5 859,0 млн ₽» — крупные суммы отчётов. */
function millions(value: number, digits = 1) {
  const text = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
  return `${text}${NBSP}млн${NBSP}₽`
}

/** «30 000 000» — без дробной части и без знака валюты. */
function integer(value: number) {
  return INTEGER.format(value)
}

/**
 * «22,04%» — процент ВПЛОТНУЮ к числу.
 *
 * Отбивка берётся у кита (`unitSeparator`), а не пишется здесь руками:
 * правило гласит «кит ставит `%`, `‰`, `°` вплотную к числу и через
 * неразрывный пробел только знак валюты и единицы вроде „шт.“». Своя
 * константа тут однажды разошлась бы с таблицей `TIGHT_UNITS`.
 */
function percent(value: number, digits = 2) {
  const text = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
  return `${text}${unitSeparator("%")}%`
}

/** «27.09.2026». */
function date(value: Date) {
  return value.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/** Дата плюс N дней — новый объект, исходный не трогаем. */
function addDays(value: Date, days: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + days)
  return next
}

/**
 * Ближайший рабочий день, не раньше переданного.
 *
 * Нужен там, где подпись поля прямо обещает правило: «В выходные/праздники
 * дата возврата переносится на следующий рабочий день». Без переноса
 * подпись на экране была бы ложной — а песочница ровно для того и стоит,
 * чтобы такие обещания проверялись живьём. Праздники не считаем: на них
 * нужен производственный календарь, и он в задачи кита не входит.
 */
function nextWorkingDay(value: Date) {
  const next = new Date(value)
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1)
  }
  return next
}

/**
 * Разбор суммы, введённой в поле с маской: «30 000 000,00 ₽» → 30000000.
 * Пустая строка — 0, чтобы место использования не проверяло `NaN`.
 */
function parseAmount(text: string) {
  const digits = text.replace(/[^\d,.-]/g, "").replace(",", ".")
  const value = Number.parseFloat(digits)
  return Number.isFinite(value) ? value : 0
}

export {
  addDays,
  date,
  integer,
  millions,
  money,
  nextWorkingDay,
  parseAmount,
  percent,
}
