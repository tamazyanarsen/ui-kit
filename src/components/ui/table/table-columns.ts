import type * as React from "react"

import type { TableColumn } from "./column-settings"
import { TABLE_FIELD_TYPES, type TableField } from "./field-types"
import { fieldAlign, fieldUnit } from "./field-value"
import type { FlatRow } from "./table-rows"
import type { TableHeadCellType } from "./types"

// Столбцы: какие из объявленных полей показывать, в каком порядке, каким
// типом ячейки шапки и с каким набором знаков в колонке.

/**
 * Видимые столбцы в нужном порядке.
 *
 * Настройка распоряжается только теми полями, которые в ней объявлены:
 * остальные остаются на своих местах и видимыми. Иначе таблица теряла бы
 * служебные столбцы (иерархию, действия) в тот момент, когда место
 * использования забыло перечислить их в списке настройки.
 */
function resolveColumns<Row>(
  fields: TableField<Row>[],
  settings: TableColumn[] | undefined
): TableField<Row>[] {
  const managed = (field: TableField<Row>) =>
    Boolean(settings?.some((column) => column.id === field.key))

  const shown = fields.filter((field) => {
    const setting = settings?.find((column) => column.id === field.key)
    if (!setting) return !field.hidden
    return Boolean(setting.locked || setting.visible)
  })
  if (!settings) return shown

  // Поля из настройки занимают ТЕ ЖЕ позиции, что и раньше, но в порядке
  // настройки: так перестановка не может выкинуть неуправляемый столбец с
  // его места.
  const ordered = shown
    .filter(managed)
    .sort(
      (a, b) =>
        settings.findIndex((column) => column.id === a.key) -
        settings.findIndex((column) => column.id === b.key)
    )
  let cursor = 0
  return shown.map((field) => (managed(field) ? ordered[cursor++] : field))
}

/** Тип ячейки шапки по типу поля и выключке. */
function headCellType<Row>(
  field: TableField<Row>,
  headMenu: React.ReactNode
): TableHeadCellType {
  // Над столбцом действий — филлер: у него нет ни названия, ни групповых
  // действий, но разделитель и линия под шапкой нужны. Меню таблицы, если
  // оно есть, занимает ровно это место.
  if (field.type === "actions") return headMenu ? "button" : "filler"
  if (field.type === "icon") return field.headIcon ? "icon" : "filler"
  return fieldAlign(field) === "right" ? "subtitle-right" : "subtitle-left"
}

/**
 * Столбец иерархии — тот, что несёт шеврон и отступ по уровню.
 *
 * Объявленный `hierarchy` выигрывает; если его нет, шеврон вешается на первый
 * содержательный столбец, иначе вложенность вообще нечем раскрыть.
 */
function hierarchyColumnKey<Row>(
  columns: TableField<Row>[],
  hierarchical: boolean
): string | undefined {
  if (!hierarchical) return undefined
  const declared = columns.find((field) => field.hierarchy)
  if (declared) return declared.key
  return columns.find(
    (field) => !TABLE_FIELD_TYPES[field.type ?? "text"].control
  )?.key
}

/**
 * Все знаки, встречающиеся в колонке. Ячейка своей колонки не видит, поэтому
 * список собирается здесь: когда знаков больше одного, слот резервирует
 * ширину по самому широкому, и разряды в колонке стоят друг под другом даже
 * там, где рядом «₽» и «$».
 *
 * Считаются ВСЕ строки дерева, включая свёрнутые: ширина колонки не должна
 * прыгать от раскрытия строки.
 */
function collectUnitVariants<Row>(
  columns: TableField<Row>[],
  allRows: FlatRow<Row>[]
): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const field of columns) {
    // Знак, заданный строкой, у всей колонки один — резервировать нечего.
    if (typeof field.unit !== "function") continue
    const variants = new Set<string>()
    for (const entry of allRows) {
      const unit = fieldUnit(field, entry.row)
      if (unit !== undefined) variants.add(unit)
    }
    if (variants.size > 1) map[field.key] = [...variants]
  }
  return map
}

/**
 * Список столбцов для «Настроить столбцы» из того же конфига полей — чтобы
 * названия колонок не пришлось писать дважды.
 *
 * Не попадают в список два случая: столбец действий (скрывать его незачем —
 * он и так без названия) и любое поле без `title`, потому что строка
 * настройки состоит ровно из названия столбца, и безымянную выключать
 * пришлось бы вслепую.
 */
function columnsFromFields<Row>(fields: TableField<Row>[]): TableColumn[] {
  return fields
    .filter((field) => field.type !== "actions" && field.title !== undefined)
    .map((field) => ({
      id: field.key,
      label: field.title,
      visible: !field.hidden,
      locked: field.locked,
    }))
}

export {
  collectUnitVariants,
  columnsFromFields,
  headCellType,
  hierarchyColumnKey,
  resolveColumns,
}
