import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Download, Search } from "@/icons"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from "./table"
import { TableBlock, TableBlockEmpty } from "./block"
import { TableColumnSettings, type TableColumn } from "./column-settings"
import { Button } from "@/components/ui/button"
import { ButtonMenuBlack, ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Pagination } from "@/components/ui/pagination"
import {
  TableTop,
  TableTopDetails,
  TableTopSummary,
  TableTopSummaryItem,
  TableTopTitle,
  TableTopToolbar,
} from "@/components/ui/table-top"
import type { TagColor } from "@/components/ui/tag"

interface Row {
  id: string
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
  amountNote?: string
  positive?: boolean
}

const ROWS: Row[] = [
  { id: "1", level: 0, code: "1", title: "Подготовка территории строительства", status: "green", statusLabel: "Исполнен", number: "159638", account: "40702 810 7 00590062573", payer: "ИП Филлимонов Павел Алексеевич", amount: "10 000 000,00 ₽", amountNote: "Списание" },
  { id: "1.1", level: 1, parent: "1", code: "1.1", title: "Договор о развитии застроенной территории", status: "orange", statusLabel: "Готов к подписанию", number: "159639", account: "40702 810 7 00590062573", payer: "ООО «ВИЛКА-СТРОЙ»", amount: "2 000 000,00 ₽", amountNote: "Списание" },
  { id: "1.1.1", level: 2, parent: "1.1", code: "1.1.1", title: "Работы и услуги сторонних организаций", status: "grey", statusLabel: "Черновик", number: "159640", account: "40702 810 7 00590062573", payer: "ООО «РИС И КУРИЦА»", amount: "+31 922 980,05 ₽", amountNote: "Поступление", positive: true },
  { id: "1.1.1.1", level: 3, parent: "1.1.1", code: "1.1.1.1", title: "Водоснабжение, энергоснабжение и водоотведение", status: "red", statusLabel: "Замечания банка", number: "154438", account: "40702 810 7 00590062573", payer: "ИП Филлимонов Павел Алексеевич", amount: "500 000,00 ₽" },
  { id: "2", level: 0, code: "2", title: "Основные объекты строительства", status: "orange", statusLabel: "На согласовании", number: "40038", account: "40702 810 7 00590062573", payer: "ООО «ИВАНОВО-СТРОЙ»", amount: "6 000 000,00 ₽", amountNote: "Списание" },
  { id: "3", level: 0, code: "3", title: "Объекты подсобного и обслуживающего назначения", status: "green", statusLabel: "Исполнен", number: "40039", account: "40702 810 7 00590062573", payer: "ИП Воропаев Сергей Владимирович", amount: "99 999,99 ₽" },
]

const INITIAL_COLUMNS: TableColumn[] = [
  { id: "status", label: "Статус", visible: true, locked: true },
  { id: "number", label: "Номер платежа", visible: true },
  { id: "account", label: "Со счёта", visible: true },
  { id: "payer", label: "Получатель", visible: true },
  { id: "amount", label: "Сумма", visible: true },
]

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
    if (!nested) return ROWS.filter((row) => row.level === 0)
    return ROWS.filter((row) => {
      let parent = row.parent
      while (parent) {
        if (!expanded.has(parent)) return false
        parent = ROWS.find((candidate) => candidate.id === parent)?.parent
      }
      return true
    })
  }, [empty, expanded, nested])

  const visible = new Set(
    columns.filter((c) => c.locked || c.visible).map((c) => c.id)
  )
  const allSelected = rows.length > 0 && selected.size === rows.length
  const someSelected = selected.size > 0 && !allSelected
  const anyExpanded = expanded.size > 0
  const leftPin = pinned ? ("left" as const) : undefined
  const rightPin = pinned ? ("right" as const) : undefined

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

  const table = (
    <>
      {showTop && (
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
                <TableTopSummaryItem
                  label="Результатов:"
                  value={String(rows.length)}
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
      )}

      <Table
        fixed
        stickyHeader={stickyHeader}
        containerClassName={stickyHeader ? "max-h-[320px]" : undefined}
      >
        <TableHeader>
          <tr>
            {selectable && (
              <TableHeadCell
                type="checkbox"
                pin={leftPin}
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={() =>
                  setSelected(
                    allSelected ? new Set() : new Set(rows.map((r) => r.id))
                  )
                }
              />
            )}
            <TableHeadCell
              type="subtitle-left"
              pin={leftPin}
              collapsible={nested}
              expanded={anyExpanded}
              onExpandedChange={() =>
                setExpanded(
                  anyExpanded ? new Set() : new Set(ROWS.map((r) => r.id))
                )
              }
              // Sort/resize are only offered while this column is not the
              // hierarchy column — the spec forbids both once rows nest.
              sortable={sortable && !nested}
              sortDirection={sort}
              onSortClick={() =>
                setSort((prev) =>
                  prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                )
              }
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
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} clickable selected={selected.has(row.id)}>
              {selectable && (
                <TableCell
                  type="checkbox"
                  pin={leftPin}
                  checked={selected.has(row.id)}
                  onCheckedChange={() => toggleRow(row.id)}
                />
              )}
              <TableCell
                pin={leftPin}
                level={nested ? row.level : 0}
                expandable={nested && ROWS.some((r) => r.parent === row.id)}
                expanded={expanded.has(row.id)}
                onExpandedChange={() => toggleExpanded(row.id)}
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
            { label: "Выбрано", value: String(selected.size), className: "w-16" },
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

