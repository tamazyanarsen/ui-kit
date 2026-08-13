import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Filter } from "@/components/ui/filter"
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import type { TagColor } from "@/components/ui/tag"

// Sandbox — "История операций": a filter bar + data table + pagination
// wired together like a real transactions screen, not just one component's
// own isolated states. Filtering/paging happen client-side over a fixed
// dataset purely to demonstrate the components reacting to each other.

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
    <div className="flex w-[720px] flex-col gap-4 rounded-3xl border border-[#DEDEDE] bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#252628]">История операций</h2>
        <Filter
          label="Статус"
          background="grey"
          value={status}
          onValueChange={(next) => {
            setStatus(next)
            setPage(1)
          }}
          placeholder="Выполнен / В обработке / Отклонён"
        />
      </div>

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
        <p className="py-8 text-center text-sm text-[#999999]">Операций с таким статусом нет</p>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} showPageSize={false} />
    </div>
  )
}

const meta = {
  title: "Компоненты/История операций",
  parameters: { layout: "centered" },
} satisfies Meta<typeof OperationsDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <OperationsDashboard />,
}
