import * as React from "react"

import { cn } from "@/lib/utils"

// Grid — сетка продукта, «центральное правило проектирования десктопных
// экранов» (замечание 35 дизайн-чека от 07.09, Figma «Правила сетки»).
//
// Правило целиком:
//
//   • контентная полоса — 12 колонок по 128 с желобами 24, то есть 1800 в
//     максимуме, и поля по 40 с каждой стороны;
//   • ниже 1280 (= 1200 + 2×40) продукт НЕ сжимается — появляется общая
//     горизонтальная прокрутка на весь продукт;
//   • выше 1880 (= 1800 + 2×40) контент стоит на 1800, а поля растут.
//
// Отдельная оговорка дизайнера: **хедер тянется на всю ширину**, грид
// работает не на его белую подложку, а на контент внутри. Поэтому здесь два
// разных элемента, а не один: `GridRoot` задаёт ширину ПРОДУКТА (и вместе с
// ней порог прокрутки), а `Grid` — контентную полосу, которую подложка,
// растянутая на весь `GridRoot`, оборачивает.
//
// Почему компонент, а не пять раз одни и те же классы: до него `px-10` +
// `max-w-[1800px]` + `justify-center` были продублированы в верхнем ряду
// шапки, в ряду навигации, в раскрывающемся меню, в панели «Создать» и в
// каркасе песочных экранов — пять мест, где число 1800 надо было бы менять
// синхронно, и ни одно из них не знало про порог 1280.
//
// Числа лежат в `src/styles/tokens-grid.css` — компонент только раскладывает.

/** Колонок в сетке. */
const GRID_COLUMNS = 12
/** Желоб между колонками, px. */
const GRID_GUTTER = 24
/** Поле от края продукта до контентной полосы, px. */
const GRID_MARGIN = 40
/** Контентная полоса в минимуме и максимуме, px. */
const GRID_CONTENT_MIN = 1200
const GRID_CONTENT_MAX = 1800
/** Ниже этой ширины продукт прокручивается, а не сжимается. */
const GRID_VIEWPORT_MIN = GRID_CONTENT_MIN + GRID_MARGIN * 2
/** Выше этой ширины растут поля, а не контент. */
const GRID_VIEWPORT_MAX = GRID_CONTENT_MAX + GRID_MARGIN * 2
/**
 * Порог перестроения содержимого раздела — вариант `wide:` в Tailwind.
 *
 * Дизайн-чек от 13.09, замечание 3. Полосы он не касается: ширина контента
 * на нём меняется непрерывно, а раздел сам решает, разложить ли ряд иначе.
 * Поэтому `Grid` его нигде не применяет — число живёт здесь, чтобы витрина
 * и раздел брали его из одного места. Само правило — в `tokens-grid.css`.
 */
const GRID_VIEWPORT_WIDE = 1536

/**
 * Корень продукта: задаёт минимальную ширину, ниже которой появляется общая
 * прокрутка.
 *
 * Ставится ОДИН раз на всё приложение, выше шапки. Прокрутка получается
 * сама: элемент шире вьюпорта — страница едет по горизонтали целиком,
 * вместе с закреплённой шапкой, а не по кускам. Ровно этого и просит
 * замечание: «просто появляется общая прокрутка».
 *
 * ⚠️ Работает, только если ни один предок не режет переполнение
 * (`overflow: hidden` на `body` убьёт прокрутку, а не переполнение).
 */
function GridRoot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-root"
      className={cn(
        "flex w-full flex-col",
        // Порог только для десктопной формы: мобильная раскладка тянется
        // как обычно, и навязывать ей 1280 значило бы сломать её ради
        // правила, которое к ней не относится.
        "desktop:min-w-[var(--grid-viewport-min)]",
        className
      )}
      {...props}
    />
  )
}

interface GridProps extends React.ComponentProps<"div"> {
  /**
   * Разложить детей по 12 колонкам прямо здесь.
   *
   * Нужно редко — обычно полоса держит вертикальную стопку блоков, а
   * колонки заводит `GridRow` внутри неё.
   */
  columns?: boolean
}

/**
 * Контентная полоса — то, на что грид собственно работает.
 *
 * Ширина одним выражением из токена: `min(100% − 2×поле, 1800)`. Оба порога
 * из него следуют сами — на 1280 это 1200, на 1880 и выше 1800, — поэтому
 * ни медиазапросов, ни `100vw` здесь нет (см. комментарий у токена).
 */
