// Данные экрана D12 — с эталонов 70371:25361 («Общая информация») и
// 70371:25591 («Очереди строительства»).

const PROJECT = {
  name: 'ЖК "MYPRIORITY Paveletskaya"',
  organization: 'ООО "Длинное название организации" (ИНН 1655396531)',
  updatedAt: "26.05.2026",
  region: "Республика Татарстан",
  city: "Казань",
  queues: 3,
  budget: 5_859.0,
  buildCost: 4_859.0,
  buildPeriod: "28.02.2023 — 30.09.2026",
  commissioning: "31.03.2026",
  totalArea: 34_496,
  livingArea: 22_806,
  nonLivingArea: 10_100,
  parkingSpaces: 230,
}

/** Финансирование: три полосы состава, каждая со своей легендой. */
const FINANCING = {
  developer: 'ООО «ЖНК-ДЕВЕЛОПМЕНТ» (ИНН 7814710267)',
  advanceRate: 10,
  advanceLimit: 10_000_000_000,
  estimate: {
    total: 100_000_000,
    borrowed: 70_000_000,
    own: 30_000_000,
  },
  paid: {
    total: 20_000_000,
    borrowed: 10_000_000,
    own: 5_000_000,
    processing: 5_000_000,
  },
  available: {
    total: 80_000_000,
    borrowed: 48_000_000,
    own: 32_000_000,
  },
}

/**
 * Показатели стадии реализации.
 *
 * ⚠️ Полоса НЕ переполняется: 105,7 % от плана рисуется полной полосой, а
 * правду говорит число рядом. Иначе полоса вылезала бы за карточку и
 * ломала сетку.
 */
const STAGE_METRICS = [
  { title: "Объём понесённых затрат", value: 2_425.0, percent: 49.4 },
  { title: "Расходы на землю (глава 1)", value: 460.0, percent: 100.0 },
  { title: "Стоимость строительства (глава 2)", value: 1_817.6, percent: 42.8 },
  { title: "Коммерческие расходы (глава 3)", value: 174.4, percent: 66.1 },
]

const ESCROW_METRIC = {
  title: "Продажи на счетах эскроу",
  value: 2_937.1,
  percent: 105.7,
}

const EXECUTION_METRIC = {
  title: "Стоимость СМР по актам (главы 2.1, 2.2, 2.3, 2.4)",
  value: 1_603.2,
  percent: 42.3,
}

const ADVANCE_METRIC = {
  title: "Объём неотработанных авансов",
  value: 1_060.9,
  percent: 21.4,
  note: "от бюджета",
}

interface SalesRow {
  id: string
  metric: string
  sold: string
  soldPlan: string
  amount: string
  amountPlan: string
  averagePrice: string
}

const SALES: SalesRow[] = [
  { id: "1", metric: "Жилая площадь", sold: "7 565 м²", soldPlan: "91,9% от плана", amount: "2 529,0 млн ₽", amountPlan: "91,7% от плана", averagePrice: "334,4 тыс ₽ / м²" },
  { id: "2", metric: "Нежилая площадь", sold: "1 102 м²", soldPlan: "134,5% от плана", amount: "660,1 млн ₽", amountPlan: "209,6% от плана", averagePrice: "599,6 тыс ₽ / м²" },
  { id: "3", metric: "Машиноместа", sold: "128 шт", soldPlan: "134,5% от плана", amount: "211,0 млн ₽", amountPlan: "165,3% от плана", averagePrice: "1 646,1 тыс ₽ / шт" },
]

const QUEUES = [
  { value: "1", label: "1 — ЖК Большевичка корпус 1" },
  { value: "2", label: "2 — ЖК Большевичка корпус 2" },
  { value: "3", label: "3 — ЖК Большевичка корпус 3" },
]

interface AdvanceRow {
  id: string
  kind: string
  total: number
  worked: number
  unworked: number
}

const ADVANCES: AdvanceRow[] = [
  { id: "1", kind: "Ген. подрядчик", total: 438.2, worked: 216.9, unworked: 221.2 },
  { id: "2", kind: "Тех. присоединение", total: 47.9, worked: 0, unworked: 47.9 },
  { id: "3", kind: "Иные (другое)", total: 114.0, worked: 5.5, unworked: 108.5 },
]

/** Платежи топ-10 контрагентам, млн ₽ — горизонтальный столбчатый график. */
const TOP_CONTRACTORS = {
  names: [
    "ООО «САНЛАЙТ ХАУС»",
    "ООО «СТРОЙ-КА»",
    "ООО «Ромашка»",
    "ООО «Глобал»",
    "ООО «КАМА»",
    "ООО «ГАРАНТ СТРОЙ»",
    "ООО «ГЕН-СТРОЙ»",
  ],
  own: [100.1, 200, 300, 400, 400, 634.2, 950.4],
  borrowed: [0, 0, 100, 0, 0, 0, 0],
}

const RESERVES = [
  { label: "Доступный резерв от общей стоимости работ", value: "0,4%" },
  {
    label: "Доступный резерв до конца проекта с учетом стройготовности",
    value: "1,4%",
  },
  { label: "Утилизация резерва (факт/план, млн руб.)", value: "0,0% (0 / 7,8)" },
]

/** Стройготовность — три ряда линейного графика по месяцам. */
const READINESS = {
  months: ["Дек 24", "Янв 25", "Фев 25", "Мар 25", "Апр 25", "Май 25", "Июн 25", "Июл 25", "Авг 25", "Сен 25", "Окт 25", "Ноя 25", "Дек 25"],
  plan: [20, 21, 22, 34, 40, 50, 65, 80, 87, 95, 100, 100, 100],
  survey: [10, 17, 18, 30, 35, 40, 50, 56, 70, 75, 80, 85, 92],
  acts: [0, 0, 0, 25, 30, 35, 45, 50, 67, 71, 76, 76, 76],
  totals: [
    { label: "План", value: "1 469,3 млн ₽", percent: "100%" },
    { label: "Выездная проверка", value: "1 350,5 млн ₽", percent: "92%" },
    { label: "По актам", value: "1 109,9 млн ₽", percent: "76%" },
  ],
}

const RECOMMENDATIONS = [
  {
    id: "1",
    value: "Уточнить график производства работ по главе 2.2",
    text: "Отставание от плана на 7,2 п. п. по итогам мая",
  },
  {
    id: "2",
    value: "Запросить акты по техприсоединению",
    text: "Аванс 47,9 млн ₽ не отработан с февраля",
  },
]

export {
  ADVANCES,
  ADVANCE_METRIC,
  ESCROW_METRIC,
  EXECUTION_METRIC,
  FINANCING,
  PROJECT,
  QUEUES,
  READINESS,
  RECOMMENDATIONS,
  RESERVES,
  SALES,
  STAGE_METRICS,
  TOP_CONTRACTORS,
}
export type { AdvanceRow, SalesRow }
