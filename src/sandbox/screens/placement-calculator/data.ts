// Данные экрана D3 — с эталонов 70371:25033 («Основные предложения») и
// 70371:25240 («Индивидуальные предложения»).

type ProductKind = "nso" | "deposit"

interface Offer {
  id: string
  kind: ProductKind
  title: string
  subtitle?: string
  /** Годовая ставка, %. */
  rate: number
  rateInfo?: string
  /** Подсказка у значка в правом верхнем углу карточки. */
  info: string
  /** Одобренное предложение — вкладка «Индивидуальные предложения». */
  approved?: { amount: number; days: number; until: string }
  /**
   * Доход не считается по сумме и сроку, а показывается справочно: у ЕСО
   * проценты начисляются на весь свободный остаток, и заранее известной
   * суммы у него нет.
   */
  incomeless?: boolean
}

const MAIN_OFFERS: Offer[] = [
  {
    id: "nso",
    kind: "nso",
    title: "Неснижаемый остаток",
    rate: 28,
    info: "Начисление процентов на неснижаемый остаток на счёте. Проценты ежемесячно",
  },
  {
    id: "deposit-fixed",
    kind: "deposit",
    title: "Депозит",
    subtitle: "Без досрочного расторжения",
    rate: 22.04,
    info: "Ставка фиксируется на весь срок. Досрочное расторжение недоступно",
  },
  {
    id: "deposit-early",
    kind: "deposit",
    title: "Депозит",
    subtitle: "С правом досрочного расторжения",
    rate: 28,
    info: "Средства можно вернуть досрочно с пересчётом процентов",
  },
  {
    id: "deposit-float-fixed",
    kind: "deposit",
    title: "Депозит с плавающей ставкой",
    subtitle: "Без досрочного расторжения",
    rate: 20.51,
    rateInfo:
      "Значение ставки является справочным на текущую дату и зависит от индикатива",
    info: "Ставка привязана к индикативу и пересчитывается при его изменении",
  },
  {
    id: "deposit-float-early",
    kind: "deposit",
    title: "Депозит с плавающей ставкой",
    subtitle: "С правом досрочного расторжения",
    rate: 11,
    rateInfo:
      "Значение ставки является справочным на текущую дату и зависит от индикатива",
    info: "Ставка привязана к индикативу. Досрочное расторжение доступно",
  },
]

const INDIVIDUAL_OFFERS: Offer[] = [
  {
    id: "eso",
    kind: "nso",
    title: "Ежедневный свободный остаток",
    subtitle: "Индикатив — ключевая ставка ЦБ РФ",
    rate: 20,
    rateInfo:
      "Значение ставки является справочным на текущую дату и зависит от индикатива",
    info: "Начисление процентов на весь свободный остаток на счёте. Проценты ежемесячно",
    incomeless: true,
    approved: { amount: 0, days: 0, until: "20.09.2026 18:00" },
  },
  {
    id: "nso-approved",
    kind: "nso",
    title: "Неснижаемый остаток",
    rate: 28,
    info: "Начисление процентов на неснижаемый остаток на счёте",
    approved: { amount: 2_000_000, days: 180, until: "15.09.2026 18:00" },
  },
  {
    id: "deposit-approved",
    kind: "deposit",
    title: "Депозит",
    subtitle: "Без досрочного расторжения",
    rate: 28,
    info: "Индивидуальные условия по депозиту",
    approved: { amount: 2_000_000, days: 180, until: "15.09.2026 18:00" },
  },
  {
    id: "deposit-approved-early",
    kind: "deposit",
    title: "Депозит",
    subtitle: "С правом досрочного расторжения",
    rate: 20.51,
    info: "Индивидуальные условия по депозиту с досрочным расторжением",
    approved: { amount: 2_000_000, days: 180, until: "15.09.2026 18:00" },
  },
]

const INTEREST_PAYOUTS = [
  { value: "end", label: "В конце срока" },
  { value: "monthly", label: "Ежемесячно" },
  { value: "quarterly", label: "Ежеквартально" },
]

/** Предполагаемый доход: сумма × ставка × срок / 365. */
function estimateIncome(amount: number, rate: number, days: number) {
  return (amount * rate * days) / (100 * 365)
}

export {
  INDIVIDUAL_OFFERS,
  INTEREST_PAYOUTS,
  MAIN_OFFERS,
  estimateIncome,
}
export type { Offer, ProductKind }
