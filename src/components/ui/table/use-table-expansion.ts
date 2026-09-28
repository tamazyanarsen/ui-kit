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
  // Сворачиваемые ключи, которые таблица уже видела. `defaultCollapsed`
  // применяется к каждой группе при её ПЕРВОМ появлении, а не только к тем,
  // что были на монтировании: при загрузке данных после первого рендера
  // (пустой массив → строки) дерево иначе приходило развёрнутым целиком.
  const [seen, setSeen] = React.useState<ReadonlySet<string>>(
    () => new Set(expandableKeys)
  )
  const unseen = expandableKeys.filter((key) => !seen.has(key))
  if (unseen.length > 0) {
    // Обновление состояния прямо в рендере — штатный приём React для
    // состояния, выводимого из пропов: повторный рендер идёт сразу, до
    // отрисовки, и развёрнутый кадр на экран не попадает.
    setSeen(new Set([...seen, ...unseen]))
    if (defaultCollapsed) setCollapsed(new Set([...collapsed, ...unseen]))
  }

  // Набор, а не `includes` по массиву: `isExpanded` зовётся на каждую
  // группу и каждую видимую строку, и поиск по массиву давал
  // O(строк × раскрытых) на рендер.
  const expandedSet = React.useMemo(
    () => (expandedKeys ? new Set(expandedKeys) : null),
    [expandedKeys]
  )
  const isExpanded = React.useCallback(
    (key: string) => (expandedSet ? expandedSet.has(key) : !collapsed.has(key)),
    [expandedSet, collapsed]
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
