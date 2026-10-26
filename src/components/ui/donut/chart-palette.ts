// Палитра графиков по умолчанию — общая для Donut и StackBar. Правки UI-Kit
// от 25.10, пункт «Кольцевая диаграмма»: цвета штатного образца — Blue 223,
// Lavender 187, Grey 134, Mint 151, Yellow 134, Red 147, в этом порядке.
// Значения — семантические токены `--chart-*` (src/styles/rules-content.css),
// чтобы тема могла их переопределить.
const CHART_PALETTE = [
  "var(--chart-blue)",
  "var(--chart-lavender)",
  "var(--chart-grey)",
  "var(--chart-mint)",
  "var(--chart-yellow)",
  "var(--chart-red)",
] as const

/** Одна часть диаграммы: формат общий у Donut и StackBar. */
interface ChartDatum {
  name: string
  value: number
  /** Цвет части. Не задан — из палитры графиков по порядку. */
  color?: string
}

/** Цвет части по её месту в данных (палитра идёт по кругу). */
function chartColor(datum: ChartDatum, index: number): string {
  return datum.color ?? CHART_PALETTE[index % CHART_PALETTE.length]
}

/** Значение пригодно для рисования: конечное и больше нуля. */
function isDrawable(value: number) {
  return Number.isFinite(value) && value > 0
}

export { CHART_PALETTE, chartColor, isDrawable }
export type { ChartDatum }
