import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { Settings } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dropdown, DropdownSearch } from "@/components/ui/dropdown"
import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  sortableRowClass,
  useSortable,
} from "@/components/ui/sortable"

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
  // at that row's real position. Хук отдаёт индексы в ВИДИМОМ списке —
  // поэтому здесь они переводятся обратно в индексы `columns`.
  function move(from: number, to: number) {
    const fromId = visibleRows[from]?.id
    const toId = visibleRows[to]?.id
    if (!fromId || !toId || fromId === toId) return
    const fromIndex = columns.findIndex((column) => column.id === fromId)
    const toIndex = columns.findIndex((column) => column.id === toId)
    if (fromIndex < 0 || toIndex < 0) return
    const next = [...columns]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    onColumnsChange(next)
  }

  const sortable = useSortable({
    items: visibleRows.map((column) => ({
      id: column.id,
      locked: dragDisabled(column),
    })),
    onReorder: move,
    disabled: !reorderable,
  })

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
                immediately at y=56 and no padding of its own.

                Дизайн-чек «Storybook 3», замечание 7: «поправить вид поля
                поиска для настройки столбцов, опираясь на вид dropdown».
                Здесь стоял настоящий `Input size="lg"` — с рамкой, радиусом и
                плавающей подписью, то есть поле ВНУТРИ списка. В сете это
                строка самого списка: 56, глиф 24, нижний разделитель и больше
                ничего. Она теперь живёт в компоненте `Dropdown`
                ({@link DropdownSearch}) и переиспользуется отсюда. */}
            {searchable && (
              <DropdownSearch
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery("")}
              />
            )}

            <SortableList
              className="themed-scrollbar max-h-[392px] overflow-y-auto"
              {...sortable.listProps}
            >
              {visibleRows.map((column) => (
                <div
                  key={column.id}
                  data-slot="table-column-settings-row"
                  {...sortable.itemProps(column.id)}
                  // Переключает ВСЯ строка, а не только галочка: строка и
                  // галочка выражают одно действие, и мишень в 24×24 посреди
                  // строки 280×56 — это промах по площади в двадцать с лишним
                  // раз. Роль не `checkbox`: настоящий чекбокс уже стоит
                  // внутри, и вторая такая роль в дереве доступности лишняя —
                  // строка здесь просто увеличенная площадь нажатия.
                  onClick={
                    hideable && !column.locked
                      ? () => toggle(column.id)
                      : undefined
                  }
                  // Взятая строка красится в Active (Grey 124) — общий вид
                  // перетаскивания по макету 42995:34194. Раньше здесь была
                  // своя полупрозрачность, и то же действие в трёх списках
                  // кита выглядело тремя разными способами.
                  className={sortableRowClass(
                    "flex items-center gap-4 bg-[var(--table-bg)] p-4",
                    hideable && !column.locked && "cursor-pointer"
                  )}
                >
                  {hideable && (
                    // ⚠️ Клик по галочке НЕ доходит до строки. Переключатель у
                    // них общий, и без остановки клик по самой галочке
                    // срабатывал бы дважды — сначала `onCheckedChange`, затем
                    // `onClick` строки, — а выбор возвращался бы в исходное
                    // состояние. Со стороны это читается как «чекбокс не
                    // работает». Само `onCheckedChange` при этом отрабатывает:
                    // чекбокс ниже по дереву и успевает до остановки.
                    <span
                      onClick={
                        column.locked
                          ? undefined
                          : (event) => event.stopPropagation()
                      }
                      className="flex shrink-0"
                    >
                      <Checkbox
                        checked={column.locked ? true : column.visible}
                        disabled={column.locked}
                        onCheckedChange={() => toggle(column.id)}
                        aria-label={`Показывать столбец «${String(column.label)}»`}
                      />
                    </span>
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
                    <SortableHandle
                      label={`Переместить столбец «${String(column.label)}»`}
                      disabled={dragDisabled(column)}
                      // Клик по ручке не должен переключать видимость: строка
                      // целиком — увеличенная площадь чекбокса (см. выше).
                      onClick={(event) => event.stopPropagation()}
                      {...sortable.handleProps(column.id)}
                    />
                  )}
                </div>
              ))}
              <SortableDropIndicator indicator={sortable.indicator} />
            </SortableList>
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