const meta = {
  title: "Компоненты/Table",
  component: TableExample,
  parameters: { layout: "padded" },
  argTypes: {
    block: { control: "boolean" },
    showTop: { control: "boolean" },
    showDetails: { control: "boolean" },
    showPagination: { control: "boolean" },
    selectable: { control: "boolean" },
    sortable: { control: "boolean" },
    nested: { control: "boolean" },
    pinned: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    resizable: { control: "boolean" },
    showDescription: { control: "boolean" },
    empty: { control: "boolean" },
  },
  args: {
    block: true,
    showTop: true,
    showDetails: true,
    showPagination: true,
    selectable: true,
    sortable: true,
    nested: true,
    pinned: true,
    stickyHeader: false,
    resizable: true,
    showDescription: true,
    empty: false,
  },
} satisfies Meta<TableExampleProps>

export default meta
type Story = StoryObj<TableExampleProps>

export const Playground: Story = {}

/* Table is a composition, not a single prop-driven component — the real
   variant axis is the cell type, so the second story enumerates every
   head-cell and body-cell type the kit ships, plus the row fills. */
export const Matrix: Story = {
  name: "Matrix (типы ячеек и состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Типы ячеек заголовка (TableHeadCell)"
        description="Чекбокс, сворачивание всех строк, текст с левой и правой выключкой (с сортировкой и без), иконка, меню и филлер над закреплённым блоком действий."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="checkbox" />
              <TableHeadCell type="collapse" expanded />
              <TableHeadCell type="subtitle-left">Subtitle Left</TableHeadCell>
              <TableHeadCell type="subtitle-left" sortable>
                Sortable
              </TableHeadCell>
              <TableHeadCell type="subtitle-left" sortable sortDirection="asc">
                Sorted ↑
              </TableHeadCell>
              <TableHeadCell type="subtitle-left" sortable sortDirection="desc">
                Sorted ↓
              </TableHeadCell>
              <TableHeadCell type="subtitle-right" sortable>
                Subtitle Right
              </TableHeadCell>
              <TableHeadCell
                type="icon"
                icon={<Download aria-hidden="true" className="size-4" />}
              />
              <TableHeadCell
                type="button"
                menu={<ButtonMenuOverflowItem text="Настроить столбцы" />}
              />
              <TableHeadCell type="filler" />
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell type="checkbox" />
              <TableCell type="collapse" expandable expanded />
              <TableCell>Text</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Text</TableCell>
              <TableCell type="number">99 999,99 ₽</TableCell>
              <TableCell
                type="icon"
                icon={<Download aria-hidden="true" className="size-4" />}
              />
              <TableCell>—</TableCell>
              <TableCell
                type="button"
                actions={[{ text: "Открыть карточку" }]}
              />
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Типы ячеек строки (TableCell)"
        description="Числовая ячейка использует табличные цифры («запятая под запятой»), поступления окрашены в зелёный."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left">checkbox</TableHeadCell>
              <TableHeadCell type="subtitle-left">collapse</TableHeadCell>
              <TableHeadCell type="subtitle-left">text</TableHeadCell>
              <TableHeadCell type="subtitle-left">
                text + description
              </TableHeadCell>
              <TableHeadCell type="subtitle-right">number</TableHeadCell>
              <TableHeadCell type="subtitle-right">number +</TableHeadCell>
              <TableHeadCell type="subtitle-left">tag</TableHeadCell>
              <TableHeadCell type="filler" />
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell type="checkbox" />
              <TableCell type="collapse" expandable expanded={false} />
              <TableCell>Текст в ячейке</TableCell>
              <TableCell description="Пояснение в ячейке">
                Текст в ячейке
              </TableCell>
              <TableCell type="number" description="Списание">
                2 980 133 515,05 ₽
              </TableCell>
              <TableCell type="number" tone="positive" description="Поступление">
                +31 922 980,05 ₽
              </TableCell>
              <TableCell type="tag" tagColor="green">
                Исполнен
              </TableCell>
              <TableCell type="button" actions={[{ text: "Удалить" }]} />
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Line Fill — состояния строки"
        description="Ховер и Active появляются только у кликабельных строк; Added живёт 2000 ms (1000 статично + 1000 затухание), поэтому в статике виден уже погасшим."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left">Состояние</TableHeadCell>
              <TableHeadCell type="subtitle-left">Строка</TableHeadCell>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Default</TableCell>
              <TableCell>Без заливки</TableCell>
            </TableRow>
            <TableRow clickable>
              <TableCell>Hover / Active</TableCell>
              <TableCell>Наведите курсор — строка кликабельна</TableCell>
            </TableRow>
            <TableRow selected>
              <TableCell>Selected</TableCell>
              <TableCell>Выбрана чекбоксом</TableCell>
            </TableRow>
            <TableRow added>
              <TableCell>Added</TableCell>
              <TableCell>Только что созданная строка</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Вложенность"
        description="Каждый уровень сдвигает контент на 16px; у самого глубокого уровня шеврон не показывается, но отступ сохраняется."
      >
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left" collapsible expanded>
                Код
              </TableHeadCell>
              <TableHeadCell type="subtitle-left">
                Статья расходов
              </TableHeadCell>
            </tr>
          </TableHeader>
          <TableBody>
            {ROWS.map((row) => (
              <TableRow key={row.id}>
                <TableCell
                  level={row.level}
                  expandable={ROWS.some((r) => r.parent === row.id)}
                  expanded
                >
                  {row.code}
                </TableCell>
                <TableCell>{row.title}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Табличный блок целиком"
        description="Прокрутите таблицу по горизонтали: закреплённые блоки слева и справа отбрасывают тень только пока за ними есть скрытый контент."
      >
        <TableExample stickyHeader />
      </StorySection>
    </StoryShowcase>
  ),
}
