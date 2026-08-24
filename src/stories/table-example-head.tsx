import { TableHeadCell, TableHeader, type TablePin } from "@/components/ui/table"

/** Шапка таблицы в примере — состав колонок и их поведение. */
function TableExampleHead({
  visible,
  selectable,
  sortable,
  nested,
  resizable,
  sort,
  onSortClick,
  allSelected,
  someSelected,
  onSelectAll,
  anyExpanded,
  onExpandAll,
  leftPin,
  rightPin,
}: {
  /** Идентификаторы колонок, включённых в настройках таблицы. */
  visible: Set<string>
  selectable: boolean
  sortable: boolean
  nested: boolean
  resizable: boolean
  sort: "asc" | "desc" | null
  onSortClick: () => void
  allSelected: boolean
  someSelected: boolean
  onSelectAll: () => void
  anyExpanded: boolean
  onExpandAll: () => void
  leftPin?: TablePin
  rightPin?: TablePin
}) {
  return (
    <TableHeader>
      <tr>
        {selectable && (
          <TableHeadCell
            type="checkbox"
            pin={leftPin}
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={onSelectAll}
          />
        )}
        <TableHeadCell
          type="subtitle-left"
          pin={leftPin}
          collapsible={nested}
          expanded={anyExpanded}
          onExpandedChange={onExpandAll}
          // Sort/resize are only offered while this column is not the
          // hierarchy column — the spec forbids both once rows nest.
          sortable={sortable && !nested}
          sortDirection={sort}
          // ⚠️ Круг замкнут на двух направлениях: нажатием сортировку не
          // сбросить. Иначе строки остались бы переставленными, а
          // действующий критерий ушёл бы из виду.
          onSortClick={onSortClick}
          resizable={resizable && !nested}
          defaultWidth={200}
        >
          Код
        </TableHeadCell>
        <TableHeadCell resizable={resizable} defaultWidth={280}>
          Статья расходов
        </TableHeadCell>
        {visible.has("status") && (
          <TableHeadCell resizable={resizable} defaultWidth={180}>
            Статус
          </TableHeadCell>
        )}
        {visible.has("number") && (
          <TableHeadCell
            resizable={resizable}
            defaultWidth={160}
            sortable={sortable}
          >
            Номер платежа
          </TableHeadCell>
        )}
        {visible.has("account") && (
          <TableHeadCell resizable={resizable} defaultWidth={220}>
            Со счёта
          </TableHeadCell>
        )}
        {visible.has("payer") && (
          <TableHeadCell resizable={resizable} defaultWidth={260}>
            Получатель
          </TableHeadCell>
        )}
        {visible.has("amount") && (
          <TableHeadCell
            type="subtitle-right"
            resizable={resizable}
            defaultWidth={200}
            sortable={sortable}
          >
            Сумма
          </TableHeadCell>
        )}
        <TableHeadCell type="filler" pin={rightPin} />
      </tr>
    </TableHeader>
  )
}

export { TableExampleHead }
