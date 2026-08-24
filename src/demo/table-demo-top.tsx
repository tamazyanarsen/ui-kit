import { Download, Search } from "@/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableColumnSettings, type TableColumn } from "@/components/ui/table"
import {
  TableTop,
  TableTopDetails,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopTitle,
  TableTopToolbar,
} from "@/components/ui/table-top"

/** Шапка табличного блока на стенде: поиск, сводка, настройки столбцов. */
function TableDemoTop({
  query,
  onQueryChange,
  onAddRow,
  rowCount,
  columns,
  onColumnsChange,
}: {
  query: string
  onQueryChange: (query: string) => void
  onAddRow: () => void
  rowCount: number
  columns: TableColumn[]
  onColumnsChange: (columns: TableColumn[]) => void
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
        <Input
          size="sm"
          label="Поиск по нескольким критериям"
          iconLeft={<Search aria-hidden="true" className="size-4" />}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          clearable
          onClear={() => onQueryChange("")}
          containerClassName="w-65"
        />
        <Button variant="secondary-grey" size="sm" onClick={onAddRow}>
          Добавить строку
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
      <TableTopDetails
        items={[
          { label: "Возвраты", value: "20 шт" },
          { label: "Кешбэк", value: "17 шт" },
          { label: "Поступления", value: "15 шт" },
          { label: "Сумма операций", value: "40 500 000,00 ₽" },
          { label: "Сумма параметра №1", value: "1 500 000,00 ₽" },
          { label: "Сумма параметра №2", value: "500 000,00 ₽" },
        ]}
      />
    </TableTop>
  )
}

export { TableDemoTop }
