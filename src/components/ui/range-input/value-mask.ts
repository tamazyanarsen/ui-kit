import { IMask } from "react-imask"

import { getImaskProps } from "@/components/ui/input/mask"
import { unitSeparator } from "@/lib/number-format"

/**
 * Маска значения Range Input — дизайн-чек 08.10, замечание 31: «Range должен
 * поддерживать маски (валюта и другие единицы)… и ввод с клавиатуры».
 *
 * Число маскируется той же заготовкой, что и сумма у Input
 * (`getImaskProps("amount")` из `input/mask.ts`: разряды пробелом, запятая
 * дробной части, защита от «1234,56» → «123 456»). Знак единицы, как и у
 * Input, стоит ОТДЕЛЬНЫМ узлом после числа: imask не умеет фиксированный
 * суффикс после открытого числового блока.
 *
 * Откуда берутся знак и число знаков после запятой:
 *   • `mask="amount"` — рубли без копеек, «400 000 ₽» (как в документации
 *     компонента: «Введённая сумма… округлится до 1000 ₽»);
 *   • `format` (Intl.NumberFormatOptions) — знак из `formatToParts` в
 *     `ru-RU` (валюта, единица, процент), дробная часть из его же
 *     `minimum/maximumFractionDigits`;
 *   • `unit` — любая своя единица («дн.», «мес.») поверх обоих.
 *
 * ⚠️ Раньше значение печатал `Intl` в ЛОКАЛИ БРАУЗЕРА: в англоязычном
 * Chrome «23700000» выходило «23,700,000», и дизайнер читал «,000» как три
 * нуля после запятой. Теперь разряды и запятая — всегда по-русски.
 */
interface RangeValueMaskOptions {
  mask?: "amount"
  format?: Intl.NumberFormatOptions
  unit?: string
  min: number
}

interface RangeValueSpec {
  /** Знак после числа вместе с отбивкой (`" ₽"`, `"%"`) или пустая строка. */
  suffix: string
  /** Знаков после запятой: сколько разрешено набрать и сколько показать. */
  scale: number
  minFraction: number
  imask: Record<string, unknown>
}

const AMOUNT_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
}

/** Знак единицы из `Intl` — то, что стоит после (или до) числа. */
function signFromFormat(format: Intl.NumberFormatOptions) {
  try {
    return new Intl.NumberFormat("ru-RU", format)
      .formatToParts(1)
      .filter((part) => ["currency", "unit", "percentSign"].includes(part.type))
      .map((part) => part.value)
      .join("")
      .trim()
  } catch {
    return ""
  }
}

function fractionFromFormat(format: Intl.NumberFormatOptions | undefined) {
  if (!format) return { scale: 0, minFraction: 0 }
  try {
    const resolved = new Intl.NumberFormat("ru-RU", format).resolvedOptions()
    return {
      scale: resolved.maximumFractionDigits ?? 0,
      minFraction: resolved.minimumFractionDigits ?? 0,
    }
  } catch {
    return { scale: 0, minFraction: 0 }
  }
}

function rangeValueSpec({ mask, format, unit, min }: RangeValueMaskOptions): RangeValueSpec {
  const source = mask === "amount" ? { ...AMOUNT_FORMAT, ...format } : format
  // Процент в `style: "percent"` умножает значение на 100 — ползунку это не
  // подходит (его значение уже в процентах), поэтому от формата берётся
  // только знак, а число — как есть.
  const sign = unit ?? (source ? signFromFormat(source) : "")
  const { scale, minFraction } = fractionFromFormat(source)
  return {
    suffix: sign ? `${unitSeparator(sign)}${sign}` : "",
    scale,
    minFraction,
    imask: {
      ...getImaskProps("amount"),
      scale,
      // Ползунок может начинаться ниже нуля — маска не должна это резать.
      min: Math.min(0, min),
      mapToRadix: ["."],
      padFractionalZeros: minFraction > 0,
      normalizeZeros: true,
    },
  }
}

/** Число → строка маски («23 700 000», «12,50»). */
function formatRangeValue(spec: RangeValueSpec, value: number) {
  if (!Number.isFinite(value)) return ""
  const fixed = value.toFixed(spec.scale)
  // Ведущие нули дробной части сверх обязательных не показываются: 12,50 при
  // minFraction 0 — «12,5».
  const trimmed =
    spec.scale > spec.minFraction
      ? fixed.replace(new RegExp(`(\\.\\d{${spec.minFraction}}\\d*?)0+$`), "$1").replace(/\.$/, "")
      : fixed
  try {
    return IMask.pipe(
      trimmed.replace(".", ","),
      spec.imask as Parameters<typeof IMask.pipe>[1]
    )
  } catch {
    return trimmed
  }
}

/** Строка маски → число или `null`, если набрано не число. */
function parseRangeValue(text: string) {
  const normalized = text.replace(/[\s  ]/g, "").replace(",", ".")
  if (!/^-?\d+(\.\d*)?$/.test(normalized)) return null
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

/** Ограничить диапазоном и, если задан, привязать к шагу. */
function clampToRange(value: number, min: number, max: number, step?: number) {
  let next = Math.min(max, Math.max(min, value))
  if (step && step > 0) {
    next = min + Math.round((next - min) / step) * step
    // Шаг не делит диапазон нацело — последнее деление всё равно `max`.
    next = Math.min(max, next)
    // Хвост двоичной дроби (0.1 + 0.2): округляем до точности шага.
    const decimals = (String(step).split(".")[1] ?? "").length
    next = Number(next.toFixed(decimals))
  }
  return next
}

export { clampToRange, formatRangeValue, parseRangeValue, rangeValueSpec }
export type { RangeValueSpec, RangeValueMaskOptions }
