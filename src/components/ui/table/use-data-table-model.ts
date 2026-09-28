import * as React from "react"

import { NESTED_CONTROL_SELECTOR, fromNestedControl } from "@/lib/press"

import type { DataTableProps } from "./data-table-props"
import { TABLE_FIELD_TYPES } from "./field-types"
import { DEFAULT_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from "./geometry"
import type { TablePin } from "./pin"
import {
  collectUnitVariants,
  hierarchyColumnKey,
  resolveColumns,
} from "./table-columns"
import { flatten } from "./table-rows"
import { useAddedRows } from "./use-added-rows"
import { useTableExpansion } from "./use-table-expansion"
import { useTableSelection } from "./use-table-selection"
import { useTableSort } from "./use-table-sort"

// Вывод модели таблицы: из конфига полей и плоского списка строк получаются
// колонки, дерево, сортировка, выбор, сворачивание и геометрия итоговой
// строки.
//
// Вынесено из `DataTable` отдельным хуком, потому что это ДРУГАЯ задача:
// здесь нет ни одного узла разметки, только разбор входных данных. Пока всё
// лежало в одной функции, она была на 344 строки, и её разметка терялась
// среди двадцати `useMemo`.
//
// Хук ничего не решает сам — правила живут в `use-table-sort`,
// `use-table-expansion` и `use-table-selection`; здесь они только сводятся
// вместе в нужном порядке (сортировка → сворачивание → видимые строки →
// выбор по видимым).

/**
 * Узлы, на которых нажатие НЕ считается нажатием на строку, сверх общего
 * списка вложенного управления из `lib/press` (там же — отсев кликов,
 * всплывших из порталов: меню действий строки рисуется в `body`).
 *
 * ⚠️ Чекбокс кита — это `<span role="checkbox">` (так его рисует Base UI), а
 * не `input`: общий список поэтому держит и роли, а не только теги.
 */
const INTERACTIVE_SELECTOR = [
  NESTED_CONTROL_SELECTOR,
  "[data-slot='table-resize-handle']",
].join(", ")

function useDataTableModel<Row>({
  fields,
  rows,
  getRowKey,
  getChildren,
  selectable = false,
  selectedKeys,
  defaultSelectedKeys,
  onSelectedKeysChange,
  isRowSelectable,
  expandedKeys,
  onExpandedKeysChange,
  defaultCollapsed = false,
  sort,
  onSortChange,
  manualSort = false,
  onRowClick,
  isRowAdded,
  rowActions,
  columnSettings,
  resizable = true,
  total,
}: DataTableProps<Row>) {
  const childrenOf = React.useCallback(
    (row: Row) =>
      getChildren ? getChildren(row) : (row as { children?: Row[] }).children,
    [getChildren]
  )
  const keyOf = React.useCallback(
    (row: Row, index: number, path: string) =>
      getRowKey
        ? getRowKey(row, index)
        : ((row as { id?: string | number }).id?.toString() ?? path),
    [getRowKey]
  )

  const columns = React.useMemo(
    () => resolveColumns(fields, columnSettings),
    [fields, columnSettings]
  )

  // Все строки дерева — независимо от того, свёрнуты они сейчас или нет.
  // Отсюда берутся ширина слота знака и список сворачиваемых ключей: и то, и
  // другое не должно меняться от раскрытия строки.
  const allRows = React.useMemo(
    () => flatten(rows, childrenOf, keyOf),
    [rows, childrenOf, keyOf]
  )
  const hierarchical = allRows.some((entry) => entry.hasChildren)

  // Ключ строки фиксируется по её месту в ИСХОДНЫХ данных. У строки без `id`
  // и без `getRowKey` ключ — это путь по индексам, и считай его после
  // сортировки, он переезжал бы на ту строку, что встала на её место:
  // выбор, подсветка и `key` React прыгали бы на соседнюю строку.
  const keyByRow = React.useMemo(() => {
    const map = new Map<Row, string>()
    for (const entry of allRows) map.set(entry.row, entry.key)
    return map
  }, [allRows])
  const stableKeyOf = React.useCallback(
    (row: Row, index: number, path: string) =>
      keyByRow.get(row) ?? keyOf(row, index, path),
    [keyByRow, keyOf]
  )

  const { activeSort, handleSortClick, sortedRows } = useTableSort({
    fields,
    columns,
    rows,
    hierarchical,
    sort,
    onSortChange,
    manualSort,
  })

  const { anyExpanded, isExpanded, toggleExpanded, toggleExpandedAll } =
    useTableExpansion({
      allRows,
      expandedKeys,
      onExpandedKeysChange,
      defaultCollapsed,
    })

  const visibleRows = React.useMemo(
    () => flatten(sortedRows, childrenOf, stableKeyOf, isExpanded),
    [sortedRows, childrenOf, stableKeyOf, isExpanded]
  )

  // Появившиеся строки подсвечиваются САМИ — корневое правило таблиц
  // (дизайн-чек от 08.09, замечание 30). `isRowAdded` остаётся ручным
  // перекрытием: экран, который знает про «новизну» больше таблицы
  // (например, отличает свою только что созданную заявку от чужой,
  // приехавшей обновлением), решает сам, и автоопределение ему мешать не
  // должно.
  const autoAdded = useAddedRows(
    React.useMemo(() => allRows.map((entry) => entry.key), [allRows]),
    isRowAdded === undefined
  )

  const {
    allSelected,
    selected,
    someSelected,
    toggleSelected,
    toggleSelectedAll,
  } = useTableSelection({
    visibleRows,
    selectedKeys,
    defaultSelectedKeys,
    onSelectedKeysChange,
    isRowSelectable,
  })

  const hierarchyKey = React.useMemo(
    () => hierarchyColumnKey(columns, hierarchical),
    [columns, hierarchical]
  )
  const unitVariants = React.useMemo(
    () => collectUnitVariants(columns, allRows),
    [columns, allRows]
  )

  /** Колонка выбора идёт в левый закреп, если закреп в таблице есть: в
   * макете чекбокс и столбец иерархии стоят в одном липком блоке. */
  const selectionPin: TablePin | undefined = columns.some(
    (field) => field.pin === "left"
  )
    ? "left"
    : undefined

  // Столбец действий отдельным пропом — та же ячейка, что и поле типа
  // `actions`, только объявлять его в конфиге не нужно.
  const hasActionsField = columns.some((field) => field.type === "actions")
  const extraActions = Boolean(rowActions) && !hasActionsField

  // Геометрия итоговой строки. `span` считается по КОЛОНКАМ конфига, а
  // служебный столбец выбора добавляется сам: место применения про него не
  // знает, он включается пропом `selectable`.
  const totalSpanColumns = Math.min(
    Math.max(total?.span ?? 1, 1),
    columns.length
  )
  const totalLeadingSpan = totalSpanColumns + (selectable ? 1 : 0)
  const totalTailColumns = columns.slice(totalSpanColumns)
  // Первая ячейка живёт в левом закрепе только если он и правда закрывает
  // ВСЕ перекрытые ею колонки — иначе она уезжала бы вместе с телом лишь
  // частью себя.
  const totalLeadingPin: TablePin | undefined =
    selectionPin === "left" &&
    columns.slice(0, totalSpanColumns).every((field) => field.pin === "left")
      ? "left"
      : undefined

  function handleRowClick(row: Row, key: string) {
    if (!onRowClick) return undefined
    return (event: React.MouseEvent<HTMLTableRowElement>) => {
      // Нажатие по чекбоксу, ссылке или кнопке действий — это не переход на
      // карточку: без проверки одно нажатие делало бы и то, и другое.
      if (fromNestedControl(event)) return
      if ((event.target as Element).closest(INTERACTIVE_SELECTOR)) return
      onRowClick(row, key)
    }
  }

  /** Ширина столбца по умолчанию: служебные типы берут свою из мастера. */
  function columnDefaultWidth(field: (typeof columns)[number]) {
    if (field.width !== undefined) return field.width
    return TABLE_FIELD_TYPES[field.type ?? "text"].control
      ? undefined
      : DEFAULT_COLUMN_WIDTH
  }

  /** Тянется ли столбец за правую границу. */
  function columnResizable(field: (typeof columns)[number]) {
    return (
      (field.resizable ?? resizable) &&
      !TABLE_FIELD_TYPES[field.type ?? "text"].control
    )
  }

  return {
    columns,
    visibleRows,
    hierarchical,
    hierarchyKey,
    unitVariants,
    selectionPin,
    extraActions,
    activeSort,
    handleSortClick,
    anyExpanded,
    isExpanded,
    toggleExpanded,
    toggleExpandedAll,
    allSelected,
    someSelected,
    selected,
    toggleSelected,
    toggleSelectedAll,
    autoAdded,
    totalLeadingSpan,
    totalLeadingPin,
    totalTailColumns,
    handleRowClick,
    columnDefaultWidth,
    columnResizable,
    minColumnWidth: MIN_COLUMN_WIDTH,
  }
}

export { useDataTableModel, INTERACTIVE_SELECTOR }
