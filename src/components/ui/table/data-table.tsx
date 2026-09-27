import { TableBlockEmpty } from "./block"
import { DataTableBody } from "./data-table-body"
import { DataTableHead } from "./data-table-head"
import type { DataTableProps } from "./data-table-props"
import { Table } from "./table"
import { useDataTableModel } from "./use-data-table-model"

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
//
// Сам компонент — только сборка: вывод модели живёт в `useDataTableModel`,
// разметка — в `DataTableHead` и `DataTableBody`. Раньше всё это было одной
// функцией на 344 строки, где двадцать `useMemo` стояли вперемешку с
// разметкой шапки и тела.
function DataTable<Row>(props: DataTableProps<Row>) {
  const {
    selectable = false,
    isRowSelectable,
    isRowAdded,
    onRowClick,
    rowActions,
    total,
    headMenu,
    empty,
    gridLines = false,
    fixed = true,
    stickyHeader = true,
    className,
    containerClassName,
  } = props

  const model = useDataTableModel(props)

  return (
    <>
      <Table
        fixed={fixed}
        stickyHeader={stickyHeader}
        gridLines={gridLines}
        className={className}
        containerClassName={containerClassName}
      >
        <DataTableHead
          model={model}
          selectable={selectable}
          headMenu={headMenu}
        />
        <DataTableBody
          model={model}
          selectable={selectable}
          isRowSelectable={isRowSelectable}
          isRowAdded={isRowAdded}
          onRowClick={onRowClick}
          rowActions={rowActions}
          total={total}
        />
      </Table>

      {/* Пустой результат стоит ВНЕ прокручиваемой области таблицы: по
          документации он не уезжает вбок вместе с колонками. */}
      {empty && model.visibleRows.length === 0 && (
        <TableBlockEmpty>{empty}</TableBlockEmpty>
      )}
    </>
  )
}

export { DataTable }
