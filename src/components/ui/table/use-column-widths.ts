import * as React from "react"

type ColumnWidths = Record<string, number>

interface UseColumnWidthsOptions {
  columnWidths?: ColumnWidths
  defaultColumnWidths?: ColumnWidths
  onColumnWidthsChange?: (widths: ColumnWidths) => void
}

/**
 * Ширины столбцов, которые пользователь задал тягой, — по ключу поля.
 *
 * Живут в модели таблицы, а не в ячейке шапки: ячейка размонтируется, когда
 * столбец скрывают в «Настроить столбцы», и её собственное состояние
 * терялось — после «скрыть → показать» столбец возвращался к ширине по
 * умолчанию. Требование `resizable` («система… запоминает, как пользователь
 * настраивает их ширину») так не выполнялось.
 *
 * Управляемый режим (`columnWidths` + `onColumnWidthsChange`) — чтобы
 * потребитель мог сохранить настройку между сеансами.
 */
function useColumnWidths({
  columnWidths,
  defaultColumnWidths,
  onColumnWidthsChange,
}: UseColumnWidthsOptions) {
  const [own, setOwn] = React.useState<ColumnWidths>(defaultColumnWidths ?? {})
  const widths = columnWidths ?? own

  // Последние ширины — в ref: тяга присылает десятки изменений за жест, и
  // каждое должно достраивать уже обновлённую карту, а не снимок рендера.
  const latest = React.useRef(widths)
  latest.current = widths

  const setColumnWidth = React.useCallback(
    (key: string, width: number) => {
      // Управляемый режим: карта строится от ширин, которые родитель ПРИНЯЛ.
      // Раньше она достраивала собственную последнюю запись, и отклонённое
      // родителем значение (например, `name: 500` при пределе 400) уезжало в
      // каждое следующее изменение — остальные столбцы переставали тянуться.
      if (columnWidths !== undefined) {
        onColumnWidthsChange?.({ ...columnWidths, [key]: width })
        return
      }
      const next = { ...latest.current, [key]: width }
      latest.current = next
      setOwn(next)
      onColumnWidthsChange?.(next)
    },
    [columnWidths, onColumnWidthsChange]
  )

  const columnWidth = (key: string): number | undefined => widths[key]

  return { columnWidth, setColumnWidth }
}

export { useColumnWidths }
export type { ColumnWidths }