function Grid({ columns = false, className, ...props }: GridProps) {
  return (
    <div
      data-slot="grid"
      data-columns={columns || undefined}
      className={cn(
        "mx-auto w-full desktop:w-[var(--grid-content-width)]",
        columns &&
          "desktop:grid desktop:grid-cols-12 desktop:gap-[var(--grid-gutter)]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Ряд колонок внутри полосы.
 *
 * На мобильной ширине это обычная вертикальная стопка (12 колонок по 128
 * ниже 1200 не живут), на десктопе — настоящий CSS-grid. Смена display'я и
 * есть причина, по которой `GridCol` задаёт пролёт инлайновым стилем: во
 * flex-режиме `grid-column` просто игнорируется, и ряд не надо чинить
 * вторым набором правил.
 */
function GridRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-row"
      className={cn(
        "flex w-full flex-col gap-[var(--grid-gutter)]",
        "desktop:grid desktop:grid-cols-12 desktop:items-start",
        className
      )}
      {...props}
    />
  )
}

interface GridColProps extends React.ComponentProps<"div"> {
  /** Ширина в колонках, 1…12. */
  span?: number
}

/** Колонка ряда. */
function GridCol({ span = GRID_COLUMNS, className, style, ...props }: GridColProps) {
  const width = Math.min(Math.max(Math.round(span), 1), GRID_COLUMNS)

  return (
    <div
      data-slot="grid-col"
      // `min-w-0` — иначе длинное неразрывное содержимое (номер счёта,
      // таблица) распирает колонку сверх её пролёта: у grid-элемента
      // `min-width` по умолчанию `auto`, а не ноль.
      className={cn("min-w-0", className)}
      style={{ gridColumn: `span ${width} / span ${width}`, ...style }}
      {...props}
    />
  )
}

/**
 * Ширина пролёта в N колонок — как CSS-выражение, а не число.
 *
 * Нужна тем, кто раскладывается ПО сетке, но грид-элементом не является:
 * нижняя панель действий липнет к низу своего контейнера и стоит в обычном
 * потоке, `grid-column` для неё не работает вовсе (дизайн-чек от 13.09,
 * замечание 19: «Button Menu и Button Menu Black должны уметь занимать не все
 * 12 колонок грида»).
 *
 * `100%` считается от родителя, в который выражение подставлено, поэтому
 * ставить его надо на полосе (`Grid`) — тогда и колонка получится та же, что
 * у `GridRow` рядом. Формула ровно та же, что и у грида: 12 колонок и 11
 * желобов делят полосу, N колонок забирают N долей и N−1 желобов.
 */
function gridSpanWidth(span: number): string {
  const width = Math.min(Math.max(Math.round(span), 1), GRID_COLUMNS)
  if (width === GRID_COLUMNS) return "100%"
  return `calc((100% - ${GRID_COLUMNS - 1} * var(--grid-gutter)) / ${GRID_COLUMNS} * ${width} + var(--grid-gutter) * ${width - 1})`
}

/**
 * Подсказка сетки — 12 залитых колонок.
 *
 * Дизайн-чек от 13.09, замечание 12: «добавить в него видимый показ колонок
 * (например, в сером цвете на белом). Чтобы можно было наглядно видеть, как
 * колонки изменяются при смене ширины вьюпорта».
 *
 * Колонки настоящие: это тот же `grid-cols-12` с тем же желобом, что и у
 * `GridRow`, а не нарисованные полоски. Поэтому подсказка не «похожа» на
 * сетку, а МЕРЯЕТ её — ошибка в раскладке видна сразу, и числа на витрине
 * снимаются прямо с этих узлов.
 *
 * Ниже десктопной ширины колонок нет вовсе (`GridRow` там складывается в
 * столбец), и подсказка честно показывает одну полосу: 12 колонок по 128 на
 * мобиле не живут.
 */
function GridGuides({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="grid-guides"
      className={cn(
        "pointer-events-none grid w-full min-h-16 grid-cols-1 gap-[var(--grid-gutter)]",
        "desktop:grid-cols-12",
        className
      )}
      {...props}
    >
      {Array.from({ length: GRID_COLUMNS }, (_, index) => (
        <span
          key={index}
          data-slot="grid-guide"
          className={cn(
            "h-full rounded-[4px] bg-[var(--grid-guide-bg)]",
            // Мобильная форма — ОДНА полоса, а не двенадцать друг под другом:
            // столбец из дюжины пустых плашек ничего не показывает, кроме
            // того, что колонок здесь нет. Остальные просто выключены.
            index > 0 && "hidden desktop:block"
          )}
        />
      ))}
    </div>
  )
}

export {
  Grid,
  GridCol,
  GridGuides,
  GridRoot,
  GridRow,
  GRID_COLUMNS,
  GRID_CONTENT_MAX,
  GRID_CONTENT_MIN,
  GRID_GUTTER,
  GRID_MARGIN,
  GRID_VIEWPORT_MAX,
  GRID_VIEWPORT_MIN,
  GRID_VIEWPORT_WIDE,
  gridSpanWidth,
}
export type { GridColProps, GridProps }
