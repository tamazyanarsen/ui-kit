import { useMemo, useState } from "react"

import { Search } from "@/icons"
import { Button } from "@/components/ui/button"
import { ButtonMenuBlack } from "@/components/ui/button-menu"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableBlock,
  TableBlockEmpty,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import { AMOUNT_UNITS, INITIAL_COLUMNS, TABLE_ROWS } from "./table-data"
import { TableExampleHead } from "./table-example-head"
import { TableExampleTop } from "./table-example-top"

// Собранный табличный блок «Связанные платежи» — то, ради чего компонент и
// существует: шапка блока, таблица, пустой результат, пагинация и панель
// групповых действий. Каждый проп ниже — отдельный тумблер в Playground.

interface TableExampleProps {
  /** Табличный блок: белая карточка с радиусом 16px вокруг всех элементов. */
  block?: boolean
  /** Шапка блока — название, фильтры, сводка результатов. */
  showTop?: boolean
  /** Строка «Сводка» (Details) в шапке блока. */
  showDetails?: boolean
  showPagination?: boolean
  /** Колонка чекбоксов + всплывающая панель действий внизу. */
  selectable?: boolean
  sortable?: boolean
  /** Вложенные строки со сдвигом 16px и шевронами. */
  nested?: boolean
  /** Закрепление колонок слева (чекбокс + иерархия) и справа (действия). */
  pinned?: boolean
  /** Липкая шапка внутри вьюпорта таблицы. */
  stickyHeader?: boolean
  /** Изменение ширины колонок перетаскиванием правой границы. */
  resizable?: boolean
  /** Второй уровень текста в ячейках Text/Number. */
  showDescription?: boolean
  /** Пустой результат вместо строк. */
  empty?: boolean
}

/** Переключает членство в множестве, не мутируя исходное. */
function toggleIn(set: Set<string>, id: string) {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

function TableExample({
  block = true,
  showTop = true,
  showDetails = true,
  showPagination = true,
  selectable = true,
  sortable = true,
  nested = true,
  pinned = true,
  stickyHeader = false,
  resizable = true,
  showDescription = true,
  empty = false,
}: TableExampleProps = {}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["1", "1.1", "1.1.1"])
  )
  const [sort, setSort] = useState<"asc" | "desc" | null>("asc")
  const [columns, setColumns] = useState(INITIAL_COLUMNS)

  const rows = useMemo(() => {
    if (empty) return []
    if (!nested) return TABLE_ROWS.filter((row) => row.level === 0)
    return TABLE_ROWS.filter((row) => {
      let parent = row.parent
      while (parent) {
        if (!expanded.has(parent)) return false
        parent = TABLE_ROWS.find((candidate) => candidate.id === parent)?.parent
      }
      return true
    })
  }, [empty, expanded, nested])

  const visible = new Set(
    columns.filter((column) => column.locked || column.visible).map((c) => c.id)
  )
  const allSelected = rows.length > 0 && selected.size === rows.length
  const someSelected = selected.size > 0 && !allSelected
  const anyExpanded = expanded.size > 0
  const leftPin = pinned ? ("left" as const) : undefined
  const rightPin = pinned ? ("right" as const) : undefined

  const table = (
    <>
      {showTop && (
        <TableExampleTop
          rowCount={rows.length}
          columns={columns}
          onColumnsChange={setColumns}
          showDetails={showDetails}
        />
      )}

      <Table
        fixed
        stickyHeader={stickyHeader}
        containerClassName={stickyHeader ? "max-h-[320px]" : undefined}
      >
        <TableExampleHead
          visible={visible}
          selectable={selectable}
          sortable={sortable}
          nested={nested}
          resizable={resizable}
          sort={sort}
          onSortClick={() =>
            setSort((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={() =>
            setSelected(
              allSelected ? new Set() : new Set(rows.map((row) => row.id))
            )
          }
          anyExpanded={anyExpanded}
          onExpandAll={() =>
            setExpanded(
              anyExpanded ? new Set() : new Set(TABLE_ROWS.map((row) => row.id))
            )
          }
          leftPin={leftPin}
          rightPin={rightPin}
        />
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} clickable selected={selected.has(row.id)}>
              {selectable && (
                <TableCell
                  type="checkbox"
                  pin={leftPin}
                  checked={selected.has(row.id)}
                  onCheckedChange={() =>
                    setSelected((prev) => toggleIn(prev, row.id))
                  }
                />
              )}
              <TableCell
                pin={leftPin}
                level={nested ? row.level : 0}
                expandable={
                  nested && TABLE_ROWS.some((r) => r.parent === row.id)
                }
                expanded={expanded.has(row.id)}
                onExpandedChange={() =>
                  setExpanded((prev) => toggleIn(prev, row.id))
                }
              >
                {row.code}
              </TableCell>
              <TableCell>{row.title}</TableCell>
              {visible.has("status") && (
                <TableCell type="tag" tagColor={row.status}>
                  {row.statusLabel}
                </TableCell>
              )}
              {visible.has("number") && <TableCell>{row.number}</TableCell>}
              {visible.has("account") && (
                <TableCell
                  description={showDescription ? "Расчётный" : undefined}
                >
                  {row.account}
                </TableCell>
              )}
              {visible.has("payer") && (
                <TableCell
                  description={showDescription ? "ИНН 7153842331" : undefined}
                >
                  {row.payer}
                </TableCell>
              )}
              {visible.has("amount") && (
                <TableCell
                  type="number"
                  description={showDescription ? row.amountNote : undefined}
                  tone={row.positive ? "positive" : "default"}
                  unit={row.unit}
                  unitVariants={AMOUNT_UNITS}
                >
                  {row.amount}
                </TableCell>
              )}
              <TableCell
                type="button"
                pin={rightPin}
                actions={[
                  { text: "Скачать печатную форму" },
                  { text: "Скопировать" },
                  { text: "Удалить" },
                ]}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {rows.length === 0 && (
        <TableBlockEmpty>
          <EmptySearchResults
            icon={<Search aria-hidden="true" />}
            title="По вашему запросу ничего не найдено"
            description="Попробуйте изменить критерии поиска"
            buttonLabel="Сбросить фильтры"
          />
        </TableBlockEmpty>
      )}

      {showPagination && (
        <Pagination page={1} totalPages={26} onPageChange={() => {}} />
      )}
    </>
  )

  return (
    <div className="flex flex-col gap-4">
      {block ? <TableBlock>{table}</TableBlock> : table}
      {selectable && selected.size > 0 && (
        <ButtonMenuBlack
          info={[
            {
              label: "Выбрано",
              value: String(selected.size),
              className: "w-16",
            },
            { label: "На сумму", value: "400 000,02 ₽" },
          ]}
          onClose={() => setSelected(new Set())}
        >
          <Button>Подписать и отправить</Button>
          <Button>Изменить</Button>
          <Button>Скачать</Button>
        </ButtonMenuBlack>
      )}
    </div>
  )
}

export { TableExample }
export type { TableExampleProps }
