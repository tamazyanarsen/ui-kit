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
const DATE_SEPARATORS = [".", "/", "-"]

function prepareDate(
  chars: string,
  masked: { unmaskedValue: string; value: string },
  flags?: { tail?: boolean }
): string | [string, InstanceType<typeof IMask.ChangeDetails>] {
  if (flags?.tail) return chars
  const typed = masked.unmaskedValue
  // Набор с клавиатуры: разделитель после одной цифры дня или месяца
  // дописывает к ней ведущий ноль — «10.1.2026» это 10.01.2026. Раньше
  // маска отбрасывала разделитель (блок ещё не заполнен), и цифры уезжали в
  // соседний блок: «10.1.2026» становилось «10.12.026», а DatePicker молча
  // терял дату (аудит 22). Цифра уже стоит в поле, поэтому значение
  // переписывается, а каретка сдвигается на дописанный ноль — как у часа во
  // времени (`prepareTime`).
  if (chars.length === 1 && DATE_SEPARATORS.includes(chars)) {
    // Одинокий «0» ведущим нулём не дополняется: «00» — не день и не месяц.
    if ((typed.length === 1 || typed.length === 3) && typed.slice(-1) !== "0") {
      masked.value = typed.slice(0, -1) + "0" + typed.slice(-1)
      return ["", new IMask.ChangeDetails({ tailShift: 1 })]
    }
    return chars
  }
  // Первая цифра дня 4–9 и месяца 2–9 без ведущего нуля недопустима: «4» — это
  // «04», а не начало «4x». Дописывает `prepareDate`, как `prepareTime` у часа.
  if (/^\d$/.test(chars)) {
    if (typed.length === 0 && chars >= "4") return "0" + chars
    if (typed.length === 2 && chars >= "2") return "0" + chars
  }
  if (typed) return chars
  const text = chars.trim()
  const pad = (part: string) => part.padStart(2, "0")
  // Год в начале — с любым из разделителей «-», «/», «.»: «2026-01-10»,
  // «2026/01/10», «2026.1.5».
  // Целая дата с днём вне 1–31 или месяцем вне 1–12 не принимается вовсе:
  // разложенная по блокам, она превращалась бы в другую, но правдоподобную
  // дату («45.13.2024» → «13.02.4»).
  const whole = (day: string, month: string, year: string) =>
    Number(day) >= 1 && Number(day) <= 31 && Number(month) >= 1 && Number(month) <= 12
      ? pad(day) + pad(month) + year
      : ""
  const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s].*)?$/.exec(text)
  if (iso) return whole(iso[3], iso[2], iso[1])
  const ru = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(text)
  if (ru) return whole(ru[1], ru[2], ru[3])
  const digits = /^(\d{2})(\d{2})(\d{4})$/.exec(text)
  if (digits) return whole(digits[1], digits[2], digits[3])
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
 *
 * Двоеточие после одной цифры часа тоже дополняет её нулём: «1:05» — это
 * 01:05. Раньше маска отбрасывала «:» (блок часов ещё не заполнен), и
 * следующие цифры уходили в часы — «1:05» становилось «10:5». Если цифра
 * пришла в этом же куске (вставка), ноль дописывается перед ней; если она
 * уже в поле (набор по символу), значение поля переписывается на «0X».
 */
const TIME_SEPARATORS = [":", ".", "-", " "]

