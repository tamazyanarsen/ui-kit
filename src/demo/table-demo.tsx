import * as React from "react"
import { Download, Search } from "@/icons"

import {
  Table,
  TableBlock,
  TableBlockEmpty,
  TableBody,
  TableCell,
  TableColumnSettings,
  TableHeadCell,
  TableHeader,
  TableRow,
  type TableColumn,
} from "@/components/ui/table"
import {
  TableTop,
  TableTopDetails,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopTitle,
  TableTopToolbar,
} from "@/components/ui/table-top"
import { Button } from "@/components/ui/button"
import { ButtonMenuBlack } from "@/components/ui/button-menu"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import type { TagColor } from "@/components/ui/tag"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

interface Row {
  id: string
  /** 0-based nesting depth — "контент сдвигается вправо на 16px" per level. */
  level: number
  parent?: string
  code: string
  title: string
  status: TagColor
  statusLabel: string
  number: string
  account: string
  payer: string
  amount: string
  /** Знак живёт при значении, а не в заголовке столбца: в одной колонке
   * значения бывают в разных единицах, и «Сумма, ₽» этого не выражает. */
  unit: string
  amountNote?: string
  positive?: boolean
}

/** Все знаки колонки суммы. Ячейка своей колонки не видит, поэтому список
 * собирается здесь и отдаётся каждой ячейке: слот знака резервирует ширину по
 * самому широкому глифу, и разряды продолжают стоять друг под другом. */
const AMOUNT_UNITS = ["₽", "$"]

const ROWS: Row[] = [
  { id: "1", level: 0, code: "1", title: "Подготовка территории строительства", status: "green", statusLabel: "Исполнен", number: "159638", account: "40702 810 7 00590062573", payer: "ИП Филлимонов Павел Алексеевич", amount: "10 000 000,00", unit: "₽", amountNote: "Списание" },
  { id: "1.1", level: 1, parent: "1", code: "1.1", title: "Договор о развитии застроенной территории", status: "orange", statusLabel: "Готов к подписанию", number: "159639", account: "40702 810 7 00590062573", payer: "ООО «ВИЛКА-СТРОЙ»", amount: "2 000 000,00", unit: "₽", amountNote: "Списание" },
  { id: "1.1.1", level: 2, parent: "1.1", code: "1.1.1", title: "Работы и услуги сторонних организаций", status: "grey", statusLabel: "Черновик", number: "159640", account: "40702 810 7 00590062573", payer: "ООО «РИС И КУРИЦА»", amount: "+31 922 980,05", unit: "₽", amountNote: "Поступление", positive: true },
  { id: "1.1.1.1", level: 3, parent: "1.1.1", code: "1.1.1.1", title: "Водоснабжение, энергоснабжение и водоотведение", status: "red", statusLabel: "Замечания банка", number: "154438", account: "40702 810 7 00590062573", payer: "ИП Филлимонов Павел Алексеевич", amount: "500 000,00", unit: "$" },
  { id: "2", level: 0, code: "2", title: "Основные объекты строительства", status: "orange", statusLabel: "На согласовании", number: "40038", account: "40702 810 7 00590062573", payer: "ООО «ИВАНОВО-СТРОЙ»", amount: "6 000 000,00", unit: "₽", amountNote: "Списание" },
  { id: "3", level: 0, code: "3", title: "Объекты подсобного и обслуживающего назначения", status: "green", statusLabel: "Исполнен", number: "40039", account: "40702 810 7 00590062573", payer: "ИП Воропаев Сергей Владимирович", amount: "99 999,99", unit: "₽" },
]

/** "Выбрать на всех страницах (781)" — the count is the filtered total, not
 * the page. */
const TOTAL_RECORDS = 781

const COLUMNS: TableColumn[] = [
  { id: "status", label: "Статус", visible: true, locked: true },
  { id: "number", label: "Номер платежа", visible: true },
  { id: "account", label: "Со счёта", visible: true },
  { id: "payer", label: "Получатель", visible: true },
  { id: "amount", label: "Сумма", visible: true },
]

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
  const [columns, setColumns] = React.useState(COLUMNS)
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
      ? ROWS.filter((row) =>
          row.title.toLowerCase().includes(query.trim().toLowerCase())
        )
      : ROWS
    // A row is visible only while every ancestor is expanded.
    return matching.filter((row) => {
      let parent = row.parent
      while (parent) {
        if (!expanded.has(parent)) return false
        parent = ROWS.find((candidate) => candidate.id === parent)?.parent
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

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // "Нажатие кнопки сворачивания в шапке таблицы сворачивает весь блок до
  // строк первого уровня. Повторное нажатие разворачивает все строки до
  // максимального уровня вложенности."
  const anyExpanded = expanded.size > 0
  function toggleAllExpanded() {
    setExpanded(
      anyExpanded ? new Set() : new Set(ROWS.map((row) => row.id))
    )
  }

  // Re-triggers the 2000ms "Added" highlight by remounting the row.
  function highlightNewRow() {
    setAdded(null)
    window.setTimeout(() => setAdded("2"), 0)
  }

  const hasParent = (id: string) =>
    ROWS.some((row) => row.parent === id)

  return (
    <div className="flex flex-col items-stretch gap-4">
      <TableBlock>
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
              onChange={(event) => setQuery(event.target.value)}
              clearable
              onClear={() => setQuery("")}
              containerClassName="w-65"
            />
            <Button variant="secondary-grey" size="sm" onClick={highlightNewRow}>
              Добавить строку
            </Button>
          </TableTopToolbar>
          <TableTopSummary
            info={
              <>
                <TableTopSummaryItem label="Выбрано фильтров:" value="0" />
                <TableTopSummaryItem
                  label="Результатов:"
                  value={String(shown.length)}
                />
              </>
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

        <Table fixed stickyHeader containerClassName="max-h-[340px]">
          <TableHeader>
            <tr>
              <TableHeadCell
                type="checkbox"
                pin="left"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
              {/* The hierarchy column carries the collapse-all chevron, the
                  title and the sort control in one cell — exactly as the
                  spec's own "⌃ Код ⇅" header does. */}
              <TableHeadCell
                type="subtitle-left"
                pin="left"
                collapsible
                expanded={anyExpanded}
                onExpandedChange={toggleAllExpanded}
                // No sort and no resize on the hierarchy column: "в таблицах
                // со сворачиванием/разворачиванием не предусмотрена
                // пользовательская сортировка" and its width "опредяется в
                // момент проектирования".
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
                  // ⚠️ Круг замкнут на двух направлениях: нажатием сортировку
                  // не сбросить. Возврата в «нет сортировки» нет намеренно —
                  // иначе строки остались бы переставленными, а действующий
                  // критерий ушёл бы из виду.
                  onSortClick={() =>
                    setSort((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
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
                <TableHeadCell
                  type="subtitle-right"
                  resizable
                  defaultWidth={200}
                  sortable
                >
                  Сумма
                </TableHeadCell>
              )}
              {/* Филлер над правым закреплённым блоком действий. */}
              <TableHeadCell type="filler" pin="right" />
            </tr>
          </TableHeader>
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
