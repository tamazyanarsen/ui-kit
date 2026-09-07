export const THEME_COLORS = {
  // Цвета графиков
  blue: '#80E3FF',
  lavender: '#B2B8FE',
  grey: '#DEDEDE',
  mint: '#66E9B2',
  yellow: '#FADC89',
  red: '#FFBEB5',

  // Цвета текста и легенды графиков
  secondary: '#999999',
  primary: '#252628',

  // Цвета границ и тултипов
  tooltipBackground: '#6D6D6D',
  white: '#ffffff',
};

export const domrfTheme = {
  color: [
    THEME_COLORS.blue,
    THEME_COLORS.lavender,
    THEME_COLORS.yellow,
    THEME_COLORS.red,
    THEME_COLORS.mint,
    THEME_COLORS.grey,
  ],
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: 12,
    color: THEME_COLORS.primary,
  },
  title: {
    top: 10,
    left: 'left',
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: 500,
    fontStyle: 'normal',
    color: THEME_COLORS.primary,
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    backgroundColor: THEME_COLORS.tooltipBackground,
    textStyle: { color: THEME_COLORS.white },
    extraCssText:
      'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px;',
    axisPointer: {
      show: true,
      type: 'cross',
      lineStyle: {
        color: THEME_COLORS.secondary,
        width: 1,
        type: 'dashed',
      },
      crossStyle: {
        color: THEME_COLORS.secondary,
        width: 1,
        type: 'dashed',
      },
      label: {
        show: false,
      },
    },
  },
  grid: {
    containLabel: true,
    left: 0,
    right: 0,
    top: 58,
    bottom: 48,
  },
  legend: {
    textStyle: { color: THEME_COLORS.secondary, verticalAlign: 'middle' },
    bottom: 10,
    left: 'center',
    orient: 'horizontal',
    itemGap: 16,
  },
};
