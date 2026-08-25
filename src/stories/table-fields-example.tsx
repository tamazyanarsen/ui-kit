import { useMemo, useState } from "react"

import { Download, Search } from "@/icons"
import { Button } from "@/components/ui/button"
import { ButtonMenuBlack } from "@/components/ui/button-menu"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Pagination } from "@/components/ui/pagination"
import {
  DataTable,
  TableBlock,
  TableColumnSettings,
  columnsFromFields,
  type TableField,
} from "@/components/ui/table"
import {
  TableTop,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopTitle,
} from "@/components/ui/table-top"

import { CONTRACT_FIELDS } from "./table-fields-config"
import { CONTRACTS, type ContractRow } from "./table-fields-data"

// Таблица, собранная по конфигу полей: место использования отдаёт данные и
// описание полей, а ячейки строит `DataTable`.

interface TableFieldsExampleProps {
  /** Табличный блок: белая карточка с радиусом 16px вокруг всех элементов. */
  block?: boolean
  /** Шапка блока с настройкой столбцов. */
  showTop?: boolean
  showPagination?: boolean
  /** Колонка чекбоксов и панель групповых действий внизу. */
  selectable?: boolean
  /**
   * Вложенные строки. ⚠️ Включённая вложенность выключает сортировку целиком:
   * «в таблицах со сворачиванием/разворачиванием не предусмотрена
   * пользовательская сортировка — она невозможна без нарушения вложенностей».
   */
  nested?: boolean
  /** Закрепление колонок слева (чекбокс + договор) и справа (действия). */
  pinned?: boolean
  stickyHeader?: boolean
  resizable?: boolean
  /** Переход на карточку по нажатию на строку. */
  clickable?: boolean
  /** Пустой результат вместо строк. */
  empty?: boolean
}

function TableFieldsExample({
  block = true,
  showTop = true,
  showPagination = true,
  selectable = true,
  nested = true,
  pinned = true,
  stickyHeader = false,
  resizable = true,
  clickable = true,
  empty = false,
}: TableFieldsExampleProps = {}) {
  const [selected, setSelected] = useState<string[]>([])
  const [approved, setApproved] = useState<Set<string>>(new Set(["1", "2"]))
  const [columns, setColumns] = useState(() =>
    columnsFromFields(CONTRACT_FIELDS)
  )

  // Статический конфиг + правки под конкретный стенд. Чекбокс в ячейке —
  // обычное поле строки, поэтому его состояние живёт здесь, а не в таблице:
  // выбор строк (`selectable`) к нему отношения не имеет.
  const fields = useMemo<TableField<ContractRow>[]>(
    () =>
      CONTRACT_FIELDS.map((field) => {
        const pin = pinned ? field.pin : undefined
        if (field.key === "approved") {
          return {
            ...field,
            pin,
            checked: (row: ContractRow) => approved.has(row.id),
            onCheckedChange: (row: ContractRow, checked: boolean) =>
              setApproved((prev) => {
                const next = new Set(prev)
                if (checked) next.add(row.id)
                else next.delete(row.id)
                return next
              }),
          }
        }
        return { ...field, pin }
      }),
    [approved, pinned]
  )

  const rows = useMemo(() => {
    if (empty) return []
    if (nested) return CONTRACTS
    return CONTRACTS.map(({ children: _children, ...row }) => row)
  }, [empty, nested])

  const table = (
    <>
      {showTop && (
        <TableTop>
          <TableTopTitle
            title="Договоры"
            action={
              <Button variant="primary" size="sm">
                Создать
              </Button>
            }
          />
          <TableTopSummary
            info={
              <TableTopSummaryItem
                label="Результатов:"
                value={String(rows.length)}
              />
            }
            actions={
              <>
                <Button variant="secondary-grey" size="sm" icon={Download}>
                  Скачать
                </Button>
                <TableColumnSettings
                  columns={columns}
                  onColumnsChange={setColumns}
                />
              </>
            }
          />
        </TableTop>
      )}

      <DataTable
        fields={fields}
        rows={rows}
        columnSettings={columns}
        selectable={selectable}
        selectedKeys={selected}
        onSelectedKeysChange={setSelected}
        resizable={resizable}
        stickyHeader={stickyHeader}
        containerClassName={stickyHeader ? "max-h-[320px]" : undefined}
        onRowClick={clickable ? () => {} : undefined}
        empty={
          <EmptySearchResults
            icon={<Search aria-hidden="true" />}
            title="По вашему запросу ничего не найдено"
            description="Попробуйте изменить критерии поиска"
            buttonLabel="Сбросить фильтры"
          />
        }
      />

      {showPagination && (
        <Pagination page={1} totalPages={26} onPageChange={() => {}} />
      )}
    </>
  )

  return (
    <div className="flex flex-col gap-4">
      {block ? <TableBlock>{table}</TableBlock> : table}
      {selectable && selected.length > 0 && (
        <ButtonMenuBlack
          info={[
            {
              label: "Выбрано",
              value: String(selected.length),
              className: "w-16",
            },
          ]}
          onClose={() => setSelected([])}
        >
          <Button>Подписать и отправить</Button>
          <Button>Скачать</Button>
        </ButtonMenuBlack>
      )}
    </div>
  )
}

export { TableFieldsExample }
export type { TableFieldsExampleProps }
