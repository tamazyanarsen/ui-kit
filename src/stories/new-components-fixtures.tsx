import type { ChartDatum } from "@/components/ui/donut"
import type { PromoBannerColor } from "@/components/ui/banner"

/* Данные витрин новых компонентов (Правки UI-Kit от 25.10): Donut,
   StackBar, PromoCarousel / PromoBanner, PagedList. Storybook-only. */

/** «Портфель» главной: пять частей, сумма 4 000 000. */
export const PORTFOLIO: ChartDatum[] = [
  { name: "Депозиты", value: 1_600_000 },
  { name: "Остатки на счетах", value: 1_000_000 },
  { name: "НСО", value: 700_000 },
  { name: "Облигации", value: 450_000 },
  { name: "Векселя", value: 250_000 },
]

/** «Баланс» счетов: доступно, в обработке, картотеки, заблокировано. */
export const BALANCE: ChartDatum[] = [
  { name: "Доступно", value: 2_340_000 },
  { name: "В обработке", value: 120_000 },
  { name: "Картотеки", value: 0 },
  { name: "Заблокировано", value: 40_000 },
]

/** Шесть частей — вся палитра графиков по порядку. */
export const PALETTE_SIX: ChartDatum[] = [
  "Blue 223",
  "Lavender 187",
  "Grey 134",
  "Mint 151",
  "Yellow 134",
  "Red 147",
].map((name) => ({ name, value: 1 }))

/** Узкие части рядом с крупной — проверка «край в точку» и минимума 4. */
export const NARROW: ChartDatum[] = [
  { name: "Основное", value: 980 },
  { name: "Мелочь 1", value: 4 },
  { name: "Мелочь 2", value: 1 },
  { name: "Мелочь 3", value: 15 },
]

export const SINGLE: ChartDatum[] = [
  { name: "Депозиты", value: 1_000_000 },
  { name: "Счета", value: 0 },
]

export const CHART_PRESETS = {
  portfolio: PORTFOLIO,
  balance: BALANCE,
  palette: PALETTE_SIX,
  narrow: NARROW,
  single: SINGLE,
} satisfies Record<string, ChartDatum[]>

export type ChartPreset = keyof typeof CHART_PRESETS

export const formatRub = (value: number) =>
  `${value.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽`

export const sumOf = (data: ChartDatum[]) =>
  data.reduce((sum, { value }) => sum + (value > 0 ? value : 0), 0)

/** Иллюстрация баннера: условная фигура, вписывается в правый нижний угол. */
export function PromoArt({ tone = "#80E3FF" }: { tone?: string }) {
  return (
    <svg viewBox="0 0 120 104" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <rect x="40" y="30" width="72" height="74" rx="12" fill={tone} opacity=".55" />
      <circle cx="58" cy="52" r="26" fill={tone} />
      <rect x="70" y="64" width="44" height="40" rx="8" fill="#FFFFFF" opacity=".7" />
    </svg>
  )
}

export interface PromoFixture {
  title: string
  description: string
  actionLabel: string
  color: PromoBannerColor
  tone: string
}

export const PROMOS: PromoFixture[] = [
  {
    title: "Кредит на пополнение оборотных средств",
    description: "До 50 млн ₽ без залога, решение за один день",
    actionLabel: "Подробнее",
    color: "blue",
    tone: "#80E3FF",
  },
  {
    title: "Депозит «Доходный»",
    description: "До 16 % годовых при размещении от 3 месяцев",
    actionLabel: "Открыть",
    color: "lavender",
    tone: "#B2B8FE",
  },
  {
    title: "Зарплатный проект",
    description: "Бесплатные карты сотрудникам и выплаты за минуты",
    actionLabel: "Подключить",
    color: "mint",
    tone: "#66E9B2",
  },
  {
    title: "Эскроу-счета для застройщиков с очень длинным названием предложения",
    description:
      "Проектное финансирование по льготной ставке для застройщиков: описание длиннее двух строк обрезается многоточием",
    actionLabel: "Узнать",
    color: "grey",
    tone: "#C8C8CB",
  },
]

/** Строки «Дел» для постраничного списка. */
export const TASKS = [
  ["Подписать платёжное поручение", "До 28 октября"],
  ["Загрузить отчётность за квартал", "До 30 октября"],
  ["Подтвердить реквизиты контрагента", "Сегодня"],
  ["Ответить на запрос банка", "До 1 ноября"],
  ["Продлить доверенность", "До 5 ноября"],
  ["Проверить выписку", "До 6 ноября"],
  ["Согласовать график платежей", "До 10 ноября"],
] as const
