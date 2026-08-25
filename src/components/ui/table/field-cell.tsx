import * as React from "react"

import type { TableCellProps } from "./cell"
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatTime,
  parseDate,
  toNumber,
  withSign,
} from "./field-format"
import { TABLE_FIELD_TYPES, type TableField } from "./field-types"
import {
  fieldAlign,
  fieldTag,
  fieldUnit,
  fieldValue,
  isEmptyValue,
  listContent,
} from "./field-value"

// Сборка ячейки по типу поля — то место, ради которого весь конфиг и заведён.

/**
 * Содержимое и пропы ячейки для одного поля одной строки — то самое
 * «построение ячейки по типу».
 *
 * Порядок разрешения: `render` (своя разметка) → `format` (своё
 * форматирование значения) → форматирование по типу. Пустое значение
 * заменяется прочерком, и знак валюты при этом не рисуется: «— ₽» читается
 * как ноль рублей, которого в данных нет.
 */
function fieldCellProps<Row>(
  field: TableField<Row>,
  row: Row
): Partial<TableCellProps> {
  const type = field.type ?? "text"
  const spec = TABLE_FIELD_TYPES[type]
  const value = fieldValue(field, row)
  const empty = isEmptyValue(value)

  const base: Partial<TableCellProps> = {
    type: spec.cell,
    align: fieldAlign(field),
    description: field.description?.(row),
  }

  // Слотовые типы значение не показывают — они его отдают компоненту.
  if (type === "checkbox") {
    return {
      ...base,
      checked: field.checked ? field.checked(row) : Boolean(value),
      onCheckedChange: field.onCheckedChange
        ? (checked) => field.onCheckedChange?.(row, checked)
        : undefined,
      ...field.cellProps?.(row),
    }
  }

  if (type === "icon") {
    return {
      ...base,
      // ⚠️ Именно `if`, а не `??`: `icon` вправе вернуть `null` — «у этой
      // строки пиктограммы нет». С `??` пустой ответ откатывался бы к
      // значению поля, и в ячейке появлялся бы сырой ноль вместо пустоты.
      icon: field.icon ? field.icon(row) : (value as React.ReactNode),
      ...field.cellProps?.(row),
    }
  }

  if (type === "actions") {
    return {
      ...base,
      action: field.action?.(row),
      actions: field.actions?.(row),
      ...field.cellProps?.(row),
    }
  }

  if (type === "tag" && !empty) {
    const tag = fieldTag(field, row, value)
    return {
      ...base,
      tagColor: tag.color,
      children: tag.label,
      ...field.cellProps?.(row),
    }
  }

  // Пустая статусная ячейка рисуется прочерком, а не пустым тегом: тег без
  // подписи — это цветной прямоугольник ни о чём.
  const cellType = type === "tag" ? "text" : spec.cell

  const content = empty
    ? (field.empty ?? "—")
    : field.render
      ? field.render(row)
      : field.format
        ? field.format(value, row)
        : typeContent(field, row, value)

  const numeric = cellType === "number"

  return {
    ...base,
    type: cellType,
    children: content,
    // Знак живёт при значении: у пустой ячейки его нет, иначе колонка
    // показывала бы «— ₽».
    unit: empty ? undefined : fieldUnit(field, row),
    tone: numeric ? fieldTone(field, row, value) : undefined,
    ...field.cellProps?.(row),
  }
}

/** Цвет числа: своё правило `tone` либо зелёный плюс у `signed`. */
function fieldTone<Row>(
  field: TableField<Row>,
  row: Row,
  value: unknown
): "default" | "positive" {
  if (field.tone) return field.tone(row)
  if (!field.signed) return "default"
  const numeric = toNumber(value)
  return numeric !== null && numeric > 0 ? "positive" : "default"
}

/** Форматирование значения по типу поля. */
function typeContent<Row>(
  field: TableField<Row>,
  row: Row,
  value: unknown
): React.ReactNode {
  const type = field.type ?? "text"

  // Массив в любом текстовом поле сворачивается в «Несколько (N)» — правило
  // документации, а не свойство типа `list`.
  if (Array.isArray(value)) return listContent(field, value)

  switch (type) {
    case "number":
    case "money":
    case "percent": {
      const numeric = toNumber(value)
      // Число уже пришло готовой строкой («10 000,00») — форматировать его
      // повторно нельзя: разряды и запятая в нём уже расставлены.
      if (numeric === null) return String(value)
      const decimals = field.decimals ?? (type === "number" ? undefined : 2)
      return withSign(formatNumber(numeric, decimals), numeric, field.signed)
    }
    case "date":
    case "datetime":
    case "time": {
      const date = parseDate(value)
      if (!date) return String(value)
      if (type === "date") return formatDate(date)
      if (type === "time") return formatTime(date)
      return formatDateTime(date)
    }
    case "boolean":
      return value
        ? (field.booleanLabels?.true ?? "Да")
        : (field.booleanLabels?.false ?? "Нет")
    case "link":
      return (
        <FieldLink
          href={field.href?.(row)}
          onClick={field.onLinkClick ? () => field.onLinkClick?.(row) : undefined}
        >
          {String(value)}
        </FieldLink>
      )
    case "custom":
      // `custom` без `render` — ошибка конфига, а не пустая ячейка: молчать
      // об этом значит показать прочерк там, где ждали свою разметку.
      return field.render?.(row) ?? null
    default:
      return String(value)
  }
}

/**
 * Ссылка в ячейке. Всплытие останавливается всегда: строка таблицы сама
 * может вести на карточку, и без остановки одно нажатие срабатывало бы
 * дважды — по ссылке и по строке.
 */
function FieldLink({
  href,
  onClick,
  children,
}: {
  href?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="text-link outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}

export { fieldCellProps }
