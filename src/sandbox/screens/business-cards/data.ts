import type { PaymentSystem } from "@/components/ui/thumbnail"
import type { TagColor } from "@/components/ui/tag"
import type { TableField } from "@/components/ui/table"

// Данные экранов D6 и D7 — с эталонов 70371:24883 и 70371:25281.

type CardStatus = "needs-activation" | "active" | "blocked" | "limited"

const CARD_STATUS_LABELS: Record<CardStatus, string> = {
  "needs-activation": "Требует активации",
  active: "Активна",
  blocked: "Заблокирована",
  limited: "Ограничения",
}

const CARD_STATUS_COLORS: Record<CardStatus, TagColor> = {
  "needs-activation": "orange",
  active: "green",
  blocked: "red",
  limited: "orange",
}

interface BusinessCardRow {
  id: string
  title: string
  last4: string
  status: CardStatus
  holder: string
  account: string
  paymentSystem: PaymentSystem
  closed: boolean
}

const TITLES = [
  "MasterCard Business",
  "Оплата расходов",
  "МИР Classic Business",
  "MIR Classic Business",
  "Для аренды",
  "Командировки",
]
const HOLDERS = [
  "КОНСТАНТИНОПОЛЬСКИЙ КОНСТАНТИН КОНСТАНТИНОВИЧ",
  "ИВАНОВ ИВАН ИВАНОВИЧ",
  "ПЕТРОВ ПЕТР АЛЕКСЕЕВИЧ",
]
const STATUSES: CardStatus[] = [
  "needs-activation",
  "needs-activation",
  "active",
  "active",
  "blocked",
  "limited",
]
const SYSTEMS: PaymentSystem[] = ["mastercard", "mir", "mir", "mir", "visa"]

/** 200 карт — число из строки «Результатов» эталона. */
const BUSINESS_CARDS: BusinessCardRow[] = Array.from(
  { length: 200 },
  (_, index) => ({
    id: String(index + 1),
    title: TITLES[index % TITLES.length]!,
    last4: String(4135 + (index % 900) * 3).slice(0, 4),
    status: STATUSES[index % STATUSES.length]!,
    holder: HOLDERS[index % HOLDERS.length]!,
    account: `40702 810 7 0059006${2400 + (index % 200)}`,
    paymentSystem: SYSTEMS[index % SYSTEMS.length]!,
    // Каждая десятая карта закрыта — вкладка «Закрытые» не должна быть
    // пустой, а вкладка, которая всегда пуста, ничего не проверяет.
    closed: index % 10 === 9,
  })
)

interface OperationRow {
  id: string
  date: string
  time: string
  amount: number
  transactionDate?: string
  transactionTime?: string
  operation: string
  mcc: string
}

const OPERATIONS: OperationRow[] = [
  { id: "1", date: "25.07.2025", time: "17:58", amount: -1_200_000, operation: "Оплата ООО «Ромашка»", mcc: "MCC 4215 - Сервис" },
  { id: "2", date: "24.07.2025", time: "11:22", amount: -88_133, operation: "Оплата ООО «Ромашка»", mcc: "MCC 4215 - Сервис" },
  { id: "3", date: "23.07.2025", time: "12:43", amount: -31_201_133, transactionDate: "23.07.2025", transactionTime: "12:57", operation: "Оплата ООО «Ромашка»", mcc: "MCC 4215 - Сервис" },
  { id: "4", date: "23.07.2025", time: "12:43", amount: 31_201_133, transactionDate: "23.07.2025", transactionTime: "12:55", operation: "Пополнение через банкомат", mcc: "ATM 77030804" },
  { id: "5", date: "22.07.2025", time: "09:14", amount: -450_000, transactionDate: "22.07.2025", transactionTime: "09:20", operation: "Оплата ООО «Топливо»", mcc: "MCC 5541 - АЗС" },
  { id: "6", date: "21.07.2025", time: "18:02", amount: -12_400, operation: "Оплата ООО «Канцтовары»", mcc: "MCC 5943 - Канцелярия" },
  { id: "7", date: "20.07.2025", time: "10:31", amount: 5_000_000, transactionDate: "20.07.2025", transactionTime: "10:33", operation: "Пополнение со счёта", mcc: "Внутрибанковский перевод" },
  { id: "8", date: "19.07.2025", time: "15:47", amount: -230_500, operation: "Оплата ООО «Логистика»", mcc: "MCC 4214 - Перевозки" },
]

/** «25.07.2025» → сортируемое число. */
function dateKey(row: OperationRow) {
  const [day, month, year] = row.date.split(".")
  return Number(`${year}${month}${day}${row.time.replace(":", "")}`)
}

const OPERATION_FIELDS: TableField<OperationRow>[] = [
  {
    key: "date",
    title: "Дата операции",
    width: 180,
    sortable: true,
    description: (row) => row.time,
    // Сравнение ЧИСЛОМ, а не строкой: «25.07.2025» и «03.08.2025» как
    // строки идут в обратном порядке — день впереди месяца. На восьми
    // строках одного месяца этого не видно, поэтому и легко пропустить.
    compare: (a, b) => dateKey(a) - dateKey(b),
  },
  {
    key: "amount",
    title: "Сумма",
    type: "money",
    width: 200,
    sortable: true,
    // «+» и зелёный цвет у поступлений — правило типа поля, а не разметки.
    signed: true,
  },
  {
    key: "transactionDate",
    title: "Дата транзакции",
    width: 180,
    description: (row) => row.transactionTime,
  },
  {
    key: "operation",
    title: "Операция",
    description: (row) => row.mcc,
  },
]

/** Лимиты карты: сколько потрачено из лимита. */
const CARD_LIMITS = [
  { title: "На покупки сегодня", spent: 0, total: 100_000 },
  { title: "На покупки в декабре", spent: 1_000_000, total: 5_000_000 },
  { title: "На снятие наличных сегодня", spent: 300_000, total: 300_000 },
  { title: "На снятие наличных в декабре", spent: 2_500_000, total: 5_000_000 },
]

export {
  BUSINESS_CARDS,
  CARD_LIMITS,
  CARD_STATUS_COLORS,
  CARD_STATUS_LABELS,
  OPERATIONS,
  OPERATION_FIELDS,
}
export type { BusinessCardRow, CardStatus, OperationRow }
