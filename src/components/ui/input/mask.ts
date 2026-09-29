import { IMask } from "react-imask"

import { NARROW_NBSP, NBSP } from "@/lib/number-format"

// Тонкий слой настроек над react-imask (обёрткой ядра imask.js).
// Самодельное маскирование давало классические ошибки: литеральные цифры
// фиксированного префикса вроде «+7» у телефона принимались за ввод
// пользователя, каретка прыгала в конец и ломала backspace и delete в
// середине строки. Зрелая и широко используемая библиотека маскирования всё
// это уже решает правильно. В этом файле лежат только заготовки по полям;
// сводит их с <IMaskInput> из react-imask файл
// src/components/ui/input/input.tsx.
export type DigitMaskName =
  | "phone"
  | "date"
  | "passport"
  | "foreign-passport"
  | "card"
  | "account"
  | "inn"
  | "kpp"
  | "kbk"

export type MaskName = DigitMaskName | "amount" | "time"

// «0» — одна позиция под цифру; любой другой символ является
// фиксированным литералом (определения символов шаблона в imask по
// умолчанию).
const PATTERNS: Record<DigitMaskName, string> = {
  phone: "+7 000 000-00-00",
  date: "00.00.0000",
  passport: "0000 000000",
  "foreign-passport": "00 0000000",
  card: "0000 0000 0000 0000",
  // Расчётный счёт: 20 цифр, группировка 5-3-1-11.
  account: "00000 000 0 00000000000",
  inn: "000000000000",
  kpp: "000000000",
  // КБК: 20 цифр, группировка 3-1-2-5-2-4-3.
  kbk: "000 0 00 00000 00 0000 000",
}

// Показывается нативным placeholder, когда поле пусто; обычно это сам
// шаблон, кроме Date (там литеральный текст подсказки) и Amount.
const PLACEHOLDERS: Record<MaskName, string> = {
  ...PATTERNS,
  date: "ДД.ММ.ГГГГ",
  amount: "0 ₽",
  time: "ЧЧ:ММ",
}

/**
 * Разрядные разделители, которые НЕ должны попадать в буфер обмена
 * (см. `useCopyWithoutSeparators`).
 *
 * ⚠️ Разделитель объявляет КАЖДАЯ маска, и списка по умолчанию нет: у суммы
 * и номера карты это пробел, у телефона ещё и дефис — снять один пробел
 * значило бы отдать `+7912345-67-89`, то есть полуформат.
 *
 * Маски, которых здесь нет, копируются как есть: паспорт, счёт, ИНН, КПП,
 * КБК и дата — это не отбивка по разрядам, а формат самого номера, и без
 * пробелов он читается хуже, а не лучше. Свободное поле без маски тем более
 * трогать нельзя — умолчание «снимать» превращало адрес в
 * «Дом 12345 корп 2».
 */
export const MASK_GROUP_SEPARATORS: Partial<
  Record<MaskName, readonly string[]>
> = {
  amount: [" ", NBSP, NARROW_NBSP],
  card: [" "],
  phone: [" ", "-"],
}

export function getMaskPlaceholder(name: MaskName): string {
  return PLACEHOLDERS[name]
}

/**
 * Прогнать сырое значение через маску — ровно то, что покажет поле.
 *
 * Нужно там, где значение приходит СНАРУЖИ (`value`/`defaultValue`), а не с
 * клавиатуры: `onAccept` на такое не срабатывает, и всё, что считает по
 * значению (замер ширины числа у маски суммы), считало бы по сырой строке.
 * Дизайн-чек от 13.09, замечание 1: «30000000» уже 92px, а показанное
 * «30 000 000» — 100px, и знак «₽» вставал ровно на последнюю цифру.
 */
export function formatWithMask(name: MaskName, raw: string): string {
  if (!raw) return raw
  try {
    return IMask.pipe(
      raw,
      getImaskProps(name) as Parameters<typeof IMask.pipe>[1]
    )
  } catch {
    return raw
  }
}

/**
 * Ведущая «8» в номере телефона — это префикс междугородней связи, а не
 * первая цифра кода: «89123456789» значит «+7 912 345-67-89». Шаблон
 * «+7 000…» об этом не знает и клал «8» в код оператора, теряя последнюю
 * цифру, — номер молча становился другим.
 *
 * Нормализуется только ввод целым куском: вставка, автозаполнение и
 * значение снаружи — 11 цифр, начинающихся с 8 (или 7), в пустое поле.
 * Набор с клавиатуры не трогается: по одной цифре не отличить префикс от
 * кода на 8 (800, 812), и лишняя цифра в конце полного номера должна
 * отбрасываться, а не сдвигать его в другой номер.
 */
