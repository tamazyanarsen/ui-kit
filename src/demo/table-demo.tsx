import * as React from "react"

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
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"
// Данные общие со стендом Storybook — один набор строк на оба стенда.
import { AMOUNT_UNITS, INITIAL_COLUMNS, TABLE_ROWS } from "@/stories/table-data"

import { RowLabel } from "./shared"
import { TableDemoHead } from "./table-demo-head"
import { TableDemoTop } from "./table-demo-top"

/** "Выбрать на всех страницах (781)" — the count is the filtered total, not
 * the page. */
const TOTAL_RECORDS = 781

/** Переключает членство в множестве, не мутируя исходное. */
function toggleIn(set: Set<string>, id: string) {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

// Demo owns real controlled state (selection, sort, expansion, columns) — per
// this kit's own convention (see the Select/Calendar demos), Table's checkbox,
// sort header and collapse chevrons have no fallback state of their own, so an
// uncontrolled demo instance would just look broken.
function TableExample() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set(["1", "1.1", "1.1.1"])
  )
  const [sort, setSort] = React.useState<"asc" | "desc" | null>("asc")
  const [columns, setColumns] = React.useState(INITIAL_COLUMNS)
  const [query, setQuery] = React.useState("")
  const [added, setAdded] = React.useState<string | null>(null)
  const [allPagesSelected, setAllPagesSelected] = React.useState(false)

  // "События, которые сбрасывают выделение: изменения в настройках
  // фильтрации и сортировки, нажатие на чекбокс в шапке, взаимодействия с
  // пагинатором, добавление новых записей в таблицу по внешним причинам."
  // Selection state lives with the consumer, so the reset is wired here
  // rather than inside Table — this is the filter half of that rule.
  React.useEffect(() => {
    setSelected(new Set())
    setAllPagesSelected(false)
  }, [query, sort])

  const shown = React.useMemo(() => {
    const matching = query.trim()
      ? TABLE_ROWS.filter((row) =>
          row.title.toLowerCase().includes(query.trim().toLowerCase())
        )
      : TABLE_ROWS
    // A row is visible only while every ancestor is expanded.
    return matching.filter((row) => {
      let parent = row.parent
      while (parent) {
        if (!expanded.has(parent)) return false
        parent = TABLE_ROWS.find((candidate) => candidate.id === parent)?.parent
      }
      return true
    })
  }, [expanded, query])

  const visibleColumns = new Set(
    columns.filter((column) => column.locked || column.visible).map((c) => c.id)
  )

  const allSelected = shown.length > 0 && selected.size === shown.length
  const someSelected = selected.size > 0 && !allSelected

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(shown.map((row) => row.id)))
  }

  const toggleRow = (id: string) =>
    setSelected((prev) => toggleIn(prev, id))

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => toggleIn(prev, id))

  // "Нажатие кнопки сворачивания в шапке таблицы сворачивает весь блок до
  // строк первого уровня. Повторное нажатие разворачивает все строки до
  // максимального уровня вложенности."
  const anyExpanded = expanded.size > 0
  function toggleAllExpanded() {
    setExpanded(
      anyExpanded ? new Set() : new Set(TABLE_ROWS.map((row) => row.id))
    )
  }

  // Re-triggers the 2000ms "Added" highlight by remounting the row.
  function highlightNewRow() {
    setAdded(null)
    window.setTimeout(() => setAdded("2"), 0)
  }

  const hasParent = (id: string) =>
    TABLE_ROWS.some((row) => row.parent === id)

  return (
    <div className="flex flex-col items-stretch gap-4">
      <TableBlock>
        <TableDemoTop
          query={query}
          onQueryChange={setQuery}
          onAddRow={highlightNewRow}
          rowCount={shown.length}
          columns={columns}
          onColumnsChange={setColumns}
        />

        <Table fixed stickyHeader containerClassName="max-h-[340px]">
          <TableDemoHead
            visibleColumns={visibleColumns}
            allSelected={allSelected}
            someSelected={someSelected}
            onSelectAll={toggleAll}
            anyExpanded={anyExpanded}
            onExpandAll={toggleAllExpanded}
            sort={sort}
            onSortClick={() =>
              setSort((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          />
          <TableBody>
            {shown.map((row) => (
              <TableRow
                key={row.id === added ? `${row.id}-added` : row.id}
                clickable
                selected={selected.has(row.id)}
                added={row.id === added}
              >
                <TableCell
                  type="checkbox"
                  pin="left"
                  checked={selected.has(row.id)}
                  onCheckedChange={() => toggleRow(row.id)}
                />
                <TableCell
                  pin="left"
                  level={row.level}
                  expandable={hasParent(row.id)}
                  expanded={expanded.has(row.id)}
                  onExpandedChange={() => toggleExpanded(row.id)}
                >
                  {row.code}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                {visibleColumns.has("status") && (
                  <TableCell type="tag" tagColor={row.status}>
                    {row.statusLabel}
                  </TableCell>
                )}
                {visibleColumns.has("number") && (
                  <TableCell>{row.number}</TableCell>
                )}
                {visibleColumns.has("account") && (
                  <TableCell description="Расчётный">{row.account}</TableCell>
                )}
                {visibleColumns.has("payer") && (
                  <TableCell description="ИНН 7153842331">
                    {row.payer}
                  </TableCell>
                )}
                {visibleColumns.has("amount") && (
                  <TableCell
                    type="number"
                    description={row.amountNote}
                    tone={row.positive ? "positive" : "default"}
                    unit={row.unit}
                    unitVariants={AMOUNT_UNITS}
                  >
                    {row.amount}
                  </TableCell>
                )}
                <TableCell
                  type="button"
                  pin="right"
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

        {shown.length === 0 && (
          <TableBlockEmpty>
            <EmptySearchResults
              icon={<Search aria-hidden="true" />}
              title="По вашему запросу ничего не найдено"
              description="Попробуйте изменить критерии поиска"
              buttonLabel="Сбросить фильтры"
              onButtonClick={() => setQuery("")}
            />
          </TableBlockEmpty>
        )}

        <Pagination page={1} totalPages={26} onPageChange={() => {}} />
      </TableBlock>

      {/* "Кнопка массового выбора: Позволяет пользователю выбрать все строки
          в таблице. При выборе всех значений кнопка пропадает. Отступ до края
          страницы при исчезновении кнопки не меняется" (node 70279:9454) —
          hence the fixed-height wrapper, so the layout doesn't jump when the
          button goes away. */}
      {selected.size > 0 && (
        <div className="flex min-h-8 items-center justify-center">
          {!allPagesSelected && (
            <Button
              variant="secondary-black"
              size="sm"
              onClick={() => setAllPagesSelected(true)}
            >
              Выбрать на всех страницах ({TOTAL_RECORDS})
            </Button>
          )}
        </div>
      )}

      {/* "Позволяет пользователю выбрать одну или несколько строк таблицы,
          чтобы применить к ним действия из всплывающей панели внизу экрана" —
          the panel is the kit's existing black Button Menu. */}
      {selected.size > 0 && (
        <ButtonMenuBlack
          info={[
            {
              label: "Выбрано",
              value: allPagesSelected ? String(TOTAL_RECORDS) : String(selected.size),
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
function TableDemo() {
  return (
    <AccordionItem value="table">
      <AccordionTrigger>Table</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Табличный блок — заливка white 101, радиус 16px, внутренние
            элементы с горизонтальным padding 16px: Название, Блок фильтрации,
            Сводка, Шапка, Блок с данными, Пагинатор
          </RowLabel>
          <RowLabel>
            Закрепления — чекбокс и колонка иерархии слева, блок действий
            справа; подложки с тенью появляются, только когда за ними есть
            скрытый контент. Шапка липкая при вертикальной прокрутке
          </RowLabel>
          <RowLabel>
            Строки — вложенность со сдвигом 16px и шевроном, ховер/активное
            состояние только у кликабельных строк, «Добавить строку» включает
            подсветку Added на 2000 ms
          </RowLabel>
          <RowLabel>
            Ячейки — Checkbox, Text + описание, Tag, Number (моноширинные
            цифры, зелёный для поступлений), Selection Button с действиями;
            усечённый текст показывает подсказку
          </RowLabel>
          <TableExample />
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TableDemo }
