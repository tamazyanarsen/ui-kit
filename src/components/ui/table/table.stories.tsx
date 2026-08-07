import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronDown } from "@/icons"

import { StorySection, StoryShowcase } from "@/stories/matrix"

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

interface TableExampleProps {
  sortable?: boolean
  selectable?: boolean
  showDescription?: boolean
}

function TableExample({
  sortable = true,
  selectable = true,
  showDescription = true,
}: TableExampleProps = {}) {
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
          {selectable && (
            <TableHeadCell type="checkbox" checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleAll} />
          )}
          <TableHeadCell
            type="subtitle-left"
            sortable={sortable}
            sortDirection={sort?.key === "name" ? sort.dir : null}
            onSortClick={() => toggleSort("name")}
          >
            Сотрудник
          </TableHeadCell>
          <TableHeadCell
            type="subtitle-left"
            sortable={sortable}
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
            {selectable && (
              <TableCell type="checkbox" checked={selected.has(row.id)} onCheckedChange={() => toggleRow(row.id)} />
            )}
            <TableCell type="text" description={showDescription ? row.role : undefined}>
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
  argTypes: {
    sortable: { control: "boolean" },
    selectable: { control: "boolean" },
    showDescription: { control: "boolean" },
  },
  args: { sortable: true, selectable: true, showDescription: true },
} satisfies Meta<TableExampleProps>

export default meta
type Story = StoryObj<TableExampleProps>

export const Playground: Story = {}

/* Table is a composition, not a single prop-driven component — the real
   variant axis is the cell type, so the second story enumerates every
   head-cell and body-cell type the kit ships rather than states of a whole
   table. */
export const Matrix: Story = {
  name: "Matrix (типы ячеек)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection title="Типы ячеек заголовка (TableHeadCell)">
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="checkbox" />
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
              <TableHeadCell type="subtitle-right">Subtitle Right</TableHeadCell>
              <TableHeadCell
                type="icon"
                icon={<ChevronDown aria-hidden="true" className="size-4" />}
              />
              <TableHeadCell
                type="button"
                menu={<ButtonMenuOverflowItem text="Настроить столбцы" />}
              />
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell type="checkbox" />
              <TableCell type="text">Text</TableCell>
              <TableCell type="text">Text</TableCell>
              <TableCell type="text">Text</TableCell>
              <TableCell type="text">Text</TableCell>
              <TableCell type="text" align="right">
                Text
              </TableCell>
              <TableCell
                type="icon"
                icon={<ChevronDown aria-hidden="true" className="size-4" />}
              />
              <TableCell
                type="button"
                menu={<ButtonMenuOverflowItem text="Открыть карточку" />}
              />
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection title="Типы ячеек строки (TableCell)">
        <Table>
          <TableHeader>
            <tr>
              <TableHeadCell type="subtitle-left">checkbox</TableHeadCell>
              <TableHeadCell type="subtitle-left">text</TableHeadCell>
              <TableHeadCell type="subtitle-left">text + description</TableHeadCell>
              <TableHeadCell type="subtitle-left">tag</TableHeadCell>
              <TableHeadCell type="subtitle-left">icon</TableHeadCell>
              <TableHeadCell type="subtitle-left">button</TableHeadCell>
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell type="checkbox" />
              <TableCell type="text">Text</TableCell>
              <TableCell type="text" description="Description">
                Text
              </TableCell>
              <TableCell type="tag" tagColor="green">
                Активен
              </TableCell>
              <TableCell
                type="icon"
                icon={<ChevronDown aria-hidden="true" className="size-4" />}
              />
              <TableCell
                type="button"
                menu={<ButtonMenuOverflowItem text="Удалить" />}
              />
            </TableRow>
            {/* Selected rows tint the whole row, including its dividers. */}
            <TableRow selected>
              <TableCell type="checkbox" checked />
              <TableCell type="text">Выбранная строка</TableCell>
              <TableCell type="text" description="Description">
                Text
              </TableCell>
              <TableCell type="tag" tagColor="orange">
                На проверке
              </TableCell>
              <TableCell
                type="icon"
                icon={<ChevronDown aria-hidden="true" className="size-4" />}
              />
              <TableCell
                type="button"
                menu={<ButtonMenuOverflowItem text="Удалить" />}
              />
            </TableRow>
          </TableBody>
        </Table>
      </StorySection>

      <StorySection
        title="Живая таблица"
        description="Сортировка по клику на заголовок, выбор строк чекбоксами."
      >
        <TableExample />
      </StorySection>
    </StoryShowcase>
  ),
}
