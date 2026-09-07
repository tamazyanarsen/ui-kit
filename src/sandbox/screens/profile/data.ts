// Данные экрана D10 — с эталона 70371:24923.

/** Допустимые типы подписи — значения селекта в строке права. */
const SIGNATURE_TYPES = [
  { value: "single", label: "Единственная" },
  { value: "single-or-pair", label: "Единственная или «Первая + Вторая»" },
  { value: "any", label: "Любая" },
]

interface SignatureRight {
  key: string
  label: string
  type: string
  /**
   * Право задано договором и в личном кабинете не меняется — селект
   * показывает замок вместо шеврона. По эталону такие строки идут подряд
   * ниже настраиваемых.
   */
  locked: boolean
}

const SIGNATURE_RIGHTS: SignatureRight[] = [
  { key: "payments", label: "Платёжные поручения", type: "single-or-pair", locked: false },
  { key: "registries", label: "Реестры платежей", type: "single", locked: false },
  { key: "payroll", label: "Зарплатные ведомости", type: "single-or-pair", locked: false },
  { key: "autopay", label: "Автоплатежи", type: "single", locked: false },
  { key: "sbp", label: "Операции СБП", type: "single", locked: true },
  { key: "petitions", label: "Ходатайства", type: "single", locked: true },
  { key: "certificates", label: "Справки", type: "any", locked: true },
  { key: "statements", label: "Выписки по расписанию", type: "any", locked: true },
  { key: "autopay-close", label: "Заявления на закрытие автоплатежа", type: "any", locked: true },
  { key: "letters", label: "Письма в банк", type: "any", locked: true },
  { key: "deposits", label: "Депозиты", type: "any", locked: true },
  { key: "min-balance", label: "Неснижаемые остатки", type: "any", locked: true },
  { key: "second-account", label: "Заявки на открытие второго счёта", type: "any", locked: true },
  { key: "tariff", label: "Заявки на смену тарифа по счёту", type: "any", locked: true },
]

export { SIGNATURE_RIGHTS, SIGNATURE_TYPES }
export type { SignatureRight }
