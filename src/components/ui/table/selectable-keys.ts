import { flatten } from "./table-rows"

// Разделение обязанностей у массового выбора:
//
//   • чекбокс в ШАПКЕ таблицы выбирает СТРАНИЦУ — то есть те строки, что
//     сейчас видны (свёрнутая вложенность в выбор не идёт, см.
//     `useTableSelection`);
//   • кнопка «Выбрать на всех страницах (N)» живёт в полосе действий
//     (`ButtonMenuBlack`), а полоса — часть страницы, не таблицы;
//   • набор строк ПОД ТЕКУЩИМ ОТБОРОМ СО ВСЕХ СТРАНИЦ считает эта функция.
//
// Последнее — главное. Отбор живёт в блоке (поиск по всем ячейкам, чипы по
// колонкам, раздел через фильтр вкладок, дерево с детьми), и вторая копия
// расчёта на странице разошлась бы молча: в кнопке одно число, выбралось бы
// другое. Поэтому «выбрать все» внутри таблицы и число в кнопке считаются
// ОДНОЙ функцией — этой.
//
// ⚠️ Пагинация — не отбор. Сюда передаются все отобранные строки, а не
// текущая страница: иначе «выбрать на всех страницах» выбирало бы ровно ту
// же страницу, что и чекбокс шапки.

interface SelectableRowKeysOptions<Row> {
  /** Ключ строки — та же функция, что у `DataTable`. По умолчанию `row.id`. */
  getRowKey?: (row: Row, index: number) => string
  /** Вложенные строки. По умолчанию — `row.children`. */
  getChildren?: (row: Row) => Row[] | undefined
  /** Строки, которые выбрать нельзя. */
  isRowSelectable?: (row: Row) => boolean
}

/**
 * Ключи всех выбираемых строк дерева — включая свёрнутых детей.
 *
 * Возвращает готовый массив: его же и передают в `selectedKeys` по нажатию
 * «Выбрать на всех страницах», а его длину — в `selectAllPagesCount`.
 */
function selectableRowKeys<Row>(
  rows: Row[],
  { getRowKey, getChildren, isRowSelectable }: SelectableRowKeysOptions<Row> = {}
): string[] {
  const childrenOf = (row: Row) =>
    getChildren ? getChildren(row) : (row as { children?: Row[] }).children
  const keyOf = (row: Row, index: number, path: string) =>
    getRowKey
      ? getRowKey(row, index)
      : ((row as { id?: string | number }).id?.toString() ?? path)

  // `flatten` без `isExpanded` раскладывает дерево целиком — свёрнутость
  // строки на отбор не влияет.
  return flatten(rows, childrenOf, keyOf)
    .filter((entry) => !isRowSelectable || isRowSelectable(entry.row))
    .map((entry) => entry.key)
}

export { selectableRowKeys }
export type { SelectableRowKeysOptions }
