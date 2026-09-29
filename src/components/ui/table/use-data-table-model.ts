import * as React from "react"

import { compactList } from "@/components/ui/header-menu/compact-list"
import { NESTED_CONTROL_SELECTOR, endsTextSelection, fromNestedControl } from "@/lib/press"

import type { DataTableProps } from "./data-table-props"
import { TABLE_FIELD_TYPES } from "./field-types"
import { CONTROL_COLUMN_WIDTH, DEFAULT_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from "./geometry"
import type { TablePin } from "./pin"
import {
  collectUnitVariants,
  hierarchyColumnKey,
  resolveColumns,
} from "./table-columns"
import { flatten } from "./table-rows"
import { useAddedRows } from "./use-added-rows"
import { useColumnWidths } from "./use-column-widths"
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
  fields: fieldsProp,
  rows: rowsProp,
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
  highlightAddedRows = true,
  rowActions,
  columnSettings: columnSettingsProp,
  resizable = true,
  columnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
  total,
}: DataTableProps<Row>) {
  // Пустые элементы (`cond && field`, `cond && row`) отбрасываются: иначе
  // `field.hidden` и `row.id` падали на `false`/`null`. Без пустых отдаётся
  // тот же массив — ссылка для `useMemo` остаётся стабильной.
  const fields = compactList(fieldsProp) ?? []
  const rows = compactList(rowsProp) ?? []
  const columnSettings = compactList(columnSettingsProp)
  const { columnWidth, setColumnWidth } = useColumnWidths({
    columnWidths,
    defaultColumnWidths,
    onColumnWidthsChange,
  })
  const childrenOf = React.useCallback(
    (row: Row) =>
      compactList(getChildren ? getChildren(row) : (row as { children?: Row[] }).children),
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
  // Ключ строки фиксируется по её месту в ИСХОДНЫХ данных. У строки без `id`
  // и без `getRowKey` ключ — это путь по индексам, и считай его после
  // сортировки, он переезжал бы на ту строку, что встала на её место:
  // выбор, подсветка и `key` React прыгали бы на соседнюю строку.
  //
  // ⚠️ Исходные ключи хранятся СПИСКОМ на объект и по родителю: один и тот же
  // объект вправе стоять в `rows` несколько раз (`Array(n).fill(row)`, общий
  // ребёнок у двух групп). Отображение «объект → один ключ» выдавало всем его
  // вхождениям ключ последнего — одинаковые `key` у React и выбор, который
  // отмечал сразу все копии.
  const { allRows, originalKeys } = React.useMemo(() => {
    const index = new Map<string, Map<Row, string[]>>()
    const flat = flatten(rows, childrenOf, (row, i, path, parentKey) => {
      const key = keyOf(row, i, path)
      let siblings = index.get(parentKey)
      if (!siblings) index.set(parentKey, (siblings = new Map()))
      const keys = siblings.get(row)
      if (keys) keys.push(key)
      else siblings.set(row, [key])
      return key
    })
    return { allRows: flat, originalKeys: index }
  }, [rows, childrenOf, keyOf])
  const hierarchical = allRows.some((entry) => entry.hasChildren)

  const { activeSort, handleSortClick, sortedRows } = useTableSort({
    fields,
    columns,
    rows,
    hierarchical,
    sort,
    onSortChange,
    manualSort,
  })

  const { anyExpanded, isExpanded: isExpandedByState, toggleExpanded, toggleExpandedAll } =
    useTableExpansion({
      allRows,
      expandedKeys,
      onExpandedKeysChange,
      defaultCollapsed,
    })

  const hierarchyKey = React.useMemo(
    () => hierarchyColumnKey(columns, hierarchical),
    [columns, hierarchical]
  )
  // Столбца, который несёт шевроны, нет (столбец дерева скрыт через
  // `columnSettings`, и другого текстового не осталось) — дерево
  // показывается раскрытым: иначе вложенные строки свёрнутого дерева было
  // нечем раскрыть, и они пропадали из таблицы (аудит 18).
  const isExpanded = React.useCallback(
    (key: string) => (hierarchical && hierarchyKey === undefined) || isExpandedByState(key),
    [hierarchical, hierarchyKey, isExpandedByState]
  )

  // Вхождения одного объекта у одного родителя разбирают его исходные ключи
  // по очереди — так у каждой копии свой ключ, и он не зависит от сортировки.
  const visibleRows = React.useMemo(() => {
    const used = new Map<string, Map<Row, number>>()
    return flatten(
      sortedRows,
      childrenOf,
      (row, index, path, parentKey) => {
        const keys = originalKeys.get(parentKey)?.get(row)
        if (!keys) return keyOf(row, index, path)
        let counts = used.get(parentKey)
        if (!counts) used.set(parentKey, (counts = new Map()))
        const taken = counts.get(row) ?? 0
        counts.set(row, taken + 1)
        return keys[Math.min(taken, keys.length - 1)]
      },
      isExpanded
    )
  }, [sortedRows, childrenOf, originalKeys, keyOf, isExpanded])

  // Появившиеся строки подсвечиваются САМИ — корневое правило таблиц
  // (дизайн-чек от 08.09, замечание 30). `isRowAdded` остаётся ручным
  // перекрытием: экран, который знает про «новизну» больше таблицы
  // (например, отличает свою только что созданную заявку от чужой,
  // приехавшей обновлением), решает сам, и автоопределение ему мешать не
  // должно. `highlightAddedRows={false}` выключает автоопределение для
  // экрана, который режет страницу сам (см. проп).
  //
  // ⚠️ У строк без `id` и без `getRowKey` ключ — позиция. По позиционным
  // ключам появление не определить: строка, вставленная в начало, сдвигает
  // остальные, и «новым» оказывается ключ последней позиции — подсвечивалась
  // старая строка, а новая нет (аудит 21). Такой таблице автоподсветку не
  // включаем; экран, которому она нужна, даёт строкам `id` или `getRowKey`.
  const positionalKeys =
    !getRowKey &&
    allRows.some((entry) => (entry.row as { id?: string | number }).id == null)
  const autoAdded = useAddedRows(
    React.useMemo(() => allRows.map((entry) => entry.key), [allRows]),
    isRowAdded === undefined && highlightAddedRows && !positionalKeys
  )

  const {
    allSelected,
    selectAllDisabled,
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
  // `span` из расчёта (`0/0`, не пришедшее число) не должен давать NaN: он шёл
  // в `colSpan` и в `slice`, и хвост итога повторял все колонки.
  const requestedSpan = Number.isFinite(total?.span) ? Math.floor(total?.span ?? 1) : 1
  const totalSpanColumns = Math.min(Math.max(requestedSpan, 1), columns.length)
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
      // ⚠️ Поиск ограничен самой строкой: без этого `closest` уходил к
      // предкам таблицы, и внутри кликабельного блока (`role="button"`),
      // `<label>` или `[role=option]` строка не открывалась никогда.
      const hit = (event.target as Element).closest(INTERACTIVE_SELECTOR)
      if (hit && event.currentTarget.contains(hit)) return
      // Протяжка мышью по тексту строки (номер счёта — скопировать) — не
      // переход: та же проверка, что у кликабельных карточек (press.ts).
      // Enter/Space на строке — не протяжка: выделение тут ни при чём.
      if (!event.currentTarget.hasAttribute("data-key-activation") && endsTextSelection(event))
        return
      onRowClick(row, key)
    }
  }

  /** Ширина столбца по умолчанию: служебные типы берут свою из мастера. */
  function columnDefaultWidth(field: (typeof columns)[number]) {
    if (field.width !== undefined) return field.width
    // Поле-флажок стоит под обычной шапкой `subtitle-left`, у которой своей
    // служебной ширины нет: без неё при `table-layout: fixed` столбец делил
    // остаток блока с хвостовым spacer и забирал половину свободной ширины.
    if (field.type === "checkbox") return CONTROL_COLUMN_WIDTH.checkbox
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
    selectAllDisabled,
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
    columnWidth,
    setColumnWidth,
    minColumnWidth: MIN_COLUMN_WIDTH,
  }
}

export { useDataTableModel, INTERACTIVE_SELECTOR }
