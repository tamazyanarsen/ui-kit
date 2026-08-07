import { IMask } from "react-imask"

// Thin config layer over react-imask (wraps the imask.js core) — hand-rolled
// masking got the classic bugs (literal digits in a fixed prefix like
// phone's "+7" being mistaken for user input, caret jumping to the end and
// breaking mid-string backspace/delete) wrong in ways a mature, widely-used
// masking library already solves correctly. This file only holds the
// per-field presets; src/components/ui/input/input.tsx wires them into
// react-imask's <IMaskInput>.
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

// '0' = one digit slot; any other character is a fixed literal (imask's
// default pattern-char definitions).
const PATTERNS: Record<DigitMaskName, string> = {
  phone: "+7 000 000-00-00",
  date: "00.00.0000",
  passport: "0000 000000",
  "foreign-passport": "00 0000000",
  card: "0000 0000 0000 0000",
  // Russian bank account: 20 digits, grouped 5-3-1-11.
  account: "00000 000 0 00000000000",
  inn: "000000000000",
  kpp: "000000000",
  // Budget classification code: 20 digits, grouped 3-1-2-5-2-4-3.
  kbk: "000 0 00 00000 00 0000 000",
}

// Shown as the native placeholder when the field is empty — usually just
// the pattern itself, except Date (literal hint text) and Amount.
const PLACEHOLDERS: Record<MaskName, string> = {
  ...PATTERNS,
  date: "ДД.ММ.ГГГГ",
  amount: "0 ₽",
  time: "ЧЧ:ММ",
}

export function getMaskPlaceholder(name: MaskName): string {
  return PLACEHOLDERS[name]
}

// Props to spread onto react-imask's <IMaskInput mask={...} />. Amount only
// masks the number itself (imask's MaskedNumber — correct thousand-grouping
// and caret handling); the "₽" is rendered by Input as a separate fixed
// node next to the field rather than a trailing literal in the pattern.
// imask doesn't resolve a fixed suffix *after* an open-ended Number block
// (there's no defined point where "the number" is finished), so composing
// it as `mask: "num ₽"` with a nested block silently never appends the
// suffix — confirmed by hand before settling on the external-node approach.
export function getImaskProps(name: MaskName) {
  // Time is a two-range mask rather than a flat "00:00" pattern: the spec
  // ("Поле ввода времени", node 70240:21250) says the component formats what
  // you type into ЧЧ:ММ and inserts the ":" itself, which is exactly what
  // imask's MaskedRange blocks do — and they additionally keep the value a
  // real time by refusing an hour past 23 or a minute past 59, where a flat
  // digit pattern would happily accept 99:99.
  if (name === "time") {
    return {
      mask: "HH:MM",
      blocks: {
        HH: { mask: IMask.MaskedRange, from: 0, to: 23, maxLength: 2 },
        MM: { mask: IMask.MaskedRange, from: 0, to: 59, maxLength: 2 },
      },
    }
  }
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
