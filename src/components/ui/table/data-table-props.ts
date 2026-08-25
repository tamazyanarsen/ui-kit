import type * as React from "react"

import type { SelectionButtonItem } from "@/components/ui/selection-button"

import type { TableColumn } from "./column-settings"
import type { TableField } from "./field-types"
import type { TableSort } from "./use-table-sort"

/** Пропы `DataTable` — вынесены отдельно: это документация к API таблицы. */
interface DataTableProps<Row> {
  /** Описание полей — по одному на столбец. */
  fields: TableField<Row>[]
  rows: Row[]

  /**
   * Ключ строки: на нём держатся выбор, сворачивание и `key` React. По
   * умолчанию — `row.id`, иначе позиция строки в дереве.
   */
  getRowKey?: (row: Row, index: number) => string
  /** Вложенные строки. По умолчанию — `row.children`. */
  getChildren?: (row: Row) => Row[] | undefined

  /**
   * Колонка чекбоксов и режим множественного выбора. Чекбокс шапки выбирает
   * ВИДИМЫЕ строки — свёрнутая вложенность в выбор не попадает.
   */
  selectable?: boolean
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  onSelectedKeysChange?: (keys: string[]) => void
  /** Строки, которые выбрать нельзя: чекбокс у них не рисуется. */
  isRowSelectable?: (row: Row) => boolean

  /** Развёрнутые строки. Не задано — развёрнуты все. */
  expandedKeys?: string[]
  onExpandedKeysChange?: (keys: string[]) => void
  /** Стартовое состояние вложенности — свёрнуто до первого уровня. */
  defaultCollapsed?: boolean

  /**
   * Текущая сортировка. Не задана — берётся первый столбец с `sortable` по
   * возрастанию; подробности и оба правила — в `useTableSort`.
   */
  sort?: TableSort | null
  onSortChange?: (sort: TableSort) => void
  /** Строки уже отсортированы снаружи (например, сервером). */
  manualSort?: boolean

  /** Переход на карточку. Задан — строка подсвечивается и кликается. */
  onRowClick?: (row: Row, key: string) => void
  /** Только что созданная строка: подсветка на 2000 ms, гаснет сама. */
  isRowAdded?: (row: Row) => boolean
  /**
   * Действия строки одним пропом — короткая форма поля типа `actions`.
   * Столбец добавляется справа и закрепляется, над ним встаёт филлер.
   */
  rowActions?: (row: Row) => SelectionButtonItem[]

  /**
   * Видимость и порядок столбцов из «Настроить столбцы»
   * (`TableColumnSettings`). Поля, которых в списке нет, остаются на своих
   * местах и видимыми — настройка распоряжается только объявленными.
   */
  columnSettings?: TableColumn[]
  /** Ширину столбцов можно тянуть за правую границу. */
  resizable?: boolean

  /** Меню в правом верхнем углу шапки (ячейка шапки типа `button`). */
  headMenu?: React.ReactNode
  /** Что показать вместо строк, когда их нет. */
  empty?: React.ReactNode

  fixed?: boolean
  stickyHeader?: boolean
  className?: string
  containerClassName?: string
}

export type { DataTableProps }
