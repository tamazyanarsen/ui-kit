import type { EChartsOption } from 'echarts';
import React from 'react';
import { BarChartWidth } from './BarChart';
import { BaseChart } from './BaseChart';
import type { BaseChartProps } from './BaseChart';
import { SVG_ICONS } from './const';

/**
 * Настройки для столбчатых серий в составном графике.
 */
export interface ComposedBarSeries {
  /** Тип графика. */
  type: 'bar';
  /** Название ряда, отображаемое в легенде и подсказках. */
  name: string;
  /** Массив числовых значений для построения столбцов. */
  data: number[];
  /**
   * Имя стека для группировки столбцов.
   * При задании столбцы с одинаковым именем будут стакированы.
   */
  stack?: string;
  /**
   * Индекс оси Y, к которой привязан ряд.
   * Используется при наличии второй оси Y.
   */
  yAxisIndex?: number;
}

/**
 * Настройки для линейных серий в составном графике.
 */
export interface ComposedLineSeries {
  /** Тип графика. */
  type: 'line';
  /** Название ряда, отображаемое в легенде и подсказках. */
  name: string;
  /** Массив числовых значений для построения линии. */
  data: number[];
  /**
   * Сглаживание углов линии.
   * @default true
   */
  smooth?: boolean;
  /**
   * Индекс оси Y, к которой привязан ряд.
   * Используется при наличии второй оси Y.
   */
  yAxisIndex?: number;
}

/**
 * Тип серии для составного графика (бар или линия).
 */
export type ComposedSeries = ComposedBarSeries | ComposedLineSeries;

/**
 * Пропсы для компонента ComposedChart.
 * Наследует все пропсы базового графика `BaseChartProps`, кроме `option`.
 */
export interface ComposedChartProps extends Omit<BaseChartProps, 'option'> {
  /** Массив меток для оси X (категории). */
  xData: string[];
  /** Массив объектов конфигурации для столбцов и/или линий графика. */
  series: ComposedSeries[];
  /** Ширина столбцов диаграммы. */
  barWidth?: BarChartWidth;
  /** Подпись (название) таблицы. */
  chartTitle?: string;
  /** Настройки второй оси Y (для отображения данных с разными масштабами). */
  secondYAxis?: { name: string };
}

/**
 * Компонент составного графика (Composed Chart) на базе ECharts.
 * Позволяет комбинировать столбцы (bar) и линии (line) на одном графике.
 * Поддерживает две оси Y для отображения данных с разными масштабами.
 * Автоматически настраивает сетку, оси, легенду и подсказки (tooltip).
 *
 * @example
 * ```tsx
 * <ComposedChart
 *   xData={['Q1', 'Q2', 'Q3', 'Q4']}
 *   chartTitle="Продажи (шт)"
 *   series={[
 *     { type: 'bar', name: 'Выручка', data: [100, 200, 150, 300] },
 *     { type: 'line', name: 'Средний чек', data: [1500, 1600, 1550, 1700] }
 *   ]}
 * />
 * ```
 */
export const ComposedChart: React.FC<ComposedChartProps> = ({
  xData,
  series,
  chartTitle,
  barWidth = BarChartWidth.medium,
  secondYAxis,
  ...rest
}) => {
  const yAxis: EChartsOption['yAxis'] = secondYAxis
    ? [
        { type: 'value' },
        { type: 'value', name: secondYAxis.name, splitLine: { show: false } },
      ]
    : { type: 'value' };

  const option: EChartsOption = {
    title: {
      text: chartTitle,
    },
    xAxis: { type: 'category', data: xData },
    yAxis,
    tooltip: {},
    series: series.map((s) => ({
      ...s,
      smooth: s.type === 'line' ? (s.smooth ?? true) : undefined,
      barMaxWidth: s.type === 'bar' ? barWidth : undefined,
      // Прямые углы — см. BarChart и замечание 14 дизайн-чека от 08.09.
      borderRadius: s.type === 'bar' ? 0 : undefined,
      ...(s.type === 'line' && {
        symbol: 'circle',
      }),
    })),
    legend: {
      data: series.map((s) => {
        return {
          name: s.name,
          icon: SVG_ICONS[s.type],
        };
      }),
    },
  };

  return <BaseChart option={option} {...rest} />;
};

ComposedChart.displayName = 'ComposedChart';
