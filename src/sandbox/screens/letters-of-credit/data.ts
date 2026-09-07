import type { TagColor } from "@/components/ui/tag"

// Данные экрана D2 — с эталона 70371:24871.
//
// Двести строк, а не девять нарисованных: на девяти ни пагинатор, ни
// «Выбрать на всех страницах (N)», ни сортировка себя не показывают, а
// проверять экран надо именно этим. Набор детерминированный (без Math.random)
// — иначе каждый рендер истории давал бы новую таблицу, и сравнивать
// скриншоты было бы не с чем.

type LoanStatus =
  | "ready"
  | "signing"
  | "review"
  | "accepted"
  | "declined"

const STATUS_LABELS: Record<LoanStatus, string> = {
  ready: "Готов к подписанию",
  signing: "Подписание",
  review: "Проверка",
  accepted: "Принято банком",
  declined: "Отклонено",
}

const STATUS_COLORS: Record<LoanStatus, TagColor> = {
  ready: "orange",
  signing: "orange",
  review: "orange",
  accepted: "green",
  declined: "red",
}

const KINDS = [
  "Внутрироссийский покрытый (отзывный)",
  "Внутрироссийский покрытый (безотзывный)",
  "Внутрироссийский непокрытый",
  "Импортный покрытый",
  "Импортный непокрытый",
]

const REQUEST_TYPES = ["Открытие", "Изменение", "Закрытие"]

const BENEFICIARIES = [
  'ООО "Металлургический завод"',
  'ИП "Иванов Иван Иванович"',
  'АО "Нефтеперерабатывающий завод имени Владимира Ильича"',
  'ООО "Северострой"',
]

const BANKS = [
  'АО "Альфа-Банк"',
  'ПАО "Сбербанк"',
  'Банк ДОМ.РФ',
  'АО "Райффайзенбанк"',
]

const STATUSES: LoanStatus[] = [
  "ready",
  "ready",
  "signing",
  "review",
  "review",
  "accepted",
  "accepted",
  "accepted",
  "declined",
]

const AMOUNTS = [1_200_000, 20_000_000, 300_000_000, 48_500_000, 7_400_000]
const TERMS = [90, 180, 30, 365]

interface LetterOfCreditRow {
  id: string
  status: LoanStatus
  number: string
  date: string
  kind: string
  requestType: string
  amount: number
  term: number
  beneficiary: string
  bank: string
}

/** 200 строк — ровно то число, которое эталон печатает в «Результатов». */
const LETTERS_OF_CREDIT: LetterOfCreditRow[] = Array.from(
  { length: 200 },
  (_, index) => {
    const day = (index % 28) + 1
    const month = index % 3 === 0 ? 1 : 2
    return {
      id: String(index + 1),
      status: STATUSES[index % STATUSES.length]!,
      number: index % 2 === 0 ? "321" : String(1234567 + index),
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      kind: KINDS[index % KINDS.length]!,
      requestType: REQUEST_TYPES[index % REQUEST_TYPES.length]!,
      amount: AMOUNTS[index % AMOUNTS.length]!,
      term: TERMS[index % TERMS.length]!,
      beneficiary: BENEFICIARIES[index % BENEFICIARIES.length]!,
      bank: BANKS[index % BANKS.length]!,
    }
  }
)

export {
  BANKS,
  BENEFICIARIES,
  KINDS,
  LETTERS_OF_CREDIT,
  REQUEST_TYPES,
  STATUS_COLORS,
  STATUS_LABELS,
}
export type { LetterOfCreditRow, LoanStatus }
