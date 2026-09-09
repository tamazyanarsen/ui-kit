import * as React from "react"

import { TableBlockEmpty } from "./block"
import { TableCell } from "./cell"
import type { DataTableProps } from "./data-table-props"
import { fieldCellProps } from "./field-cell"
import { TABLE_FIELD_TYPES } from "./field-types"
import { DEFAULT_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from "./geometry"
import { TableHeadCell } from "./head-cell"
import type { TablePin } from "./pin"
import { Table, TableBody, TableHeader, TableRow } from "./table"
import {
  collectUnitVariants,
  headCellType,
  hierarchyColumnKey,
  resolveColumns,
} from "./table-columns"
import { flatten } from "./table-rows"
import { useAddedRows } from "./use-added-rows"
import { useTableExpansion } from "./use-table-expansion"
import { useTableSelection } from "./use-table-selection"
import { useTableSort } from "./use-table-sort"

// DataTable — таблица, собранная по конфигу полей.
//
// Место использования передаёт ДАННЫЕ и ОПИСАНИЕ полей; разметку строк и
// ячеек собирает компонент: по типу поля выбирается вариант ячейки из сета и
// форматирование значения (см. `field-types.ts` и `field-cell.tsx`).
// Поведение живёт в трёх хуках рядом — `use-table-sort`,
// `use-table-expansion`, `use-table-selection`: каждое из их правил
// («сортировку нажатием не сбросить», «сворачивание до первого уровня»,
// «выбор всех ВИДИМЫХ строк») требует знания всей таблицы, а не отдельной
// ячейки.
//
// Композиционный API (`Table` + `TableRow` + `TableCell`) остаётся: на нём
// собираются таблицы, которых конфиг не описывает. `DataTable` построен НА
// НЁМ, а не рядом с ним, поэтому расхождения между ними не бывает.

/**
 * Узлы, на которых нажатие НЕ считается нажатием на строку.
 *
 * ⚠️ Ролей здесь столько же, сколько тегов, и это не перестраховка: чекбокс
 * кита — это `<span role="checkbox">` (так его рисует Base UI), а не `input`
 * и не `button`. Без роли нажатие по нему одновременно переключало бы выбор
 * и уводило на карточку.
 */
const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "label",
  "[role='checkbox']",
  "[role='button']",
  "[role='menuitem']",
  "[data-slot='table-resize-handle']",
].join(", ")

