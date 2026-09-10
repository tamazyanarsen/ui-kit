// Пиксельная геометрия таблицы, снятая с мастеров Figma
// («Проектирование таблиц ЕЛК», node 70279:6891). Все числа и все классы
// отступов собраны здесь одним модулем: высота строки — это максимум по
// коробкам её ячеек, поэтому один неверный тип растягивает всю строку, и
// сверять такие правила проще, когда они лежат рядом, а не расползаются по
// телам компонентов.

import type { TablePin } from "./pin"
import type { TableCellType, TableHeadCellType } from "./types"

/** «Минимальная ширина столбцов — 48px.» */
const MIN_COLUMN_WIDTH = 48

/**
 * Поле СТРОКИ — 8px поверх собственного поля ячейки.
 *
 * Дизайн-чек «Storybook 3», замечание 5: «в table-header и table-row от края
 * таблицы до первой ячейки есть дополнительный отступ в 8 px. Правило не
 * действует [для] закреп[а] столбца с правой стороны (pinned)». То же самое
 * записано в пакете дизайнера: «у строки поле 8 + ячейка 8 — обе ветки встают
 * в 16 от края».
 *
 * ⚠️ Поле у `<tr>` не выразить — padding у строки таблицы не работает вовсе.
 * Поэтому оно переезжает в ПЕРВУЮ ячейку: её левое поле становится 16, а
 * объявленная ширина растёт на те же 8 ({@link edgeColumnWidth}). Без второй
 * половины правки служебная колонка с фиксированной шириной (чекбокс — 48)
 * получила бы поля 16+16 при коробке 24 и вылезла бы в соседнюю.
 *
 * Заливку строки это не задевает: поле лежит ВНУТРИ ячейки, а фон `<tr>`
 * красит всю её коробку — правило кита «состояния с заливкой идут без
 * отступов» остаётся в силе.
 */
const ROW_EDGE_PADDING = 8

/** Левое поле первой ячейки: собственные 8 ячейки + {@link ROW_EDGE_PADDING}. */
const EDGE_PADDING_CLASS = "pl-4"

/** Ширина первой колонки с учётом поля строки. */
function edgeColumnWidth(width: number | undefined, edge: boolean) {
  if (!edge || width === undefined) return width
  return width + ROW_EDGE_PADDING
}

/** «С каждым уровнем вложенности контент сдвигвается вправо на 16px». */
const NESTING_INDENT = 16

/**
 * Сколько ширины окна прокрутки обязано остаться подвижным столбцам.
 *
 * Предел есть только у ЗАКРЕПЛЁННОЙ колонки: растянув её, можно было
 * съесть всю видимую ширину — закреп занимал бы окно целиком, а
 * горизонтальная прокрутка схлопывалась вместе с содержимым, которое она
 * должна показывать. У обычной колонки предела нет намеренно: она
 * растягивает СОДЕРЖИМОЕ и добавляет прокрутки, а не гасит её.
 */
const MIN_SCROLLABLE_REST = 160

/**
 * Horizontal padding for one cell. Base is the 8px both sides that keeps
 * every row on the same grid ("Для совпадения левого отступа все строки
 * таблицы используют внутренние паддинги по 8px с обеих сторон"); a pinned
 * block then drops the padding on the side it is anchored to — "Если есть
 * левый закреп — то у закрепа левый паддинг 8px, правый 0. У подвижной части
 * — левый паддинг 0px, правый 8px", and the right pin "не получает
 * дополнительных отступов, поскольку содержит только кнопку с иконкой и
 * имеет строго фиксированную ширину".
 *
 * Two cell types are exempt because their own master pins their width and
 * would be broken by the grid rule (`ownPadding`): the action cell's 10px
 * ring around a 32px icon button is what makes the pinned column exactly
 * 52px wide, and the body Checkbox cell is `pl-8 pr-16` around its 24px box
 * (48px total) rather than symmetric — read off `ELK / table-cell` in the
 * anatomy frame (node 70279:6915), where Figma's own annotations label the
 * gap after the checkbox as 16.
 */
function cellPaddingXClass(pin: TablePin | undefined, ownPadding: boolean) {
  if (ownPadding) return undefined
  if (pin === "left") return "pr-0 pl-2"
  if (pin === "right") return "px-0"
  return "px-2"
}

/**
 * Ширина содержательной колонки по умолчанию.
 *
 * Дизайн-чек от 08.09, замечание 6: «В таблицах есть колонки, которые тянутся
 * на остаток ширины. Эту механику из всех таблиц продукта нужно полностью
 * убрать». Колонка без объявленной ширины при `table-layout: fixed` забирала
 * весь остаток блока — теперь она получает эту ширину, а остаток уходит в
 * хвостовой `spacer` (см. `DataTable`).
 *
 * 200 — не «на глаз»: столько же в эталонах у обычной текстовой колонки
 * («Сумма» 200, «Дата операции» 180 в D7), это середина реального разброса.
 */
