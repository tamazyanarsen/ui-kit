import { parseDate, toNumber } from "./field-format"
import { TABLE_FIELD_TYPES, type TableField } from "./field-types"

// Чтение значения поля и приведение его к тексту, числу или тегу. Здесь нет
// ни одного React-узла: этим же кодом пользуется сортировка, которой нужна
// сравнимая величина, а не разметка.

/** Значение поля: вычислением, по пути или по ключу. */
function fieldValue<Row>(field: TableField<Row>, row: Row): unknown {
  if (field.value) return field.value(row)
  return readPath(row, field.path ?? field.key)
}

function readPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (accumulator, part) =>
        accumulator == null
          ? undefined
          : (accumulator as Record<string, unknown>)[part],
      source
    )
}

/** Пусто — это `null`, `undefined`, пустая строка и пустой массив. */
function isEmptyValue(value: unknown) {
  if (value == null || value === "") return true
  return Array.isArray(value) && value.length === 0
}

/** Выключка столбца: из конфига, иначе из типа поля. */
function fieldAlign<Row>(field: TableField<Row>): "left" | "right" {
  return field.align ?? TABLE_FIELD_TYPES[field.type ?? "text"].align
}

function fieldUnit<Row>(field: TableField<Row>, row: Row): string | undefined {
  if (typeof field.unit === "function") return field.unit(row)
  if (field.unit !== undefined) return field.unit
  if (field.type === "money") return field.currency ?? "₽"
  if (field.type === "percent") return "%"
  return undefined
}

/**
 * «Несколько (N)». Одно значение показывается само собой — правило про
 * количество включается со второго.
 */
function listContent<Row>(field: TableField<Row>, values: unknown[]) {
  if (values.length === 1) return String(values[0])
  return field.listLabel?.(values.length) ?? `Несколько (${values.length})`
}

/** Тег статусного поля: полная форма `tag` либо словари цвета и подписи. */
function fieldTag<Row>(field: TableField<Row>, row: Row, value: unknown) {
  const explicit = field.tag?.(row)
  const key = value == null ? "" : String(value)
  return {
    label: explicit?.label ?? field.tagLabels?.[key] ?? key,
    // Серый — «нейтральное состояние» из документации, то есть безопасный
    // ответ на незнакомое значение: выдумывать «успешно» или «ошибку» по
    // ключу, которого нет в словаре, нельзя.
    color: explicit?.color ?? field.tagColors?.[key] ?? "grey",
    variant: explicit?.variant,
  }
}

/** Текст значения по типу поля — без React-узлов, для сортировки и поиска. */
function fieldText<Row>(field: TableField<Row>, row: Row): string {
  const value = fieldValue(field, row)
  if (isEmptyValue(value)) return ""
  const type = field.type ?? "text"

  if (Array.isArray(value)) return value.map(String).join(", ")
  if (type === "tag") return String(fieldTag(field, row, value).label)
  if (type === "boolean") {
    const labels = field.booleanLabels
    const label = value ? (labels?.true ?? "Да") : (labels?.false ?? "Нет")
    return typeof label === "string" ? label : String(value)
  }
  return String(value)
}

/**
 * Значение для сортировки: числа сравниваются числами, даты — временем,
 * остальное — текстом. Возвращает `null` для пустых, чтобы сортировка могла
 * увести их в конец независимо от направления.
 */
function fieldSortValue<Row>(
  field: TableField<Row>,
  row: Row
): number | string | null {
  const value = fieldValue(field, row)
  if (isEmptyValue(value)) return null
  const type = field.type ?? "text"

  if (type === "number" || type === "money" || type === "percent") {
    const numeric = toNumber(value)
    return numeric ?? fieldText(field, row)
  }
  if (type === "date" || type === "datetime" || type === "time") {
    return parseDate(value)?.getTime() ?? fieldText(field, row)
  }
  if (type === "checkbox" || type === "boolean") {
    return value ? 1 : 0
  }
  return fieldText(field, row)
}

export {
  fieldAlign,
  fieldSortValue,
  fieldTag,
  fieldText,
  fieldUnit,
  fieldValue,
  isEmptyValue,
  listContent,
}