function DataTable<Row>({
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
  gridLines = false,
  headMenu,
  empty,
  fixed = true,
  stickyHeader = true,
  className,
  containerClassName,
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
    () => flatten(sortedRows, childrenOf, keyOf, isExpanded),
    [sortedRows, childrenOf, keyOf, isExpanded]
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
  const extraActions = rowActions && !hasActionsField

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

  // ⚠️ ХВОСТОВОЙ ОСТАТОК ШИРИНЫ — отдельный пустой столбец.
  //
  // Дизайн-чек от 08.09, замечание 6: «В таблицах есть колонки, которые
  // тянутся на остаток ширины… эту механику из всех таблиц продукта нужно
  // полностью убрать». Появилась она не намеренно: при `table-layout: fixed`
  // и `width: 100%` браузер раздаёт неразобранную ширину блока колонкам БЕЗ
  // объявленной ширины, поэтому одна колонка без `width` съедала весь
  // остаток (замерено на D7: «Операция» 329px против объявленных 180/200/180).
  //
  // Правило теперь такое: КАЖДАЯ содержательная колонка имеет ширину —
  // объявленную или {@link DEFAULT_COLUMN_WIDTH}, — а остаток забирает этот
  // столбец. Он пустой, без подписи и разделителя, и нужен ровно затем,
  // чтобы линия под шапкой и заливка строки доходили до правого края блока.
  // Когда колонки шире блока, он схлопывается в ноль и включается обычная
  // горизонтальная прокрутка.
  //
  // Стоит ПЕРЕД правым закрепом: закреплённая ячейка остаётся в потоке на
  // своём месте, и остаток справа от неё оторвал бы её от края.

  function handleRowClick(row: Row, key: string) {
    if (!onRowClick) return undefined
    return (event: React.MouseEvent<HTMLTableRowElement>) => {
      // Нажатие по чекбоксу, ссылке или кнопке действий — это не переход на
      // карточку: без проверки одно нажатие делало бы и то, и другое.
      if ((event.target as Element).closest(INTERACTIVE_SELECTOR)) return
      onRowClick(row, key)
    }
  }

  return (
    <>
      <Table
        fixed={fixed}
        stickyHeader={stickyHeader}
        gridLines={gridLines}
        className={className}
        containerClassName={containerClassName}
      >
        <TableHeader>
          <tr>
            {selectable && (
              <TableHeadCell
                type="checkbox"
                pin={selectionPin}
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleSelectedAll}
              />
            )}

            {columns.map((field) => (
              <TableHeadCell
                key={field.key}
                type={headCellType(field, headMenu)}
                pin={field.pin}
                icon={field.headIcon}
                menu={field.type === "actions" ? headMenu : undefined}
                collapsible={field.key === hierarchyKey}
                expanded={anyExpanded}
                onExpandedChange={toggleExpandedAll}
                sortable={Boolean(field.sortable) && !hierarchical}
                sortDirection={
                  activeSort?.key === field.key ? activeSort.direction : null
                }
                onSortClick={() => handleSortClick(field.key)}
                resizable={
                  (field.resizable ?? resizable) &&
                  !TABLE_FIELD_TYPES[field.type ?? "text"].control
                }
                defaultWidth={
                  field.width ??
                  (TABLE_FIELD_TYPES[field.type ?? "text"].control
                    ? undefined
                    : DEFAULT_COLUMN_WIDTH)
                }
                minWidth={field.minWidth ?? MIN_COLUMN_WIDTH}
              >
                {field.title}
              </TableHeadCell>
            ))}

            <TableHeadCell type="spacer" />

            {/* «Филлер размещается над правым закреплённым блоком действий,
                поскольку соответствующие ячейки строк не содержат общих
                названий или групповых действий». Меню таблицы, если оно
                есть, встаёт на то же место: своего столбца ему не нужно. */}
            {extraActions && (
              <TableHeadCell
                type={headMenu ? "button" : "filler"}
                pin="right"
                menu={headMenu}
              />
            )}
          </tr>
        </TableHeader>

        <TableBody>
          {visibleRows.map(({ row, key, level, hasChildren }) => (
            <TableRow
              key={key}
              clickable={Boolean(onRowClick)}
              selected={selected.has(key)}
              added={isRowAdded ? isRowAdded(row) : autoAdded.has(key)}
              onClick={handleRowClick(row, key)}
            >
              {selectable && (
                <TableCell
                  type="checkbox"
                  pin={selectionPin}
                  checked={selected.has(key)}
                  onCheckedChange={
                    !isRowSelectable || isRowSelectable(row)
                      ? () => toggleSelected(key)
                      : undefined
                  }
                />
              )}

              {columns.map((field) => (
                <TableCell
                  key={field.key}
                  pin={field.pin}
                  unitVariants={unitVariants[field.key]}
                  {...fieldCellProps(field, row)}
                  {...(field.key === hierarchyKey
                    ? {
                        level,
                        expandable: hasChildren,
                        expanded: isExpanded(key),
                        onExpandedChange: () => toggleExpanded(key),
                      }
                    : null)}
                />
              ))}

              <TableCell type="spacer" />

              {extraActions && (
                <TableCell type="button" pin="right" actions={rowActions(row)} />
              )}
            </TableRow>
          ))}

          {/* Итоговая строка. Стоит ПОСЛЕ строк данных и вне `visibleRows`,
              поэтому сортировка, сворачивание и отбор её не трогают — они
              работают только со списком `rows`. Внутри обычного `<tbody>`,
              значит при горизонтальной прокрутке едет вместе с телом.

              Первая ячейка перекрывает `span` ведущих колонок через
              `colSpan`, дальше идут ячейки хвоста — по одной на колонку,
              теми же типами и с тем же форматированием, что и в строках:
              левые кромки чисел совпадают с одноимёнными шапками. */}
          {total && (
            <TableRow data-slot="table-total-row">
              <TableCell
                type="text"
                pin={totalLeadingPin}
                colSpan={totalLeadingSpan}
                className="font-medium"
              >
                {total.label}
              </TableCell>

              {totalTailColumns.map((field) => (
                <TableCell
                  key={field.key}
                  pin={field.pin}
                  unitVariants={unitVariants[field.key]}
                  {...fieldCellProps(field, total.row)}
                />
              ))}

              <TableCell type="spacer" />

              {extraActions && <TableCell type="button" pin="right" />}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Пустой результат стоит ВНЕ прокручиваемой области таблицы: по
          документации он не уезжает вбок вместе с колонками. */}
      {empty && visibleRows.length === 0 && (
        <TableBlockEmpty>{empty}</TableBlockEmpty>
      )}
    </>
  )
}

export { DataTable }
