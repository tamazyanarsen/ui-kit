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
  /** Видимые столбцы — сортировка по умолчанию берётся только среди них. */
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

  // ⚠️ Сортировка по умолчанию ищется в порядке ОБЪЯВЛЕНИЯ полей, а не в
  // порядке столбцов после настройки: иначе перестановка столбцов в
  // «Настроить столбцы» молча пересортировывала бы строки по другому полю.
  // Скрытый столбец в расчёт не идёт — сортировку, индикатора которой нигде
  // не видно, пользователь прочитать не может. По той же причине своя
  // сортировка по столбцу, который потом скрыли, уступает умолчанию.
  const visibleKeys = new Set(columns.map((field) => field.key))
  const firstSortable = hierarchical
    ? undefined
    : fields.find((field) => field.sortable && visibleKeys.has(field.key))
  const fallbackSort: TableSort | null = firstSortable
    ? { key: firstSortable.key, direction: "asc" }
    : null
  const visibleOwnSort =
    ownSort && visibleKeys.has(ownSort.key) ? ownSort : null
  const activeSort =
    sort !== undefined ? sort : (visibleOwnSort ?? fallbackSort)

  function handleSortClick(key: string) {
    const next: TableSort =
      activeSort?.key === key
        ? { key, direction: activeSort.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    if (sort === undefined) setOwnSort(next)
    onSortChange?.(next)
  }

  // ⚠️ Зависимости — ключ и направление, а не сам объект сортировки:
  // `fallbackSort` собирается заново на каждом рендере, и с ним в
  // зависимостях строки пересортировывались бы на любой ховер, выбор или
  // раскрытие — на тысячах строк это тысячи `localeCompare` на каждый рендер.
  const sortKey = activeSort?.key
  const sortDirection = activeSort?.direction
  const sortedRows = React.useMemo(() => {
    if (manualSort || !sortKey || !sortDirection || hierarchical) return rows
    const field = fields.find((item) => item.key === sortKey)
    if (!field) return rows
    return sortRows(rows, field, sortDirection)
  }, [rows, fields, sortKey, sortDirection, manualSort, hierarchical])

  return { activeSort, handleSortClick, sortedRows }
}

export { useTableSort }
export type { TableSort }
