// Типы ячеек таблицы. Вынесены отдельно, чтобы геометрия
// (`geometry.ts`) могла на них опираться, не завися от компонентов.

/**
 * Тип ячейки шапки — «Type» у мастера `ELK / table-title-cell`.
 *
 * `spacer` — единственный тип, которого в мастере нет: это пустой хвостовой
 * столбец, забирающий остаток ширины блока. Он появился, чтобы УБРАТЬ
 * растягивание содержательных колонок (дизайн-чек от 08.09, замечание 6),
 * см. комментарий к `DataTable`.
 */
type TableHeadCellType =
  | "checkbox"
  | "collapse"
  | "subtitle-left"
  | "subtitle-right"
  | "icon"
  | "button"
  | "filler"
  | "spacer"

/** Тип ячейки данных — «Type» у мастера `ELK / table-cell` (+ `spacer`). */
type TableCellType =
  | "checkbox"
  | "collapse"
  | "icon"
  | "text"
  | "number"
  | "tag"
  | "button"
  | "spacer"

export type { TableCellType, TableHeadCellType }
