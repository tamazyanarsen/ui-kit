import type * as React from "react"

import { compactList } from "@/components/ui/header-menu/compact-list"

import type { TableColumn } from "./column-settings"
import { isColumnVisible } from "./column-visibility"
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
    return Boolean(setting.locked) || isColumnVisible(setting)
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
  // Столбец значков — всегда шапка `icon`, даже без `headIcon`: ширина и
  // отступы шапки должны совпадать с ячейкой тела (32px, px-8 вокруг
  // глифа 16). Раньше без `headIcon` шапка становилась филлером — 52px
  // и лишний разделитель, а глиф в теле прижимался влево.
  if (field.type === "icon") return "icon"
  return fieldAlign(field) === "right" ? "subtitle-right" : "subtitle-left"
}

/**
 * Столбец иерархии — тот, что несёт шеврон и отступ по уровню.
 *
 * Объявленный `hierarchy` выигрывает; если его нет, шеврон вешается на первый
 * текстовый столбец, иначе вложенность вообще нечем раскрыть.
 *
 * ⚠️ Именно ТЕКСТОВЫЙ, а не «первый содержательный»: шеврон и отступ умеет
 * рисовать только текстовая ячейка. Раньше дерево с первым столбцом «№»
 * (`number`) или статусом (`tag`) получало иерархию на нём — и в строках не
 * было ни одной кнопки раскрытия, хотя шеврон «свернуть всё» в шапке был.
 * Объявленный столбец, который шеврон нарисовать не может, по той же
 * причине уступает первому текстовому.
 */
function hierarchyColumnKey<Row>(
  columns: TableField<Row>[],
  hierarchical: boolean
): string | undefined {
  if (!hierarchical) return undefined
  const canCarry = (field: TableField<Row>) =>
    TABLE_FIELD_TYPES[field.type ?? "text"].cell === "text"
  const declared = columns.find((field) => field.hierarchy)
  if (declared && canCarry(declared)) return declared.key
  return columns.find(canCarry)?.key ?? declared?.key
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
  return (compactList(fields) ?? [])
    .filter((field) => field.type !== "actions" && field.title !== undefined)
    .map((field) => ({
      id: field.key,
      label: field.title,
      visible: !field.hidden,
      locked: field.locked,
      pinned: Boolean(field.pin),
    }))
}

/**
 * Столбцы, которые нельзя скрыть, потому что таблица рисует дерево: столбец
 * иерархии, если хотя бы у одной строки есть вложенные. Без него свёрнутые
 * вложенные строки было нечем раскрыть (аудит 18). Результат передаётся в
 * `requiredIds` окна «Настроить столбцы».
 *
 * Считается при отрисовке из строк, а не пишется в список столбцов: список
 * обычно живёт в состоянии, а плоская это таблица или дерево, зависит от
 * данных. В плоской таблице тот же столбец скрывается как обычный.
 */
function treeRequiredColumnIds<Row>(
  fields: TableField<Row>[],
  rows: Row[],
  getChildren: (row: Row) => Row[] | undefined = (row) =>
    (row as { children?: Row[] }).children
): string[] {
  const tree = (compactList(rows) ?? []).some(
    (row) => (getChildren(row)?.length ?? 0) > 0
  )
  if (!tree) return []
  const key = hierarchyColumnKey(compactList(fields) ?? [], true)
  return key === undefined ? [] : [key]
}

export {
  collectUnitVariants,
  columnsFromFields,
  headCellType,
  hierarchyColumnKey,
  treeRequiredColumnIds,
  resolveColumns,
}