function preparePhone(
  chars: string,
  masked: { unmaskedValue: string },
  flags?: { tail?: boolean }
): string {
  if (flags?.tail || masked.unmaskedValue) return chars
  const digits = chars.replace(/\D/g, "")
  return digits.length === 11 && /^[78]/.test(digits) ? digits.slice(1) : chars
}

/**
 * Дата, вставленная целым куском в другом формате: ISO «2026-01-10» (в том
 * числе со временем «2026-01-10T12:00») и «1.1.2026» / «1/1/2026» без
 * ведущих нулей. Шаблон «00.00.0000» раскладывал такие строки по цифрам
 * подряд — «2026-01-10» становилось «20.26.0110», а DatePicker при уходе с
 * поля молча отбрасывал значение.
 *
 * Как у телефона — только ввод целым куском в пустое поле (вставка,
 * автозаполнение, значение снаружи); набор с клавиатуры не трогается.
 */
function prepareDate(
  chars: string,
  masked: { unmaskedValue: string },
  flags?: { tail?: boolean }
): string {
  if (flags?.tail || masked.unmaskedValue) return chars
  const text = chars.trim()
  const pad = (part: string) => part.padStart(2, "0")
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/.exec(text)
  if (iso) return pad(iso[3]) + pad(iso[2]) + iso[1]
  const ru = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(text)
  if (ru) return pad(ru[1]) + pad(ru[2]) + ru[3]
  return chars
}

/**
 * Время: первая цифра, с которой двузначного значения не бывает, получает
 * ведущий ноль — час 3–9 становится «03»–«09», первая цифра минут 6–9 —
 * «06»–«09». «930» даёт «09:30». Без этого час одной цифрой не принимался
 * вовсе, а остаток ввода превращался в мусор («930» → «0»).
 *
 * Только дополнение: недопустимая вторая цифра («24», «25») отвергается
 * блоками MaskedRange как раньше. Поэтому ведётся счёт уже принятых цифр,
 * а отвергнутые символы передаются маске как есть.
 */
function prepareTime(
  chars: string,
  masked: { unmaskedValue: string },
  flags?: { tail?: boolean }
): string {
  if (flags?.tail) return chars
  let accepted = masked.unmaskedValue
  let out = ""
  for (const ch of chars) {
    const n = accepted.length
    if (!/\d/.test(ch)) out += ch
    else if ((n === 0 && ch >= "3") || (n === 2 && ch >= "6")) {
      out += "0" + ch
      accepted += "0" + ch
    } else if (n >= 4 || (n === 1 && accepted === "2" && ch > "3")) {
      out += ch
    } else {
      out += ch
      accepted += ch
    }
  }
  return out
}

// Пропсы для подстановки в <IMaskInput mask={...} /> из react-imask.
// Amount маскирует только само число (MaskedNumber из imask — правильная
// разбивка по тысячам и обработка каретки), а «₽» рисует Input отдельным
// фиксированным узлом рядом с полем, а не замыкающим литералом в шаблоне.
// Дело в том, что imask не умеет разрешать фиксированный суффикс *после*
// открытого числового блока (нет определённой точки, где «число»
// заканчивается), и запись вроде `mask: "num ₽"` с вложенным блоком молча
// никогда не дописывает суффикс — проверено руками, прежде чем остановиться
// на варианте с внешним узлом.
export function getImaskProps(name: MaskName) {
  // Время сделано маской из двух диапазонов, а не плоским шаблоном
  // «00:00»: по макету («Поле ввода времени») компонент сам форматирует
  // введённое в ЧЧ:ММ и сам вставляет «:», а это ровно то, что делают блоки
  // MaskedRange в imask. Вдобавок они удерживают значение настоящим
  // временем, отказываясь принять час больше 23 или минуту больше 59, тогда
  // как плоский цифровой шаблон спокойно принял бы 99:99.
  //
  // Ведущий ноль у часа и минут дописывает `prepareTime`.
  if (name === "time") {
    return {
      mask: "HH:MM",
      prepare: prepareTime,
      blocks: {
        HH: { mask: IMask.MaskedRange, from: 0, to: 23, maxLength: 2 },
        MM: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
      },
    }
  }
  if (name === "phone") return { mask: PATTERNS.phone, prepare: preparePhone }
  if (name === "date") return { mask: PATTERNS.date, prepare: prepareDate }
  if (name === "amount") {
    return {
      mask: IMask.MaskedNumber,
      thousandsSeparator: " ",
      scale: 0,
      min: 0,
      radix: ",",
    }
  }
  return { mask: PATTERNS[name] }
}
