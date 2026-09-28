import { TableCell } from "./cell"
import type { DataTableModel } from "./data-table-head"
import type { DataTableProps } from "./data-table-props"
import { fieldCellProps } from "./field-cell"
import { TableBody, TableRow } from "./table"

// Тело таблицы по конфигу полей: строки данных и итоговая строка.

interface DataTableBodyProps<Row> {
  model: DataTableModel<Row>
  selectable: boolean
  isRowSelectable?: DataTableProps<Row>["isRowSelectable"]
  isRowAdded?: DataTableProps<Row>["isRowAdded"]
  onRowClick?: DataTableProps<Row>["onRowClick"]
  rowActions?: DataTableProps<Row>["rowActions"]
  total?: DataTableProps<Row>["total"]
}

function DataTableBody<Row>({
  model,
  selectable,
  isRowSelectable,
  isRowAdded,
  onRowClick,
  rowActions,
  total,
}: DataTableBodyProps<Row>) {
  const {
    columns,
    visibleRows,
    hierarchyKey,
    unitVariants,
    selectionPin,
    extraActions,
    isExpanded,
    toggleExpanded,
    selected,
    toggleSelected,
    autoAdded,
    totalLeadingSpan,
    totalLeadingPin,
    totalTailColumns,
    handleRowClick,
  } = model

  return (
    <TableBody>
      {visibleRows.map(({ row, key, level, hasChildren }) => {
        const rowSelectable = !isRowSelectable || isRowSelectable(row)
        return (
          <TableRow
            key={key}
            clickable={Boolean(onRowClick)}
            selected={selected.has(key)}
            added={isRowAdded ? isRowAdded(row) : autoAdded.has(key)}
            onClick={handleRowClick(row, key)}
          >
            {/* У строки, которую выбрать нельзя, чекбокса нет вовсе — так
                обещает `isRowSelectable`. Раньше рисовался обычный на вид
                чекбокс без обработчика: он выглядел рабочим и не нажимался. */}
            {selectable && (
              <TableCell
                type="checkbox"
                edge
                pin={selectionPin}
                checked={selected.has(key)}
                hideCheckbox={!rowSelectable}
                onCheckedChange={
                  rowSelectable ? () => toggleSelected(key) : undefined
                }
              />
            )}

            {columns.map((field) => (
              <TableCell
                key={field.key}
                edge={!selectable && field.key === columns[0]?.key}
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

            {extraActions && rowActions && (
              <TableCell type="button" pin="right" actions={rowActions(row)} />
            )}
          </TableRow>
        )
      })}

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
            edge
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
              {...fieldCellProps(field, total.row, { total: true })}
            />
          ))}

          <TableCell type="spacer" />

          {extraActions && <TableCell type="button" pin="right" />}
        </TableRow>
      )}
    </TableBody>
  )
}

export { DataTableBody }