const DEFAULT_COLUMN_WIDTH = 200

// Fixed widths for the control columns, straight off their Figma masters:
// the Checkbox title cell is 48 wide (pl-8 + 24 + gap-15 + the 1px rule),
// Collapse and Icon are 32 (px-8 around a 16px glyph), and Button/Filler are
// the 52px of the pinned action block ("столбец ... имеет строго
// фиксированную ширину"). Content can't establish these under
// `table-layout: fixed`, where only the first row's declared widths count —
// without them the checkbox column collapses to its padding.
const CONTROL_COLUMN_WIDTH: Partial<Record<TableHeadCellType, number>> = {
  checkbox: 48,
  collapse: 32,
  icon: 32,
  button: 52,
  filler: 52,
}

/**
 * Per-type vertical padding of a title cell, pixel-confirmed against the
 * spec's own "ELK / table-title-cell" master: Subtitle is py-[14px] (the
 * default), Checkbox py-3 (12px), Icon and Collapse py-4 (16px around their
 * 16/24px box) and Filler py-3 around a bare 24px divider. Button collapses
 * to a uniform p-2 (8px) since it wraps its own 32px `icon-sm` Button
 * already — that `p-2` also sets the horizontal padding, so
 * {@link headCellPaddingXClass} skips it.
 */
function headCellPaddingYClass(type: TableHeadCellType) {
  switch (type) {
    // У хвостового остатка полей нет вовсе: его высоту задают соседи, а
    // собственные отступы только помешали бы им.
    case "spacer":
      return "p-0"
    case "checkbox":
    case "filler":
      return "py-3"
    case "icon":
    case "collapse":
      return "py-4"
    case "button":
      return "p-2"
    default:
      return "py-[14px]"
  }
}

/**
 * ⚠️ Асимметрия из кита, и это НЕ промах: справа 7, потому что оставшийся
 * пиксель забирает разделитель колонок — визуально поля одинаковые по 8.
 * Действует только там, где разделитель действительно есть и где ячейку не
 * прижимает закреп (у закрепа свои поля: слева 8, справа 0).
 */
function headCellPaddingXClass(
  type: TableHeadCellType,
  pin: TablePin | undefined,
  hasDivider: boolean
) {
  if (type === "button" || type === "spacer") return undefined // поля задаёт `headCellPaddingYClass`
  if (pin) return cellPaddingXClass(pin, false)
  return hasDivider ? "pl-2 pr-[7px]" : "px-2"
}

/**
 * Per-type vertical padding of a body cell, so that every one of them lands
 * on the spec's 52px row: Checkbox py-14 around a 24px box, Icon/Collapse
 * py-18 around 16px, Text py-16 around a 20px line, Tag py-15 around the
 * 22px tag and Button p-10 around the 32px icon button (get_design_context
 * on `ELK / table-cell`).
 */
function cellPaddingYClass(type: TableCellType) {
  switch (type) {
    case "spacer":
      return "p-0"
    case "checkbox":
      return "py-[14px] pl-2 pr-4"
    case "icon":
    case "collapse":
      return "py-[18px]"
    case "tag":
      return "py-[15px]"
    case "button":
      return "p-[10px]"
    default:
      return "py-4"
  }
}

/**
 * Column divider — a 1px × 24px rounded rule at the cell's right edge,
 * drawn by `ELK / table-title-cell` itself for every titled type as well as
 * the Filler that sits above the pinned action block ("Филлер размещается
 * над правым закрепленным блоком действий"). Icon and Button have none.
 */
function hasColumnDivider(type: TableHeadCellType) {
  return (
    type === "checkbox" ||
    type === "filler" ||
    type === "subtitle-left" ||
    type === "subtitle-right"
  )
}

/** Типы, чья ячейка сжимается до содержимого и центрирует его. */
function isControlType(type: TableHeadCellType | TableCellType) {
  return (
    type === "checkbox" ||
    type === "icon" ||
    type === "button" ||
    type === "collapse" ||
    type === "filler"
  )
}

export {
  CONTROL_COLUMN_WIDTH,
  DEFAULT_COLUMN_WIDTH,
  EDGE_PADDING_CLASS,
  MIN_COLUMN_WIDTH,
  MIN_SCROLLABLE_REST,
  NESTING_INDENT,
  ROW_EDGE_PADDING,
  edgeColumnWidth,
  cellPaddingXClass,
  cellPaddingYClass,
  hasColumnDivider,
  headCellPaddingXClass,
  headCellPaddingYClass,
  isControlType,
}
