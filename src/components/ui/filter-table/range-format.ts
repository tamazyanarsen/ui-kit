import type * as React from "react"

import { NBSP } from "@/lib/number-format"

// Подписи и проверка FilterRange — отдельным модулем, чтобы правила читались
// целиком и проверялись без отрисовки.

interface RangeValue {
  from: string
  to: string
}

/** Текст ошибки диапазона — «универсальный», под вторым полем. */
const RANGE_ERROR = "Значение «до» должно быть больше значения «от»"

/** Только цифры: денежный режим хранит и отдаёт наружу сырые цифры. */
function digitsOnly(text: string) {
  return text.replace(/\D/g, "")
}

/** «3000000» → «3 000 000» (разряды — неразрывным пробелом). */
function groupDigits(digits: string) {
  const plain = digits.replace(/^0+(?=\d)/, "")
  return plain.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
}

function parseNumber(text: string, amount: boolean) {
  const normalized = amount
    ? digitsOnly(text)
    : text.replace(/[\s  ]/g, "").replace(",", ".")
  if (!normalized) return null
  const number = Number(normalized)
  return Number.isFinite(number) ? number : null
}

/**
 * «До» меньше «от» — диапазон пуст.
 *
 * Правки UI-Kit от 25.10: проверка встроена в фильтр (раньше её считал
 * экран и передавал через `error`, а неверный диапазон всё равно
 * применялся). Равные значения — не ошибка: это фильтр по одному значению.
 * Нечисловой текст (поле без маски) не проверяется.
 */
function isRangeInverted(value: RangeValue, amount: boolean) {
  const from = parseNumber(value.from, amount)
  const to = parseNumber(value.to, amount)
  return from !== null && to !== null && to < from
}

/**
 * Подпись выбранного фильтра: полная форма и короткая (если полная не
 * помещается в чип).
 *
 * Денежный режим (Правки UI-Kit от 25.10, по макету FilterRange):
 *   • одно значение (от = до) — «Доступный лимит: 3 000 ₽», коротко «3 000 ₽»;
 *   • диапазон — «Доступный лимит: 3 000 – 300 000 ₽», коротко
 *     «3 000 – 300 000 ₽»;
 *   • только «от» — «От 3 000 ₽», только «до» — «До 3 000 ₽».
 * Без денежного режима — прежние подписи как введено: «3000 – 300000»,
 * «От 3000».
 */
function rangeValueLabel({
  value,
  label,
  fromLabel,
  toLabel,
  amount,
}: {
  value: RangeValue
  label: React.ReactNode
  fromLabel: string
  toLabel: string
  amount: boolean
}): { full?: string; short?: string } {
  const from = value.from.trim()
  const to = value.to.trim()
  if (!amount) {
    if (from && to) return { full: `${from} – ${to}` }
    if (from) return { full: `${fromLabel} ${from}` }
    if (to) return { full: `${toLabel} ${to}` }
    return {}
  }
  const unit = `${NBSP}₽`
  const fromText = groupDigits(digitsOnly(from))
  const toText = groupDigits(digitsOnly(to))
  const named = (text: string) =>
    typeof label === "string" ? { full: `${label}: ${text}`, short: text } : { full: text }
  if (fromText && toText) {
    return fromText === toText
      ? named(`${fromText}${unit}`)
      : named(`${fromText} – ${toText}${unit}`)
  }
  if (fromText) return { full: `${fromLabel} ${fromText}${unit}` }
  if (toText) return { full: `${toLabel} ${toText}${unit}` }
  return {}
}

export { RANGE_ERROR, digitsOnly, groupDigits, isRangeInverted, rangeValueLabel }
export type { RangeValue }
