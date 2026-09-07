import type { EChartsOption } from 'echarts';
import React, { useCallback, useEffect, useRef } from 'react';
import { echarts } from './echarts';

export interface BaseChartProps {
  option: EChartsOption;
  height?: number | string;
  width?: number | string;
  loading?: boolean;
  onChartReady?: (instance: echarts.ECharts) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const BaseChart = React.forwardRef<HTMLDivElement, BaseChartProps>(
  (
    {
      option,
      height = 320,
      width = '100%',
      loading = false,
      onChartReady,
      style,
      className,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<echarts.ECharts | null>(null);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      if (!containerRef.current) return;
      const instance = echarts.init(containerRef.current, 'domrf');
      instanceRef.current = instance;
      onChartReady?.(instance);

      const observer = new ResizeObserver(() => instance.resize());
      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        instance.dispose();
      };
    }, []);

    useEffect(() => {
      instanceRef.current?.setOption(option, { notMerge: false });
    }, [option]);

    useEffect(() => {
      if (loading) instanceRef.current?.showLoading();
      else instanceRef.current?.hideLoading();
    }, [loading]);

    return (
      <div
        ref={setRef}
        className={className}
        style={{ width, height, ...style }}
      />
    );
  },
);

BaseChart.displayName = 'BaseChart';
