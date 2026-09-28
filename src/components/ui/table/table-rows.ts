import type { TableField } from "./field-types"
import { fieldSortValue } from "./field-value"

// Работа со списком строк: разложить дерево в плоский список и отсортировать
// его. Обе функции чистые — состояние таблицы про них ничего не знает.

/** Строка, разложенная в плоский список для отрисовки. */
interface FlatRow<Row> {
  row: Row
  key: string
  level: number
  hasChildren: boolean
}

/**
 * Дерево строк в плоский список: уровень вложенности и наличие детей.
 *
 * `keyOf` получает и ключ родителя (`""` у корня) — по нему таблица ищет
 * исходное место строки среди детей ТОГО ЖЕ родителя.
 */
function flatten<Row>(
  rows: Row[],
  childrenOf: (row: Row) => Row[] | undefined,
  keyOf: (row: Row, index: number, path: string, parentKey: string) => string,
  isExpanded?: (key: string) => boolean,
  level = 0,
  parentPath = "",
  parentKey = ""
): FlatRow<Row>[] {
  const result: FlatRow<Row>[] = []
  rows.forEach((row, index) => {
    const path = parentPath ? `${parentPath}.${index}` : String(index)
    const key = keyOf(row, index, path, parentKey)
    const children = childrenOf(row) ?? []
    result.push({ row, key, level, hasChildren: children.length > 0 })
    if (children.length > 0 && (!isExpanded || isExpanded(key))) {
      result.push(
        ...flatten(children, childrenOf, keyOf, isExpanded, level + 1, path, key)
      )
    }
  })
  return result
}

/** Сортировка по полю. Пустые значения всегда внизу — в обе стороны. */
function sortRows<Row>(
  rows: Row[],
  field: TableField<Row>,
  direction: "asc" | "desc"
): Row[] {
  const sign = direction === "asc" ? 1 : -1
  return [...rows].sort((a, b) => {
    if (field.compare) return field.compare(a, b) * sign
    const left = fieldSortValue(field, a)
    const right = fieldSortValue(field, b)
    if (left === null && right === null) return 0
    if (left === null) return 1
    if (right === null) return -1
    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * sign
    }
    return String(left).localeCompare(String(right), "ru") * sign
  })
}

/**
 * Сортировка строк по конфигу полей — та же, что делает `DataTable`.
 *
 * Нужна экрану с пагинацией: таблице туда уходит уже вырезанная страница, и
 * её собственная сортировка переставляла бы строки только внутри страницы.
 * Экран сортирует ВЕСЬ отбор этой функцией, режет страницу и отдаёт таблице
 * `manualSort`. `null` или незнакомый ключ — порядок как есть.
 */
function sortTableRows<Row>(
  rows: Row[],
  fields: TableField<Row>[],
  sort: { key: string; direction: "asc" | "desc" } | null
): Row[] {
  const field = sort ? fields.find((item) => item.key === sort.key) : undefined
  return sort && field ? sortRows(rows, field, sort.direction) : rows
}

export { flatten, sortRows, sortTableRows }
export type { FlatRow }
