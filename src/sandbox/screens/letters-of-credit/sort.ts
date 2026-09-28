import type { TableField, TableSort } from "@/components/ui/table"

// Та же сортировка, что взяла бы сама таблица: выбранная пользователем, а
// пока её нет — первый сортируемый столбец по возрастанию. Экран считает её
// явно, потому что сортирует он (режет страницу после сортировки всего
// отбора), а не таблица. Скрытый в «Настроить столбцы» столбец в расчёт не
// идёт: строки, отсортированные по невидимому полю без индикатора,
// пользователь прочитать не может — то же правило, что у таблицы для своей
// сортировки.
function visibleSort<Row>(
  fields: TableField<Row>[],
  sort: TableSort | null,
  columns: { id: string; visible?: boolean }[]
): TableSort | null {
  const visible = new Set(
    columns.filter((column) => column.visible !== false).map((column) => column.id)
  )
  if (sort && visible.has(sort.key)) return sort
  const first = fields.find((field) => field.sortable && visible.has(field.key))
  return first ? { key: first.key, direction: "asc" } : null
}

export { visibleSort }
