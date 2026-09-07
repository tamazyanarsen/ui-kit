import type { EChartsOption } from 'echarts';
import { BaseChart } from './BaseChart';
import type { BaseChartProps } from './BaseChart';
import { SVG_ICONS } from './const';

/**
 * Настройки для графике в виде линий.
 */
export interface LineChartSeries {
  /** Название ряда, отображаемое в легенде и подсказках. */
  name: string;
  /** Массив числовых значений для построения графика. */
  data: number[];
  /**
   * Сглаживание углов линии.
   * @default true
   */
  smooth?: boolean;
  /**
   * Флаг для закрашивания области под линией (градиент/заливка).
   * @default false
   */
  areaStyle?: boolean;
}

/**
 * Пропсы для компонента LineChart.
 * Наследует все пропсы базового графика `BaseChartProps`, кроме `option`.
 */
export interface LineChartProps extends Omit<BaseChartProps, 'option'> {
  /** Массив меток для оси X (категории). */
  xData: string[];
  /** Массив объектов конфигурации для линий графика. */
  series: LineChartSeries[];
  /** Подпись (название) таблицы. */
  chartTitle?: string;
}

/**
 * Компонент линейного графика (Line Chart) на базе ECharts.
 * Автоматически настраивает сетку, оси, легенду и подсказки (tooltip).
 * https://www.figma.com/design/bCYDX3qEGAxzFqhUNEVyVo/D-10984-%D0%9E%D1%82%D1%87%D1%91%D1%82%D1%8B-%D0%BF%D0%BE-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0%D0%BC?node-id=25659-4705&p=f&t=tZVQzSeeTnutDwMT-0
 *
 * @example
 * ```tsx
 * <LineChart
 *   xData={['Пн', 'Вт', 'Ср']}
 *   chartTitle="Продажи (руб)"
 *   series={[
 *     { name: 'Выручка', data:, smooth: true, areaStyle: true }
 *   ]}
 * />
 * ```
 */
export const LineChart = ({
  xData,
  series,
  chartTitle,
  ...rest
}: LineChartProps) => {
  const option: EChartsOption = {
    title: {
      text: chartTitle,
    },
    xAxis: { type: 'category', data: xData, boundaryGap: false },
    yAxis: { type: 'value' },
    tooltip: {},
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      symbol: 'circle',
      data: s.data,
      smooth: s.smooth ?? true,
      areaStyle: s.areaStyle ? { opacity: 0.12 } : undefined,
    })),
    legend: {
      icon: SVG_ICONS.line,
    },
  };

  return <BaseChart option={option} {...rest} />;
};

LineChart.displayName = 'LineChart';
