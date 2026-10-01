import * as React from "react"

import type { TableCellProps } from "./cell"
import type { TableValueTone } from "./cell-value"
import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatTime,
  parseDate,
  parseNumericText,
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
 * как ноль рублей, которого в данных нет. У `render` прочерк ставится, только
 * когда пусты И его ответ, И значение поля: пустой ответ при непустом
 * значении — осознанное «здесь ничего», и ячейка остаётся пустой.
 *
 * `total` — итоговая строка. Её запись синтетическая (`total.row` несёт
 * только суммы), поэтому построчные функции поля на ней не зовутся:
 * `description`, `descriptionSign`, `descriptionSignTone`, `cellProps`,
 * `tone`, `unit`-функция, `tag`, `href`/`onLinkClick`, а ячейки `checkbox`,
 * `icon` и `actions` остаются пустыми. Иначе поле, читающее запись
 * (`r => r.meta.note`), роняло всю таблицу, а в строке «Итого» появлялось
 * живое меню действий над несуществующей записью. `render` зовётся лишь для
 * столбцов, у которых в итоге есть значение; `value` и `format` работают —
 * ими суммы итога и форматируются.
 */
function fieldCellProps<Row>(
  field: TableField<Row>,
  row: Row,
  { total = false }: { total?: boolean } = {}
): Partial<TableCellProps> {
  const type = field.type ?? "text"
  const spec = TABLE_FIELD_TYPES[type]
  const value = fieldValue(field, row)
  const empty = isEmptyValue(value)

  const base: Partial<TableCellProps> = {
    type: spec.cell,
    align: fieldAlign(field),
    description: total ? undefined : field.description?.(row),
    descriptionSign: total ? undefined : field.descriptionSign?.(row),
    descriptionSignTone: total ? undefined : field.descriptionSignTone?.(row),
    descriptionTone: total ? undefined : field.descriptionTone?.(row),
  }

  // Итог: слотовые ячейки пустые, а отданные строке `cellProps` не зовутся.
  if (total && (type === "checkbox" || type === "icon" || type === "actions")) {
    return type === "checkbox" ? { ...base, hideCheckbox: true } : base
  }
  const own = total ? undefined : field.cellProps?.(row)

  // Слотовые типы значение не показывают — они его отдают компоненту.
  if (type === "checkbox") {
    return {
      ...base,
      checked: field.checked ? field.checked(row) : Boolean(value),
      onCheckedChange: field.onCheckedChange
        ? (checked) => field.onCheckedChange?.(row, checked)
        : undefined,
      ...own,
    }
  }

  if (type === "icon") {
    return {
      ...base,
      // ⚠️ Именно `if`, а не `??`: `icon` вправе вернуть `null` — «у этой
      // строки пиктограммы нет». С `??` пустой ответ откатывался бы к
      // значению поля, и в ячейке появлялся бы сырой ноль вместо пустоты.
      icon: field.icon ? field.icon(row) : (value as React.ReactNode),
      ...own,
    }
  }

  if (type === "actions") {
    return {
      ...base,
      action: field.action?.(row),
      actions: field.actions?.(row),
      ...own,
    }
  }

  if (type === "tag" && !empty) {
    const tag = fieldTag(total ? { ...field, tag: undefined } : field, row, value)
    return {
      ...base,
      tagColor: tag.color,
      tagVariant: tag.variant,
      children: tag.label,
      ...own,
    }
  }

  // Пустая статусная ячейка рисуется прочерком, а не пустым тегом: тег без
  // подписи — это цветной прямоугольник ни о чём.
  const cellType = type === "tag" ? "text" : spec.cell

  // `render` строит ячейку по СТРОКЕ, а не по значению, поэтому пустота
  // значения его не отменяет: у вычисляемого столбца (`custom` без `value`)
  // значения по ключу нет вовсе, и раньше такой столбец целиком рисовался
  // прочерками.
  const render = field.render && !(total && empty) ? field.render : undefined
  const rendered = render ? render(row) : undefined
  const renderedEmpty =
    rendered === undefined || rendered === null || rendered === false || rendered === ""

  const content = render
    ? renderedEmpty && empty
      ? (field.empty ?? "—")
      : rendered
    : empty
      ? (field.empty ?? "—")
      : field.format
        ? field.format(value, row)
        : typeContent(
            total ? { ...field, href: undefined, onLinkClick: undefined } : field,
            row,
            value
          )

  const numeric = cellType === "number"

  return {
    ...base,
    type: cellType,
    children: content,
    // Знак живёт при значении: у пустой ячейки его нет, иначе колонка
    // показывала бы «— ₽». Готовая строка со своим знаком («5 000 ₽»,
    // «−5,5 %») второй раз его не получает — было «−5,5 %%».
    unit:
      empty || (!render && !field.format && hasOwnUnit(value))
        ? undefined
        : fieldUnit(total ? totalUnitField(field) : field, row),
    tone: numeric
      ? fieldTone(total ? { ...field, tone: undefined } : field, row, value)
      : field.tone && !total
        ? field.tone(row)
        : undefined,
    ...own,
  }
}

/**
 * Поле для знака единицы в итоге: `unit`-функция построчная и на
 * синтетической записи не зовётся — знак берётся из типа (`₽`, `%`).
 */
function totalUnitField<Row>(field: TableField<Row>): TableField<Row> {
  return typeof field.unit === "function" ? { ...field, unit: undefined } : field
}

/**
 * Готовая строка числа уже несёт единицу: после цифр идёт что-то ещё
 * («₽», «%», «шт.»). «10 000,00» единицы не несёт — её добавит колонка.
 */
function hasOwnUnit(value: unknown) {
  if (typeof value !== "string" || parseNumericText(value) === null) return false
  return /\D$/.test(value.trim())
}

/** Цвет числа: своё правило `tone` либо зелёный плюс у `signed`. */
function fieldTone<Row>(
  field: TableField<Row>,
  row: Row,
  value: unknown
): TableValueTone {
  if (field.tone) return field.tone(row)
  if (!field.signed) return "default"
  // Готовая строка красится, только если плюс в ней виден: «+31 922 ₽»
  // зелёная, как число `signed`, а «100» без плюса — нет, иначе цвет
  // противоречил бы тексту.
  const numeric =
    toNumber(value) ??
    (typeof value === "string" && /^\s*\+/.test(value) ? parseNumericText(value) : null)
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
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onClick?.()
  }
  // Без `href` ссылка — это действие, а не адрес: `<a>` без `href` не
  // попадает в обход по Tab и не нажимается с клавиатуры, поэтому такая
  // «ссылка» рисуется кнопкой с тем же видом.
  if (!href && onClick) {
    return (
      <button
        type="button"
        className="cursor-pointer text-link outline-none focus-visible:focus-ring"
        onClick={handleClick}
      >
        {children}
      </button>
    )
  }
  return (
    <a
      href={href}
      className="text-link outline-none focus-visible:focus-ring"
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

export { fieldCellProps }
