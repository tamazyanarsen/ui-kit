import * as React from "react"

import type { TableField } from "./field-types"
import { sortRows } from "./table-rows"

/** Текущая сортировка: столбец и направление. */
interface TableSort {
  key: string
  direction: "asc" | "desc"
}

interface TableSortOptions<Row> {
  /** Все объявленные поля — среди них ищется поле активной сортировки. */
  fields: TableField<Row>[]
  /** Видимые столбцы — по ним выбирается сортировка по умолчанию. */
  columns: TableField<Row>[]
  rows: Row[]
  /** В таблице есть вложенность. */
  hierarchical: boolean
  sort?: TableSort | null
  onSortChange?: (sort: TableSort) => void
  manualSort?: boolean
}

/**
 * Сортировка таблицы: активный столбец, переключение направления и сами
 * отсортированные строки.
 *
 * ⚠️ «В таблицах со сворачиванием/разворачиванием не предусмотрена
 * пользовательская сортировка — она невозможна без нарушения вложенностей»,
 * поэтому у дерева сортировка выключена целиком, а не только у столбца
 * иерархии.
 *
 * ⚠️ Сортировка есть всегда: не задана снаружи и ещё не выбрана
 * пользователем — берётся первый столбец с `sortable` по возрастанию («По
 * умолчанию всегда есть столбец, по которому отсортированы данные»). Круг
 * замкнут на двух направлениях: нажатием сортировку не сбросить, иначе строки
 * остались бы переставленными, а критерий ушёл бы из виду.
 */
function useTableSort<Row>({
  fields,
  columns,
  rows,
  hierarchical,
  sort,
  onSortChange,
  manualSort = false,
}: TableSortOptions<Row>) {
  const [ownSort, setOwnSort] = React.useState<TableSort | null>(null)

  const firstSortable = hierarchical
    ? undefined
    : columns.find((field) => field.sortable)
  const fallbackSort: TableSort | null = firstSortable
    ? { key: firstSortable.key, direction: "asc" }
    : null
  const activeSort = sort !== undefined ? sort : (ownSort ?? fallbackSort)

  function handleSortClick(key: string) {
    const next: TableSort =
      activeSort?.key === key
        ? { key, direction: activeSort.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    if (sort === undefined) setOwnSort(next)
    onSortChange?.(next)
  }

  const sortedRows = React.useMemo(() => {
    if (manualSort || !activeSort || hierarchical) return rows
    const field = fields.find((item) => item.key === activeSort.key)
    if (!field) return rows
    return sortRows(rows, field, activeSort.direction)
  }, [rows, fields, activeSort, manualSort, hierarchical])

  return { activeSort, handleSortClick, sortedRows }
}

export { useTableSort }
export type { TableSort }
