import * as React from "react"
import { ChevronDown } from "@/icons"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@/components/ui/table"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import type { TagColor } from "@/components/ui/tag"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

interface Row {
  id: string
  name: string
  role: string
  date: string
  status: TagColor
  statusLabel: string
}

const ROWS: Row[] = [
  {
    id: "159638",
    name: "Воронаев Сергей",
    role: "Менеджер",
    date: "24.12.2022",
    status: "green",
    statusLabel: "Активен",
  },
  {
    id: "159639",
    name: "Иванова Мария",
    role: "Аналитик",
    date: "18.11.2022",
    status: "orange",
    statusLabel: "На проверке",
  },
  {
    id: "159640",
    name: "Петров Андрей",
    role: "Разработчик",
    date: "02.09.2022",
    status: "red",
    statusLabel: "Заблокирован",
  },
]

// Demo owns real controlled state (selection + sort) — per this kit's own
// convention (see feedback on Select/Calendar demos), Table's checkbox and
// sort header have no fallback state of their own, so an uncontrolled demo
// instance would just look broken.
function TableExample() {
  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(["159638"])
  )
  const [sort, setSort] = React.useState<{
    key: string
    dir: "asc" | "desc"
  } | null>(null)

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
    setSort((prev) =>
      prev?.key === key
        ? prev.dir === "asc"
          ? { key, dir: "desc" }
          : null
        : { key, dir: "asc" }
    )
  }

  const rows = React.useMemo(() => {
    if (!sort) return ROWS
    const copy = [...ROWS]
    copy.sort((a, b) => {
      const cmp = a[sort.key as "name" | "date"].localeCompare(
        b[sort.key as "name" | "date"]
      )
      return sort.dir === "asc" ? cmp : -cmp
    })
    return copy
  }, [sort])

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeadCell
            type="checkbox"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={toggleAll}
          />
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
          <TableHeadCell
            type="icon"
            icon={<ChevronDown aria-hidden="true" className="size-4" />}
          />
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
            <TableCell
              type="checkbox"
              checked={selected.has(row.id)}
              onCheckedChange={() => toggleRow(row.id)}
            />
            <TableCell type="text" description={row.role}>
              {row.name}
            </TableCell>
            <TableCell type="text">{row.date}</TableCell>
            <TableCell type="tag" tagColor={row.status}>
              {row.statusLabel}
            </TableCell>
            <TableCell
              type="icon"
              icon={<ChevronDown aria-hidden="true" className="size-4" />}
            />
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

function TableDemo() {
  return (
    <AccordionItem value="table">
      <AccordionTrigger>Table</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Шапка (Title Cell) — select-all чекбокс с indeterminate,
            сортируемые подписи (⇅ по клику), Icon-колонка, меню действий
            (Button)
          </RowLabel>
          <RowLabel>
            Строки (Cell) — Checkbox, Text + описание, Tag, Icon, меню
            действий; активная строка = выбранная (Active), клик по заголовку
            сортирует по столбцу
          </RowLabel>
          <TableExample />
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TableDemo }
