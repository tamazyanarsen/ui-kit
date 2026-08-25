import type * as React from "react"

import type { SelectionButtonItem } from "@/components/ui/selection-button"
import type { TagColor, TagVariant } from "@/components/ui/tag"

import type { TableRowAction } from "./cell-action"
import type { TableCellProps } from "./cell"
import type { TablePin } from "./pin"
import type { TableCellType } from "./types"

// Конфиг полей: описание столбца данными вместо JSX.
//
// Ячейку строит таблица, а не место использования: в конфиге объявлен ТИП
// поля, и по типу выбирается и вариант ячейки из сета («Варианты ячеек в
// строке с данными», node 70279:6983), и форматирование значения. Ровно те
// шесть вариантов, что нарисованы в документации, — чекбокс, сворачивание,
// текстовая с левой выключкой, текстовая с правой (финансовая), статусная и
// действия со строкой, — плюс прикладные типы, которые сводятся к ним:
// деньги, проценты, даты, логическое значение, ссылка, иконка.
//
// Зачем слой: без него каждое место использования писало «сумму» своим
// `Intl`-вызовом и своим набором классов, и колонки денег в двух таблицах
// расходились по числу знаков после запятой и по цвету поступления. Тип поля
// делает это свойством данных, а не разметки.
//
// Композиционный API (`Table` + `TableRow` + `TableCell`) никуда не делся и
// остаётся способом собрать нестандартную таблицу; `DataTable` — слой над
// ним, а не замена.

/**
 * Тип поля. Первые шесть — прямо из документации; остальные форматируют
 * значение и сводятся к тем же вариантам ячейки (см.
 * {@link TABLE_FIELD_TYPES}).
 */
type TableFieldType =
  /** Текстовая (левая выключка): основной текст + пояснение. */
  | "text"
  /**
   * То же, но правило «Несколько (N)» объявлено явно: «Если в ячейке
   * требуется отобразить несколько значений параметра, используется формат
   * „Несколько (N)“, где N — количество значений». Массив в значении любого
   * текстового поля сворачивается так же и без этого типа.
   */
  | "list"
  /** Текстовая (правая выключка): табличные цифры, «запятая под запятой». */
  | "number"
  /** Число со знаком валюты и, при `signed`, зелёным плюсом у поступлений. */
  | "money"
  /** Число со знаком «%». */
  | "percent"
  /** Дата «31.12.2026». */
  | "date"
  /** Дата и время «31.12.2026, 14:05». */
  | "datetime"
  /** Время «14:05». */
  | "time"
  /** Логическое значение словами — по умолчанию «Да» / «Нет». */
  | "boolean"
  /**
   * Чекбокс в ячейке. ⚠️ Это НЕ выбор строки: колонку выбора рисует сама
   * таблица по пропу `selectable` («Чекбокс — позволяет пользователю выбрать
   * одну или несколько строк таблицы»). Тип поля нужен для собственного
   * булева признака строки.
   */
  | "checkbox"
  /** Пиктограмма из значения поля. */
  | "icon"
  /** Статусная: значение показывается компонентом `Tag`. */
  | "tag"
  /** Текст-ссылка внутри обычной текстовой ячейки. */
  | "link"
  /** Действия со строкой в правом закрепе. */
  | "actions"
  /** Своё содержимое — обязателен `render`. */
  | "custom"

/** Как тип поля ложится на варианты ячейки из сета. */
interface TableFieldTypeSpec {
  /** Вариант `Type` у `ELK / table-cell`. */
  cell: TableCellType
  /** Выключка по умолчанию — её же наследует ячейка шапки. */
  align: "left" | "right"
  /** Служебный столбец: ширина фиксирована содержимым, заголовка нет. */
  control?: boolean
}

const TABLE_FIELD_TYPES: Record<TableFieldType, TableFieldTypeSpec> = {
  text: { cell: "text", align: "left" },
  list: { cell: "text", align: "left" },
  number: { cell: "number", align: "right" },
  money: { cell: "number", align: "right" },
  percent: { cell: "number", align: "right" },
  // Даты выключены влево: правая выключка в документации закреплена за
  // финансовыми показателями, а не за «всем, что похоже на число».
  date: { cell: "text", align: "left" },
  datetime: { cell: "text", align: "left" },
  time: { cell: "text", align: "left" },
  boolean: { cell: "text", align: "left" },
  checkbox: { cell: "checkbox", align: "left", control: true },
  icon: { cell: "icon", align: "left", control: true },
  tag: { cell: "tag", align: "left" },
  link: { cell: "text", align: "left" },
  actions: { cell: "button", align: "right", control: true },
  custom: { cell: "text", align: "left" },
}

