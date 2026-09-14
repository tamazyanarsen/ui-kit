/* Дизайн-чек от 13.09, замечание 6: «Удалить компонент Filter. На скрине
   выделен какой-то дубликат. У нас есть только компонент Filter-table и он
   уже реализован в нашем ките».

   Папка `filter/` расформирована: её содержимое переехало сюда целиком, а
   сам компонент `Filter` переименован в `FilterTableSelect` — он и был
   пилюлей `ELK / filter-table` с выпадающим списком, то есть не соседом
   `FilterTable`, а его же поведением. Отдельной витрины у него больше нет:
   раскрытый фильтр показывает история `Filter Table`. */
export { FilterTable, filterTablePillClass } from "./filter-table"
export type { FilterTableProps } from "./filter-table"
export { FilterTableSelect } from "./filter-table-select"
export type { FilterTableSelectProps } from "./filter-table-select"
export { FilterShell, filterApplyLabel } from "./shell"
export type { FilterShellProps } from "./shell"
export { FilterSelect } from "./filter-select"
export type {
  FilterSelectProps,
  FilterSelectOption,
  FilterSelectGroup,
} from "./filter-select"
export { FilterRange } from "./filter-range"
export type { FilterRangeProps } from "./filter-range"
export { FilterDate, datePresetWeek } from "./filter-date"
export type { FilterDateProps, FilterDatePreset } from "./filter-date"
export { FilterBoolean } from "./filter-boolean"
export type { FilterBooleanProps } from "./filter-boolean"
