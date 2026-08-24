import { Download } from "@/icons"
import { Button } from "@/components/ui/button"
import { TableColumnSettings, type TableColumn } from "@/components/ui/table"
import {
  TableTop,
  TableTopDetails,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopTitle,
  TableTopToolbar,
} from "@/components/ui/table-top"

/** Шапка табличного блока в примере: название, фильтры, сводка. */
function TableExampleTop({
  rowCount,
  columns,
  onColumnsChange,
  showDetails,
}: {
  rowCount: number
  columns: TableColumn[]
  onColumnsChange: (columns: TableColumn[]) => void
  showDetails: boolean
}) {
  return (
    <TableTop>
      <TableTopTitle
        title="Связанные платежи"
        action={
          <Button variant="primary" size="sm">
            Создать
          </Button>
        }
      />
      <TableTopToolbar>
        <Button variant="secondary-grey" size="sm">
          Дата
        </Button>
        <Button variant="secondary-grey" size="sm">
          Статус
        </Button>
      </TableTopToolbar>
      <TableTopSummary
        info={
          <>
            <TableTopSummaryItem label="Выбрано фильтров:" value="0" />
            <TableTopSummaryItem label="Результатов:" value={String(rowCount)} />
          </>
        }
        actions={
          <>
            <Button variant="secondary-grey" size="sm" icon={Download}>
              Скачать
            </Button>
            <TableColumnSettings
              columns={columns}
              onColumnsChange={onColumnsChange}
            />
          </>
        }
      />
      {showDetails && (
        <TableTopDetails
          items={[
            { label: "Кешбэк", value: "17 шт" },
            { label: "Поступления", value: "15 шт" },
            { label: "Сумма операций", value: "40 500 000,00 ₽" },
          ]}
        />
      )}
    </TableTop>
  )
}

export { TableExampleTop }