/** Описание тега для статусного поля. */
interface TableFieldTag {
  label?: React.ReactNode
  color?: TagColor
  variant?: TagVariant
}

/**
 * Одно поле таблицы. Обязателен только `key`; всё остальное — уточнения к
 * типу, и неприменимые к нему свойства просто не читаются.
 */
interface TableField<Row = unknown> {
  /** Ключ столбца. Он же путь к значению в строке, если не задан `path`. */
  key: string
  /** Заголовок в шапке. */
  title?: React.ReactNode
  /** Тип поля. По умолчанию `text`. */
  type?: TableFieldType

  /** Путь к значению, в том числе вложенный: `"payer.inn"`. */
  path?: string
  /** Значение вычислением — приоритетнее `path`. */
  value?: (row: Row) => unknown
  /** Пояснение под значением (P3 Regular, серое). */
  description?: (row: Row) => React.ReactNode
  /** Готовое форматирование значения — вместо форматирования по типу. */
  format?: (value: unknown, row: Row) => React.ReactNode
  /** Своё содержимое ячейки целиком. Для типа `custom` обязателен. */
  render?: (row: Row) => React.ReactNode
  /** Донастройка ячейки: любые пропы `TableCell` поверх собранных по типу. */
  cellProps?: (row: Row) => Partial<TableCellProps>
  /** Чем заполнить пустое значение. По умолчанию «—». */
  empty?: React.ReactNode

  /** Выключка. По умолчанию — из типа поля. */
  align?: "left" | "right"
  /** Стартовая ширина столбца, px. */
  width?: number
  /** Минимум при перетаскивании, px. По умолчанию 48. */
  minWidth?: number
  /** Можно ли тянуть границу. По умолчанию — проп `resizable` таблицы. */
  resizable?: boolean
  /** Столбец участвует в сортировке. */
  sortable?: boolean
  /** Своё сравнение строк для сортировки — вместо сравнения по типу. */
  compare?: (a: Row, b: Row) => number
  /** Закрепление столбца. */
  pin?: TablePin
  /**
   * Столбец иерархии: несёт шеврон сворачивания и отступ по уровню
   * вложенности. Такой столбец в таблице один.
   */
  hierarchy?: boolean
  /** Столбец скрыт (стартовое состояние для «Настроить столбцы»). */
  hidden?: boolean
  /** Столбец нельзя скрыть — в списке настройки он выключен. */
  locked?: boolean
  /** Иконка в ячейке шапки (тип шапки `icon`) либо перед заголовком. */
  headIcon?: React.ReactNode

  /** Знаков после запятой — для `number` / `money` / `percent`. */
  decimals?: number
  /** Знак валюты для `money`. По умолчанию «₽». */
  currency?: string
  /** Знак после числа: «₽», «$», «%», «шт.». Может зависеть от строки. */
  unit?: string | ((row: Row) => string)
  /** Плюс и зелёный цвет у положительных значений. */
  signed?: boolean
  /** Цвет значения, если правило сложнее, чем `signed`. */
  tone?: (row: Row) => "default" | "positive"

  /** Тег статусного поля: цвет и подпись по значению. */
  tag?: (row: Row) => TableFieldTag
  /** Короткая форма `tag`: цвет по значению. */
  tagColors?: Record<string, TagColor>
  /** Короткая форма `tag`: подпись по значению. */
  tagLabels?: Record<string, React.ReactNode>

  /** Подписи логического поля. По умолчанию «Да» / «Нет». */
  booleanLabels?: { true: React.ReactNode; false: React.ReactNode }
  /** Подпись при нескольких значениях. По умолчанию «Несколько (N)». */
  listLabel?: (count: number) => React.ReactNode

  /** Пиктограмма поля типа `icon`. */
  icon?: (row: Row) => React.ReactNode

  /** Адрес ссылки для поля типа `link`. */
  href?: (row: Row) => string | undefined
  /** Нажатие на ссылку. Всплытие до строки останавливается само. */
  onLinkClick?: (row: Row) => void

  /** Набор действий строки — белый `SelectionButton`. */
  actions?: (row: Row) => SelectionButtonItem[]
  /** Единственное действие — кнопка-пиктограмма с обязательной подсказкой. */
  action?: (row: Row) => TableRowAction

  /** Состояние чекбокса, если оно не равно значению поля. */
  checked?: (row: Row) => boolean
  /** Переключение чекбокса. Без него чекбокс только показывает значение. */
  onCheckedChange?: (row: Row, checked: boolean) => void
}

export { TABLE_FIELD_TYPES }
export type { TableField, TableFieldTag, TableFieldType, TableFieldTypeSpec }
