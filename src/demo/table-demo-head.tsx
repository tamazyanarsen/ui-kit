import { TableHeadCell, TableHeader } from "@/components/ui/table"

/** Шапка таблицы на стенде: закрепления, иерархия, сортировка, филлер. */
function TableDemoHead({
  visibleColumns,
  allSelected,
  someSelected,
  onSelectAll,
  anyExpanded,
  onExpandAll,
  sort,
  onSortClick,
}: {
  visibleColumns: Set<string>
  allSelected: boolean
  someSelected: boolean
  onSelectAll: () => void
  anyExpanded: boolean
  onExpandAll: () => void
  sort: "asc" | "desc" | null
  onSortClick: () => void
}) {
  return (
    <TableHeader>
      <tr>
        <TableHeadCell
          type="checkbox"
          pin="left"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={onSelectAll}
        />
        {/* The hierarchy column carries the collapse-all chevron, the title
            and the sort control in one cell — exactly as the spec's own
            "⌃ Код ⇅" header does. */}
        <TableHeadCell
          type="subtitle-left"
          pin="left"
          collapsible
          expanded={anyExpanded}
          onExpandedChange={onExpandAll}
          // No sort and no resize on the hierarchy column: "в таблицах со
          // сворачиванием/разворачиванием не предусмотрена пользовательская
          // сортировка" and its width "опредяется в момент проектирования".
          defaultWidth={220}
        >
          Код
        </TableHeadCell>
        <TableHeadCell resizable defaultWidth={280}>
          Статья расходов
        </TableHeadCell>
        {visibleColumns.has("status") && (
          <TableHeadCell resizable defaultWidth={180}>
            Статус
          </TableHeadCell>
        )}
        {visibleColumns.has("number") && (
          <TableHeadCell
            resizable
            defaultWidth={160}
            sortable
            sortDirection={sort}
            // ⚠️ Круг замкнут на двух направлениях: нажатием сортировку не
            // сбросить. Возврата в «нет сортировки» нет намеренно — иначе
            // строки остались бы переставленными, а действующий критерий
            // ушёл бы из виду.
            onSortClick={onSortClick}
          >
            Номер платежа
          </TableHeadCell>
        )}
        {visibleColumns.has("account") && (
          <TableHeadCell resizable defaultWidth={220}>
            Со счёта
          </TableHeadCell>
        )}
        {visibleColumns.has("payer") && (
          <TableHeadCell resizable defaultWidth={260}>
            Получатель
          </TableHeadCell>
        )}
        {visibleColumns.has("amount") && (
          <TableHeadCell type="subtitle-right" resizable defaultWidth={200} sortable>
            Сумма
          </TableHeadCell>
        )}
        {/* Филлер над правым закреплённым блоком действий. */}
        <TableHeadCell type="filler" pin="right" />
      </tr>
    </TableHeader>
  )
}

export { TableDemoHead }
