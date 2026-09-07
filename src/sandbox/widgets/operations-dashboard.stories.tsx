import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { CardBox } from "@/components/ui/card-box"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Filter } from "@/components/ui/filter"
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import {
  TableTop,
  TableTopTitle,
  TableTopToolbar,
} from "@/components/ui/table-top"
import type { TagColor } from "@/components/ui/tag"

// Sandbox — "История операций": a filter bar + data table + pagination
// wired together like a real transactions screen, not just one component's
// own isolated states. Filtering/paging happen client-side over a fixed
// dataset purely to demonstrate the components reacting to each other.
//
// Дизайн-чек от 07.09, замечание 27: «Такой комбинации не существует в ДС.
// 1. В табличных блоках внешние паддинги равны нулю. 2. Напротив заголовка
// стоит Chips, это невозможно, должна быть кнопка».
//
// Витрина была собрана мимо кита: белая коробка с `p-6` и своим радиусом
// вместо `CardBox type="table"` (у которого внешние поля нулевые, а шапка
// несёт свои 16), заголовок — `text-lg` мимо шкалы, а напротив него стоял
// фильтр. Теперь это штатная связка `CardBox` → `TableTop` (`TableTopTitle`
// с кнопкой в слоте `action`, фильтр — в панели `TableTopToolbar` под
// заголовком) → `Table` → `Pagination`.

interface Operation {
  id: string
  title: string
  account: string
  amount: string
  date: string
  status: "success" | "pending" | "failed"
}

const STATUS_LABEL: Record<Operation["status"], string> = {
  success: "Выполнен",
  pending: "В обработке",
  failed: "Отклонён",
}
const STATUS_COLOR: Record<Operation["status"], TagColor> = {
  success: "green",
  pending: "orange",
  failed: "red",
}

const OPERATIONS: Operation[] = [
  { id: "1", title: "Перевод на карту", account: "Дебетовая ·· 4482", amount: "12 500 ₽", date: "24.12.2022", status: "success" },
  { id: "2", title: "Оплата ЖКХ", account: "Дебетовая ·· 4482", amount: "3 200 ₽", date: "22.12.2022", status: "success" },
  { id: "3", title: "Перевод другому клиенту", account: "Накопительная ·· 1135", amount: "48 900 ₽", date: "20.12.2022", status: "pending" },
  { id: "4", title: "Оплата интернета", account: "Дебетовая ·· 4482", amount: "890 ₽", date: "18.12.2022", status: "success" },
  { id: "5", title: "Перевод по СБП", account: "Дебетовая ·· 4482", amount: "15 000 ₽", date: "15.12.2022", status: "failed" },
  { id: "6", title: "Пополнение вклада", account: "Накопительная ·· 1135", amount: "100 000 ₽", date: "10.12.2022", status: "success" },
]
const PAGE_SIZE = 3

function OperationsDashboard() {
  const [status, setStatus] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!status) return OPERATIONS
    return OPERATIONS.filter((op) => STATUS_LABEL[op.status] === status)
  }, [status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <CardBox type="table" className="w-[720px]">
      <TableTop>
        <TableTopTitle
          title="История операций"
          action={
            <Button variant="secondary-grey" size="sm">
              Выписка
            </Button>
          }
        />
        <TableTopToolbar>
          <Filter
            label="Статус"
            value={status}
            onValueChange={(next) => {
              setStatus(next)
              setPage(1)
            }}
            placeholder="Выполнен / В обработке / Отклонён"
          />
        </TableTopToolbar>
      </TableTop>

      <Table>
        <TableHeader>
          <tr>
            <TableHeadCell type="subtitle-left">Операция</TableHeadCell>
            <TableHeadCell type="subtitle-left">Дата</TableHeadCell>
            <TableHeadCell type="subtitle-left">Статус</TableHeadCell>
          </tr>
        </TableHeader>
        <TableBody>
          {pageRows.map((op) => (
            <TableRow key={op.id}>
              <TableCell type="text" description={op.account}>
                <span className="flex items-center justify-between gap-4">
                  {op.title}
                  <span className="font-medium text-[var(--table-fg)]">{op.amount}</span>
                </span>
              </TableCell>
              <TableCell type="text">{op.date}</TableCell>
              <TableCell type="tag" tagColor={STATUS_COLOR[op.status]}>
                {STATUS_LABEL[op.status]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageRows.length === 0 && (
        // Пустая выдача — компонент кита, а не абзац мимо шкалы. Пагинатор
        // при этом остаётся, но без номеров слева (замечание 24).
        <EmptySearchResults title="Операций с таким статусом нет" />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showPages={pageRows.length > 0}
      />
    </CardBox>
  )
}

const meta = {
  title: "Песочница/Виджет: история операций",
  parameters: { layout: "centered" },
} satisfies Meta<typeof OperationsDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <OperationsDashboard />,
}
