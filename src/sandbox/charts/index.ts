// Графики песочных экранов.
//
// Это НЕ часть кита: `@charts/echarts` — отдельный пакет команды
// (`design_check/charts-test`, gitlab .../platform/frontend/charts), и в ЕЛК
// он приезжает своей зависимостью. Обёртки скопированы сюда один в один,
// чтобы песочные экраны рисовали ровно те же графики, что и продукт, и
// чтобы `echarts` остался devDependency: `src/sandbox` не попадает ни в
// `src/index.ts`, ни в entry-points сборки (см. `componentEntries` в
// vite.config.ts), поэтому в пакет кита ничего из этого не уезжает.
//
// Изменения против оригинала ровно одно: путь `@src/const` → `./const`.
export { BarChart, BarChartWidth } from "./BarChart"
export type { BarChartProps, BarChartSeries } from "./BarChart"
export { BaseChart } from "./BaseChart"
export type { BaseChartProps } from "./BaseChart"
export { ComposedChart } from "./ComposedChart"
export type {
  ComposedBarSeries,
  ComposedChartProps,
  ComposedLineSeries,
  ComposedSeries,
} from "./ComposedChart"
export { LineChart } from "./LineChart"
export type { LineChartProps, LineChartSeries } from "./LineChart"
export { THEME_COLORS } from "./theme"
