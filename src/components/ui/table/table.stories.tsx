import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown } from "@/icons"

import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "./table"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import type { TagColor } from "@/components/ui/tag"

interface Row {
  id: string
  name: string
  role: string
  date: string
  status: TagColor
  statusLabel: string
}

const ROWS: Row[] = [
  { id: "159638", name: "Воронаев Сергей", role: "Менеджер", date: "24.12.2022", status: "green", statusLabel: "Активен" },
  { id: "159639", name: "Иванова Мария", role: "Аналитик", date: "18.11.2022", status: "orange", statusLabel: "На проверке" },
  { id: "159640", name: "Петров Андрей", role: "Разработчик", date: "02.09.2022", status: "red", statusLabel: "Заблокирован" },
]

function TableExample() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["159638"]))
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null)

  const allSelected = selected.size === ROWS.length
  const someSelected = selected.size > 0 && !allSelected

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(ROWS.map((r) => r.id)))
  }
  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function toggleSort(key: string) {
    setSort((prev) => (prev?.key === key ? (prev.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }))
  }

  const rows = useMemo(() => {
    if (!sort) return ROWS
    const copy = [...ROWS]
    copy.sort((a, b) => {
      const cmp = a[sort.key as "name" | "date"].localeCompare(b[sort.key as "name" | "date"])
      return sort.dir === "asc" ? cmp : -cmp
    })
    return copy
  }, [sort])

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeadCell type="checkbox" checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} />
          <TableHeadCell
            type="subtitle-left"
            sortable
            sortDirection={sort?.key === "name" ? sort.dir : null}
            onSortClick={() => toggleSort("name")}
          >
            Сотрудник
          </TableHeadCell>
          <TableHeadCell
            type="subtitle-left"
            sortable
            sortDirection={sort?.key === "date" ? sort.dir : null}
            onSortClick={() => toggleSort("date")}
          >
            Дата
          </TableHeadCell>
          <TableHeadCell type="subtitle-left">Статус</TableHeadCell>
          <TableHeadCell type="icon" icon={<ChevronDown aria-hidden="true" className="size-4" />} />
          <TableHeadCell
            type="button"
            menu={
              <>
                <ButtonMenuOverflowItem text="Настроить столбцы" />
                <ButtonMenuOverflowItem text="Экспортировать" />
              </>
            }
          />
        </tr>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} selected={selected.has(row.id)}>
            <TableCell type="checkbox" checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
            <TableCell type="text" description={row.role}>
              {row.name}
            </TableCell>
            <TableCell type="text">{row.date}</TableCell>
            <TableCell type="tag" tagColor={row.status}>
              {row.statusLabel}
            </TableCell>
            <TableCell type="icon" icon={<ChevronDown aria-hidden="true" className="size-4" />} />
            <TableCell
              type="button"
              menu={
                <>
                  <ButtonMenuOverflowItem text="Открыть карточку" />
                  <ButtonMenuOverflowItem text="Удалить" />
                </>
              }
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const meta = {
  title: "Content/Table/Table",
  component: TableExample,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TableExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
