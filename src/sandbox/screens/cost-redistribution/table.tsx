import * as React from "react"

import { DataTable, type TableField } from "@/components/ui/table"

import { money } from "../../shell"

import { AmountCell } from "./amount-cell"
import { totals, type CostItem } from "./data"

// Таблица статей расчёта. Вынесена из экрана отдельным модулем: описание
// столбцов вместе с рендерами сумм — это половина экрана по объёму, а правило кита
// держит файл в трёхстах строках.
//
// Дерево рисует сам `DataTable` (`childrenOf`), нумерация и название статьи
// живут в одной текстовой ячейке — в эталоне (70371:36101) это одна колонка
// «Статья» с номером слева, а не два столбца.

interface CostTableProps {
  items: CostItem[]
  /** Правки сумм листьев: id → { borrowed, own }. */
  edits: Record<string, { borrowed: number; own: number }>
  onEdit: (id: string, patch: { borrowed?: number; own?: number }) => void
  /** Какие столбцы средств показывать (радиогруппа «Все средства…»). */
  funds: "all" | "borrowed" | "own"
}

/** Суммы строки с учётом сделанных правок. */
function resolved(
  item: CostItem,
  edits: CostTableProps["edits"]
): { borrowed: number; own: number } {
  if (!item.children?.length) {
    const edit = edits[item.id]
    return {
      borrowed: edit?.borrowed ?? item.borrowed ?? 0,
      own: edit?.own ?? item.own ?? 0,
    }
  }
  return item.children.reduce(
    (sum, child) => {
      const inner = resolved(child, edits)
      return { borrowed: sum.borrowed + inner.borrowed, own: sum.own + inner.own }
    },
    { borrowed: 0, own: 0 }
  )
}

function CostTable({ items, edits, onEdit, funds }: CostTableProps) {
  const fields = React.useMemo<TableField<CostItem>[]>(() => {
    const isGroup = (row: CostItem) => Boolean(row.children?.length)

    const list: TableField<CostItem>[] = [
      {
        key: "title",
        title: "Статья",
        type: "custom",
        // Столбец иерархии — шеврон сворачивания и отступ по уровню берёт на
        // себя таблица.
        hierarchy: true,
        // Значение нужно ТОЛЬКО чтобы ячейка не считалась пустой: пустую
        // таблица рисует прочерком и до `render` не доходит вовсе (см.
        // `fieldCellProps` — проверка `empty` стоит раньше). То же и у трёх
        // денежных столбцов ниже.
        value: (row: CostItem) => row.title,
        width: 640,
        minWidth: 320,
        render: (row: CostItem) => (
          <span className="flex min-w-0 gap-4">
            <span className="shrink-0 tabular-nums text-[var(--table-fg)]">
              {row.number}
            </span>
            <span className="min-w-0">{row.title}</span>
          </span>
        ),
      },
      {
        key: "estimate",
        // Итог столбца стоит прямо в шапке — в эталоне под названием столбца
        // напечатана общая сумма.
        title: (
          <ColumnTitle
            label="Сметная стоимость"
            total={sumAll(items, edits, "estimate")}
          />
        ),
        type: "custom",
        align: "right",
        value: (row: CostItem) => {
          const value = resolved(row, edits)
          return value.borrowed + value.own
        },
        width: 216,
        minWidth: 216,
        render: (row: CostItem) => {
          const value = resolved(row, edits)
          // Сметная стоимость всегда производная — сумма заёмных и
          // собственных, — поэтому не редактируется ни у одной строки.
          return <AmountCell readOnly value={value.borrowed + value.own} />
        },
      },
    ]

    if (funds !== "own") {
      list.push({
        key: "borrowed",
        title: (
          <ColumnTitle
            label="Заёмные средства"
            total={sumAll(items, edits, "borrowed")}
          />
        ),
        type: "custom",
        align: "right",
        value: (row: CostItem) => resolved(row, edits).borrowed,
        width: 216,
        minWidth: 216,
        render: (row: CostItem) => (
          <AmountCell
            value={resolved(row, edits).borrowed}
            readOnly={isGroup(row)}
            label={`Заёмные средства, ${row.title}`}
            onChange={(next) => onEdit(row.id, { borrowed: next })}
          />
        ),
      })
    }

    if (funds !== "borrowed") {
      list.push({
        key: "own",
        title: (
          <ColumnTitle
            label="Собственные средства"
            total={sumAll(items, edits, "own")}
          />
        ),
        type: "custom",
        align: "right",
        value: (row: CostItem) => resolved(row, edits).own,
        width: 216,
        minWidth: 216,
        render: (row: CostItem) => (
          <AmountCell
            value={resolved(row, edits).own}
            readOnly={isGroup(row)}
            label={`Собственные средства, ${row.title}`}
            onChange={(next) => onEdit(row.id, { own: next })}
          />
        ),
      })
    }

    return list
  }, [items, edits, onEdit, funds])

  return (
    <DataTable<CostItem>
      fields={fields}
      rows={items}
      getRowKey={(row) => row.id}
      getChildren={(row) => row.children}
      gridLines={false}
      resizable={false}
      // Сортировки у расчёта нет: порядок статей задан самим ССР и менять его
      // нельзя — «2.1.1» обязана стоять под «2.1».
      manualSort
    />
  )
}

/** Шапка денежного столбца: название и общая сумма под ним. */
function ColumnTitle({ label, total }: { label: string; total: number }) {
  return (
    <span className="flex flex-col items-end gap-1">
      <span className="text-p3-medium text-[var(--table-description-fg)]">
        {label}
      </span>
      <span className="text-p2-medium tabular-nums text-[var(--table-fg)]">
        {money(total)}
      </span>
    </span>
  )
}

function sumAll(
  items: CostItem[],
  edits: CostTableProps["edits"],
  column: "estimate" | "borrowed" | "own"
) {
  return items.reduce((sum, item) => {
    const value = resolved(item, edits)
    if (column === "estimate") return sum + value.borrowed + value.own
    return sum + value[column]
  }, 0)
}

export { CostTable, resolved }
export type { CostTableProps }
export { totals }
