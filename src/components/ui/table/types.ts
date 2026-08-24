// Типы ячеек таблицы. Вынесены отдельно, чтобы геометрия
// (`geometry.ts`) могла на них опираться, не завися от компонентов.

/** Тип ячейки шапки — «Type» у мастера `ELK / table-title-cell`. */
type TableHeadCellType =
  | "checkbox"
  | "collapse"
  | "subtitle-left"
  | "subtitle-right"
  | "icon"
  | "button"
  | "filler"

/** Тип ячейки данных — «Type» у мастера `ELK / table-cell`. */
type TableCellType =
  | "checkbox"
  | "collapse"
  | "icon"
  | "text"
  | "number"
  | "tag"
  | "button"

export type { TableCellType, TableHeadCellType }
