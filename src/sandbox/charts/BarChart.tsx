import type { EChartsOption } from 'echarts';
import React from 'react';
import { BaseChart } from './BaseChart';
import type { BaseChartProps } from './BaseChart';
import { SVG_ICONS } from './const';

/**
 * Настройки для столбчатых диаграмм.
 */
export interface BarChartSeries {
  /** Название ряда, отображаемое в легенде и подсказках. */
  name: string;
  /** Массив числовых значений для построения диаграммы. */
  data: number[];
  /**
   * Имя стека для группировки столбцов.
   * При задании столбцы с одинаковым именем будут стакированы.
   */
  stack?: string;
}

/**
 * Настройки для ширины столбцов диаграммы.
 */
// Объект вместо `enum`: в ките включён `erasableSyntaxOnly`, а `enum`
// оставляет после себя рантайм-код. Значения и обращение `BarChartWidth.min`
// не меняются, поэтому вызовы оригинала работают без правок.
export const BarChartWidth = {
  min: 16,
  medium: 98,
  max: 128,
} as const

export type BarChartWidth = (typeof BarChartWidth)[keyof typeof BarChartWidth]

/**
 * Пропсы для компонента BarChart.
 * Наследует все пропсы базового графика `BaseChartProps`, кроме `option`.
 */
export interface BarChartProps extends Omit<BaseChartProps, 'option'> {
  /** Массив меток для оси X (категории). */
  xData: string[];
  /** Массив объектов конфигурации для столбцов диаграммы. */
  series: BarChartSeries[];
  /** Ширина столбцов диаграммы. */
  barWidth?: BarChartWidth;
  /**
   * Флаг для горизонтального отображения диаграммы.
   * @default false
   */
  horizontal?: boolean;
  /** Подпись (название) таблицы. */
  chartTitle?: string;
}

/**
 * Компонент столбчатой диаграммы (Bar Chart) на базе ECharts.
 * Автоматически настраивает сетку, оси, легенду и подсказки (tooltip).
 * Поддерживает горизонтальное отображение и стакированные столбцы.
 *
 * @example
 * ```tsx
 * <BarChart
 *   xData={['Пн', 'Вт', 'Ср']}
 *   chartTitle="Продажи (руб)"
 *   series={[
 *     { name: 'Выручка', data: [100, 200, 300] }
 *   ]}
 * />
 * ```
 */
export const BarChart: React.FC<BarChartProps> = ({
  xData,
  series,
  horizontal = false,
  barWidth = BarChartWidth.medium,
  chartTitle,
  ...rest
}) => {
  const axisData = { type: 'category' as const, data: xData };
  const valueAxis = { type: 'value' as const };

  const option: EChartsOption = {
    title: {
      text: chartTitle,
    },
    xAxis: horizontal ? valueAxis : axisData,
    yAxis: horizontal ? axisData : valueAxis,
    tooltip: {},
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      stack: s.stack,
      barMaxWidth: barWidth,
      // Скруглений у столбцов нет — дизайн-чек от 08.09, замечание 14
      // («убрать скругления у чартов»), целёвка — нода 63151:12856, где и
      // вертикальные столбцы, и горизонтальные полосы нарисованы с прямыми
      // углами.
      borderRadius: 0,
    })),
    legend: {
      icon: SVG_ICONS.bar
    },
  };

  return <BaseChart option={option} {...rest} />;
};

BarChart.displayName = 'BarChart';
