import * as React from "react"

import type { FlatRow } from "./table-rows"

interface TableExpansionOptions<Row> {
  /** Все строки дерева, включая свёрнутые. */
  allRows: FlatRow<Row>[]
  /** Развёрнутые строки снаружи. Не задано — состояние живёт внутри. */
  expandedKeys?: string[]
  onExpandedKeysChange?: (keys: string[]) => void
  /** Стартовое состояние — свёрнуто до первого уровня. */
  defaultCollapsed?: boolean
}

/**
 * Сворачивание строк.
 *
 * ⚠️ Внутри хранятся СВЁРНУТЫЕ ключи, а не развёрнутые: иначе только что
 * пришедшая строка оказалась бы свёрнутой лишь потому, что её ключа не было в
 * наборе на момент первого рендера.
 */
function useTableExpansion<Row>({
  allRows,
  expandedKeys,
  onExpandedKeysChange,
  defaultCollapsed = false,
}: TableExpansionOptions<Row>) {
  const expandableKeys = React.useMemo(
    () => allRows.filter((entry) => entry.hasChildren).map((entry) => entry.key),
    [allRows]
  )
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(
    () => new Set(defaultCollapsed ? expandableKeys : [])
  )

  const isExpanded = React.useCallback(
    (key: string) =>
      expandedKeys ? expandedKeys.includes(key) : !collapsed.has(key),
    [expandedKeys, collapsed]
  )

  function changeExpanded(nextCollapsed: ReadonlySet<string>) {
    if (!expandedKeys) setCollapsed(nextCollapsed)
    onExpandedKeysChange?.(
      expandableKeys.filter((key) => !nextCollapsed.has(key))
    )
  }

  function toggleExpanded(key: string) {
    if (expandedKeys) {
      // В управляемом режиме источник истины снаружи — считаем от него.
      const expanded = new Set(expandedKeys)
      if (expanded.has(key)) expanded.delete(key)
      else expanded.add(key)
      onExpandedKeysChange?.([...expanded])
      return
    }
    const next = new Set(collapsed)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    changeExpanded(next)
  }

  const anyExpanded = expandableKeys.some((key) => isExpanded(key))

  /** «Нажатие кнопки сворачивания в шапке сворачивает весь блок до строк
   * первого уровня. Повторное нажатие разворачивает все строки». */
  function toggleExpandedAll() {
    changeExpanded(new Set(anyExpanded ? expandableKeys : []))
  }

  return { anyExpanded, isExpanded, toggleExpanded, toggleExpandedAll }
}

export { useTableExpansion }
