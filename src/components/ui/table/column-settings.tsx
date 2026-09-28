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
  canReorder,
  useSortable,
} from "@/components/ui/sortable"

import { isColumnVisible } from "./column-visibility"
import { nodeText } from "./node-text"

// TableColumnSettings — «Управление столбцами», всплывающее окно за кнопкой
// «Настроить столбцы» в верху таблицы.
//
// По макету это список шириной 280px из строк `Menu Point (ELK)` (высотой
// 56px, p-16, gap-16: флажок 24px, подпись P1 Medium и ручка `icon / drag`
// 24px) над полем поиска, и он управляет двумя независимыми осями:
//
//   • видимость — «Скрытие столбцов не сбрасывает их положение относительно
//     других столбцов», то есть скрытие никогда не меняет порядок;
//   • порядок — перетаскивается за ручку.
//
// «Допускаются таблицы, в которых доступно только включение/отключение
// видимости или только изменение порядка столбцов (не оба параметра
// одновременно)» — именно поэтому `reorderable` и `hideable` это два
// отдельных флага, а не один «editable». Отдельная колонка может
// отказаться от участия через `locked`: такие макет рисует с серым
// отмеченным флажком.

interface TableColumn {
  id: string
  label: React.ReactNode
  /** Не задано — столбец виден: скрывает только явное `false`. */
  visible?: boolean
  /** Показывается всегда, флажок выключен (серые строки во всплывающем окне макета). */
  locked?: boolean
  /**
   * Столбец закреплён в таблице (`pin`): его нельзя перетащить, и никакой
   * перенос не проходит через него — иначе обычный столбец вставал внутрь
   * закреплённого блока, отступ закрепа считался и по нему, и на прокрутке
   * закреплённая колонка висела со сдвигом. Скрывать его при этом можно:
   * блок от скрытия остаётся сплошным.
   */
  pinned?: boolean
}

interface TableColumnSettingsProps {
  columns: TableColumn[]
  onColumnsChange: (columns: TableColumn[]) => void
  /** Показывать ручку перетаскивания и разрешить смену порядка. */
  reorderable?: boolean
  /** Показывать флажок и разрешить скрывать колонки. */
  hideable?: boolean
  /** Поле поиска по названиям колонок. Для коротких списков скрыто. */
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
        nodeText(column.label).toLowerCase().includes(normalized)
      )
    : columns

  function toggle(id: string) {
    onColumnsChange(
      columns.map((column) =>
        column.id === id
          ? { ...column, visible: !isColumnVisible(column) }
          : column
      )
    )
  }

  // Смена порядка считается по индексам полного списка, а не
  // отфильтрованного вида: бросок на строку при активном поиске всё равно
  // должен поставить перетаскиваемую колонку на настоящее место этой
  // строки. Хук отдаёт индексы в ВИДИМОМ списке — поэтому здесь они
  // переводятся обратно в индексы `columns`.
  function fullIndices(from: number, to: number) {
    const fromId = visibleRows[from]?.id
    const toId = visibleRows[to]?.id
    if (!fromId || !toId || fromId === toId) return null
    const fromIndex = columns.findIndex((column) => column.id === fromId)
    const toIndex = columns.findIndex((column) => column.id === toId)
    if (fromIndex < 0 || toIndex < 0) return null
    return [fromIndex, toIndex] as const
  }

  // Проверка по ПОЛНОМУ списку: при активном поиске закреплённая колонка
  // может быть скрыта из вида, но стоять между двумя найденными — перенос
  // сдвинул бы и её. Та же проверка уходит в хук (`canMove`), иначе он
  // рисовал бы линию над местом, бросок на которое здесь отклоняется.
  function canMoveColumn(from: number, to: number) {
    const indices = fullIndices(from, to)
    if (!indices) return false
    const entries = columns.map((column) => ({ id: column.id, locked: dragDisabled(column) }))
    return canReorder(entries, indices[0], indices[1])
  }

  function move(from: number, to: number) {
    const indices = fullIndices(from, to)
    if (!indices || !canMoveColumn(from, to)) return
    const [fromIndex, toIndex] = indices
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
    canMove: canMoveColumn,
    disabled: !reorderable,
  })

  const resolvedTrigger = trigger ?? (
    <Button variant="secondary-grey" size="sm" icon={Settings}>
      {label}
    </Button>
  )

  return (
    // Поиск сбрасывается на каждое открытие, как у FilterSelect: иначе после
    // закрытия с «Сум» в поле окно открывалось с одной найденной строкой, и
    // остальные столбцы выглядели пропавшими.
    <PopoverPrimitive.Root
      onOpenChange={(open) => {
        if (open) setQuery("")
      }}
    >
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
            {/* Поле поиска идёт вровень: кадр «Поля таблицы» в макете
                шириной 280 с `ELK / input` в точке (0,0) размером 280×56 —
                это поле размера L во всю ширину, а список строк начинается
                сразу с y=56 и собственных отступов не имеет.

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
                  // перетаскивания по макету. Раньше здесь была
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
                        checked={column.locked || isColumnVisible(column)}
                        disabled={column.locked}
                        onCheckedChange={() => toggle(column.id)}
                        aria-label={`Показывать столбец «${nodeText(column.label)}»`}
                      />
                    </span>
                  )}
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-p1-medium",
                      column.locked || (hideable && !isColumnVisible(column))
                        ? "text-[var(--table-description-fg)]"
                        : "text-[var(--table-fg)]"
                    )}
                  >
                    {column.label}
                  </span>
                  {reorderable && (
                    <SortableHandle
                      label={`Переместить столбец «${nodeText(column.label)}»`}
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

// Закреплённая колонка не только всегда видима, но и зафиксирована на
// месте: у серых строк макета ручка приглушённая, а не активная.
function dragDisabled(column: TableColumn) {
  return Boolean(column.locked || column.pinned)
}

export { TableColumnSettings }
export type { TableColumnSettingsProps, TableColumn }
