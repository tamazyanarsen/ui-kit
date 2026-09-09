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
    // Гарнитура кита, а не Inter: подключённый echarts рисовал подписи
    // системным Inter, то есть другим шрифтом, чем весь остальной экран
    // (дизайн-чек от 08.09, замечание 17 — «прокинуть корневые правки в
    // подключённый echarts»).
    fontFamily: 'Object Sans, sans-serif',
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
  /* Легенда — компонент `Legend Element (ELK)` (нода 63582:16040):
     маркер 16×4 со скруглением 1, зазор до подписи 6, подпись P2 Medium
     (14/20/500) цветом Grey 1514, минимальная высота 32 и поле 4 сверху и
     снизу, шаг между элементами 16.

     Дизайн-чек от 08.09, замечание 17: «Неверный размер и начертание
     элемента легенды». До правки подпись рисовалась 12-м кеглем серым
     #999999 — то есть и размер, и цвет были не те. */
  legend: {
    textStyle: {
      color: THEME_COLORS.primary,
      fontFamily: 'Object Sans, sans-serif',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: 500,
      verticalAlign: 'middle',
      // echarts сам ставит 5px между маркером и подписью, макет просит 6.
      padding: [0, 0, 0, 1],
    },
    icon: 'roundRect',
    itemWidth: 16,
    itemHeight: 4,
    bottom: 10,
    left: 'center',
    orient: 'horizontal',
    itemGap: 16,
  },
};