function prepareTime(
  chars: string,
  masked: { unmaskedValue: string; value: string },
  flags?: { tail?: boolean }
): string | [string, InstanceType<typeof IMask.ChangeDetails>] {
  if (flags?.tail) return chars
  const initial = masked.unmaskedValue
  // Целое время вне 00:00–23:59, вставленное в пустое поле («24:00»,
  // «25:61», «2460»), не принимается вовсе: разложенное по блокам, оно
  // превращалось в другое правдоподобное («24:00» → «02:40»).
  if (!initial) {
    const whole =
      /^\s*(\d{1,2})\s*[:.\-\s]\s*(\d{1,2})\s*$/.exec(chars) ??
      /^(\d{2})(\d{2})$/.exec(chars)
    if (whole && (Number(whole[1]) > 23 || Number(whole[2]) > 59)) return ""
  }
  let accepted = initial
  let out = ""
  // Ноль, дописанный перед уже стоящей в поле цифрой, сдвигает каретку:
  // без этого она оставалась между «0» и цифрой, и следующие цифры
  // вставлялись туда же («1:05» → «00:51»).
  let shift = 0
  for (const ch of chars) {
    const n = accepted.length
    // Разделителем часов и минут пишут не только «:», но и «.», «-» или
    // пробел: «1.05» — это тоже 01:05, а не «10:5» (аудит 21).
    if (TIME_SEPARATORS.includes(ch) && n === 1) {
      if (initial.length === 0) {
        const at = out.lastIndexOf(accepted)
        out = out.slice(0, at) + "0" + out.slice(at)
      } else {
        masked.value = "0" + accepted
        shift += 1
      }
      accepted = "0" + accepted
    } else if (!/\d/.test(ch)) out += ch
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
  return shift ? [out, new IMask.ChangeDetails({ tailShift: shift })] : out
}

/**
 * Сумма без копеек (`scale: 0`): набранные с клавиатуры «,» или «.» маска
 * отбрасывала, а следующие цифры дописывала к целой части — «1234,56»
 * становилось «123 456», сумма молча вырастала в 100 раз (аудит 21). При
 * вставке той же строки imask копейки просто отбрасывает («1 234»), так что
 * набор приведён к тому же: после разделителя цифры в конец не принимаются,
 * пока значение не изменилось иначе (стёрли цифру, правка в середине —
 * тогда значение перед вставкой уже другое, и запрет снимается).
 *
 * Запрет живёт и только пока фокус не ушёл: иначе «1234,», уход из поля,
 * возврат и «5» молча не принимали цифру (проверка правок r22). Снимается
 * любым `focusout` в документе — маска не знает своего поля.
 */
let amountSeparatorAt = new WeakMap<object, string>()
let amountFocusWatch = false

function watchAmountFocus() {
  if (amountFocusWatch || typeof document === "undefined") return
  amountFocusWatch = true
  document.addEventListener(
    "focusout",
    () => {
      amountSeparatorAt = new WeakMap()
    },
    true
  )
}

function prepareAmount(
  chars: string,
  masked: { value: string },
  flags?: { tail?: boolean }
): string {
  if (flags?.tail) return chars
  if (chars === "," || chars === ".") {
    watchAmountFocus()
    amountSeparatorAt.set(masked, masked.value)
    return chars
  }
  const guard = amountSeparatorAt.get(masked)
  if (guard === undefined) return chars
  if (/^\d+$/.test(chars) && guard === masked.value) return ""
  amountSeparatorAt.delete(masked)
  return chars
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
  // Дата, как и время, держит диапазоны на вводе: день 01–31, месяц 01–12
  // Лишнюю цифру блок отвергает, как у времени (`autofix` не нужен: он бы
  // молча подменял «13» месяцем «12»); ведущий ноль дописывает `prepareDate`.
  // Год — четыре произвольные цифры; несуществующие сочетания вроде 31.02
  // отсеивает разбор даты (`parseDateRu`).
  if (name === "date") {
    return {
      mask: "DD.MM.YYYY",
      prepare: prepareDate,
      blocks: {
        DD: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2,
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2,
        },
        YYYY: { mask: "0000" },
      },
    }
  }
  if (name === "amount") {
    return {
      mask: IMask.MaskedNumber,
      prepare: prepareAmount,
      thousandsSeparator: " ",
      scale: 0,
      min: 0,
      radix: ",",
    }
  }
  return { mask: PATTERNS[name] }
}
