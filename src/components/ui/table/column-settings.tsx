import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { Drag, Search, Settings } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dropdown } from "@/components/ui/dropdown"
import { Input } from "@/components/ui/input"

// TableColumnSettings — "Управление столбцами" (node 70279:7092), the popup
// behind the table top's "Настроить столбцы" button.
//
// Per the spec the popup is a 280px list of `Menu Point (ELK)` rows (56px
// tall, p-16, gap-16: a 24px Checkbox, a P1 Medium label and the 24px
// `icon / drag` grip) above a search field, and it governs two independent
// axes:
//
//   • visibility — "Скрытие столбцов не сбрасывает их положение относительно
//     других столбцов", so hiding a column never reorders it;
//   • order — dragged by the grip.
//
// "Допускаются таблицы, в которых доступно только включение/отключение
// видимости или только изменение порядка столбцов (не оба параметра
// одновременно)", which is why `reorderable` and `hideable` are separate
// flags rather than one "editable". A column can also opt out individually
// via `locked` — the spec draws those with a greyed-out checked checkbox.

interface TableColumn {
  id: string
  label: React.ReactNode
  visible?: boolean
  /** Always shown, checkbox disabled (the greyed rows in the spec's popup). */
  locked?: boolean
}

interface TableColumnSettingsProps {
  columns: TableColumn[]
  onColumnsChange: (columns: TableColumn[]) => void
  /** Show the drag grip and allow reordering. */
  reorderable?: boolean
  /** Show the checkbox and allow hiding columns. */
  hideable?: boolean
  /** Search field over the column names. Hidden for short lists. */
  searchable?: boolean
  searchPlaceholder?: string
  label?: React.ReactNode
  /** Replaces the default "Настроить столбцы" trigger button. */
  trigger?: React.ReactElement
  className?: string
}

function TableColumnSettings({
  columns,
  onColumnsChange,
  reorderable = true,
  hideable = true,
  searchable = true,
  searchPlaceholder = "Поиск",
  label = "Настроить столбцы",
  trigger,
  className,
}: TableColumnSettingsProps) {
  const [query, setQuery] = React.useState("")
  const [dragId, setDragId] = React.useState<string | null>(null)

  const normalized = query.trim().toLowerCase()
  const visibleRows = normalized
    ? columns.filter((column) =>
        String(column.label).toLowerCase().includes(normalized)
      )
    : columns

  function toggle(id: string) {
    onColumnsChange(
      columns.map((column) =>
        column.id === id ? { ...column, visible: !column.visible } : column
      )
    )
  }

  // Reorder is index-based on the full list, not the filtered view: dropping
  // onto a row while a search is active still has to land the dragged column
  // at that row's real position.
  function move(fromId: string, toId: string) {
    if (fromId === toId) return
    const from = columns.findIndex((column) => column.id === fromId)
    const to = columns.findIndex((column) => column.id === toId)
    if (from < 0 || to < 0) return
    const next = [...columns]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onColumnsChange(next)
  }

  const resolvedTrigger = trigger ?? (
    <Button variant="secondary-grey" size="sm" icon={Settings}>
      {label}
    </Button>
  )

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger render={resolvedTrigger} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="table-column-settings"
            render={
              <Dropdown
                className={cn("w-70 overflow-hidden p-0", className)}
              />
            }
          >
            {/* The search field is flush: Figma's "Поля таблицы" frame (node
                70279:7098) is 280 wide with `ELK / input` at (0,0) sized
                280×56 — an L input, full-bleed, with the row list starting
                immediately at y=56 and no padding of its own. */}
            {searchable && (
              <Input
                size="lg"
                label={searchPlaceholder}
                iconLeft={<Search aria-hidden="true" className="size-4" />}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                clearable
                onClear={() => setQuery("")}
              />
            )}

            <div className="themed-scrollbar max-h-[392px] overflow-y-auto">
              {visibleRows.map((column) => (
                <div
                  key={column.id}
                  data-slot="table-column-settings-row"
                  data-dragging={column.id === dragId || undefined}
                  draggable={reorderable && !dragDisabled(column)}
                  onDragStart={() => setDragId(column.id)}
                  onDragEnd={() => setDragId(null)}
                  onDragOver={(event) => {
                    if (!dragId) return
                    event.preventDefault()
                  }}
                  onDrop={(event) => {
                    if (!dragId) return
                    event.preventDefault()
                    move(dragId, column.id)
                    setDragId(null)
                  }}
                  className="flex items-center gap-4 bg-[var(--table-bg)] p-4 data-[dragging]:opacity-50"
                >
                  {hideable && (
                    <Checkbox
                      checked={column.locked ? true : column.visible}
                      disabled={column.locked}
                      onCheckedChange={() => toggle(column.id)}
                      aria-label={`Показывать столбец «${String(column.label)}»`}
                    />
                  )}
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-p1-medium",
                      column.locked || (hideable && !column.visible)
                        ? "text-[var(--table-description-fg)]"
                        : "text-[var(--table-fg)]"
                    )}
                  >
                    {column.label}
                  </span>
                  {reorderable && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 text-[var(--table-description-fg)]",
                        dragDisabled(column)
                          ? "opacity-40"
                          : "cursor-grab active:cursor-grabbing"
                      )}
                    >
                      <Drag className="size-6" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

// A locked column is pinned in place as well as always visible — the spec's
// greyed rows carry a muted grip, not an active one.
function dragDisabled(column: TableColumn) {
  return Boolean(column.locked)
}

export { TableColumnSettings }
export type { TableColumnSettingsProps, TableColumn }
