import type * as React from "react"

import { TableHeadCell } from "./head-cell"
import { TableHeader } from "./table"
import { headCellType } from "./table-columns"
import type { useDataTableModel } from "./use-data-table-model"

// Шапка таблицы по конфигу полей. Вынесена из `DataTable` вместе с телом:
// обе части читаются как разметка, только когда не соседствуют с выводом
// модели.

type Model<Row> = ReturnType<typeof useDataTableModel<Row>>

interface DataTableHeadProps<Row> {
  model: Model<Row>
  selectable: boolean
  headMenu?: React.ReactNode
}

function DataTableHead<Row>({
  model,
  selectable,
  headMenu,
}: DataTableHeadProps<Row>) {
  const {
    columns,
    hierarchyKey,
    hierarchical,
    selectionPin,
    extraActions,
    activeSort,
    handleSortClick,
    anyExpanded,
    toggleExpandedAll,
    allSelected,
    someSelected,
    toggleSelectedAll,
    columnDefaultWidth,
    columnResizable,
    minColumnWidth,
  } = model

  return (
    <TableHeader>
      <tr>
        {selectable && (
          <TableHeadCell
            type="checkbox"
            edge
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
            // Поле строки забирает ПЕРВАЯ ячейка — ею колонка становится
            // только без колонки выбора (дизайн-чек «Storybook 3» №5).
            edge={!selectable && field.key === columns[0]?.key}
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
            resizable={columnResizable(field)}
            defaultWidth={columnDefaultWidth(field)}
            minWidth={field.minWidth ?? minColumnWidth}
          >
            {field.title}
          </TableHeadCell>
        ))}

        {/* ⚠️ ХВОСТОВОЙ ОСТАТОК ШИРИНЫ — отдельный пустой столбец.

            Дизайн-чек от 08.09, замечание 6: «В таблицах есть колонки,
            которые тянутся на остаток ширины… эту механику из всех таблиц
            продукта нужно полностью убрать». Появилась она не намеренно: при
            `table-layout: fixed` и `width: 100%` браузер раздаёт
            неразобранную ширину блока колонкам БЕЗ объявленной ширины,
            поэтому одна колонка без `width` съедала весь остаток (замерено
            на D7: «Операция» 329px против объявленных 180/200/180).

            Правило теперь такое: КАЖДАЯ содержательная колонка имеет ширину —
            объявленную или из `DEFAULT_COLUMN_WIDTH`, — а остаток забирает
            этот столбец. Он пустой, без подписи и разделителя, и нужен ровно
            затем, чтобы линия под шапкой и заливка строки доходили до правого
            края блока. Когда колонки шире блока, он схлопывается в ноль и
            включается обычная горизонтальная прокрутка.

            Стоит ПЕРЕД правым закрепом: закреплённая ячейка остаётся в потоке
            на своём месте, и остаток справа от неё оторвал бы её от края. */}
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
  )
}

export { DataTableHead }
export type { Model as DataTableModel }
