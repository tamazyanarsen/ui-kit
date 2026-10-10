import * as React from "react"

import { ArrowDownChevron } from "@/icons"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  sortableRowClass,
  useSortable,
  type SortableDropMeta,
  type SortableEntry,
} from "@/components/ui/sortable"

/**
 * Витрина «перенос между группами с лимитом» — дизайн-чек 08.10,
 * замечание 7: «есть 5 из 5 избранных… когда подношу к низу группы, НЕ
 * давать чёрную линию снизу… а если подниму повыше и элемент встанет
 * вместо последнего — линия и ожидание приземления вместо последнего».
 *
 * Лимит задаётся у заголовка группы (`limit`), линию гасит сам хук; здесь —
 * только то, что решает потребитель: строка, вставшая в полную группу,
 * вытесняет последнюю, и та уходит туда, откуда пришла новая.
 */
interface LimitRow extends SortableEntry {
  label: string
}

const FAVOURITES_LIMIT = 5

const LIMIT_ROWS: LimitRow[] = [
  { id: "fav", label: "Избранное", group: true, expanded: true, limit: FAVOURITES_LIMIT },
  { id: "payments", label: "Платежи", depth: 1 },
  { id: "accounts", label: "Счета", depth: 1 },
  { id: "statements", label: "Операции и выписки", depth: 1 },
  { id: "cards", label: "Бизнес-карты", depth: 1 },
  { id: "deposits", label: "Депозиты", depth: 1 },
  { id: "rest", label: "Остальные разделы", group: true, expanded: true },
  { id: "references", label: "Справки", depth: 1 },
  { id: "salary", label: "Зарплатный проект", depth: 1 },
  { id: "currency", label: "Валютный контроль", depth: 1 },
  { id: "documents", label: "Документы", depth: 1 },
]

/** Заголовок группы, в которой стоит строка `index` (или -1). */
function groupHeaderOf(rows: LimitRow[], index: number) {
  if (!rows[index]?.depth) return -1
  for (let i = index - 1; i >= 0; i -= 1) if (rows[i].group) return i
  return -1
}

/** Перенос с вытеснением последней строки из переполненной группы. */
function moveWithLimit(prev: LimitRow[], from: number, to: number, { depth }: SortableDropMeta) {
  const source = prev[groupHeaderOf(prev, from)]?.id
  const next = [...prev]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, { ...moved, depth })

  const header = groupHeaderOf(next, to)
  const limit = next[header]?.limit
  if (limit === undefined) return next
  let last = header
  while (next[last + 1]?.depth) last += 1
  if (last - header <= limit) return next

  // Группа переполнена — последняя строка уходит в исходную группу новой.
  const [pushed] = next.splice(last, 1)
  const target = next.findIndex((row) => row.id === source)
  next.splice(target >= 0 ? target + 1 : next.length, 0, { ...pushed, depth: 1 })
  return next
}

function LimitedGroups() {
  const [rows, setRows] = React.useState(LIMIT_ROWS)
  const sortable = useSortable({
    items: rows,
    onReorder: (from, to, meta) => setRows((prev) => moveWithLimit(prev, from, to, meta)),
    // Строки живут только внутри групп: место «между группами» на верхнем
    // уровне здесь бессмысленно, и линии там быть не должно.
    canMove: (_from, _to, { depth }) => depth > 0,
  })

  return (
    <SortableList className="flex flex-col" {...sortable.listProps}>
      {rows.map((row) => {
        const count = row.group ? countChildren(rows, row.id) : 0
        return (
          <div
            key={row.id}
            className={sortableRowClass(
              menuItemRowClass(
                row.group
                  ? "items-center gap-2 rounded-[8px] py-3 pl-2"
                  : "not-data-dragging:hover:bg-[var(--menu-item-bg-highlighted)] rounded-[8px]",
                row.group ? 1 : 4
              )
            )}
            {...sortable.itemProps(row.id)}
          >
            <MenuItemContent
              leading={
                row.group ? (
                  <span
                    className="flex size-8 shrink-0 items-center justify-center text-[var(--menu-item-fg)]"
                    aria-hidden="true"
                  >
                    <ArrowDownChevron size={16} className="size-4" />
                  </span>
                ) : undefined
              }
              trailing={
                row.group ? undefined : (
                  <SortableHandle
                    label={`Переместить «${row.label}»`}
                    {...sortable.handleProps(row.id)}
                  />
                )
              }
            >
              {row.limit ? `${row.label} — ${count} из ${row.limit}` : row.label}
            </MenuItemContent>
          </div>
        )
      })}
      <SortableDropIndicator indicator={sortable.indicator} />
    </SortableList>
  )
}

function countChildren(rows: LimitRow[], id: string) {
  let i = rows.findIndex((row) => row.id === id) + 1
  let count = 0
  while (rows[i]?.depth) {
    count += 1
    i += 1
  }
  return count
}

export { LimitedGroups, moveWithLimit, LIMIT_ROWS }
