import * as React from "react"

import type { FlatRow } from "./table-rows"

interface TableSelectionOptions<Row> {
  /** Строки, которые сейчас видны: свёрнутая вложенность в выбор не идёт. */
  visibleRows: FlatRow<Row>[]
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  onSelectedKeysChange?: (keys: string[]) => void
  isRowSelectable?: (row: Row) => boolean
}

/**
 * Режим множественного выбора.
 *
 * Чекбокс шапки распоряжается только ВИДИМЫМИ строками — «Выбор всех видимых
 * строк».
 */
function useTableSelection<Row>({
  visibleRows,
  selectedKeys,
  defaultSelectedKeys,
  onSelectedKeysChange,
  isRowSelectable,
}: TableSelectionOptions<Row>) {
  const [ownSelected, setOwnSelected] = React.useState<readonly string[]>(
    defaultSelectedKeys ?? []
  )
  const selected = React.useMemo(
    () => new Set(selectedKeys ?? ownSelected),
    [selectedKeys, ownSelected]
  )

  function changeSelected(next: Set<string>) {
    if (!selectedKeys) setOwnSelected([...next])
    onSelectedKeysChange?.([...next])
  }

  function toggleSelected(key: string) {
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    changeSelected(next)
  }

  const selectableRows = visibleRows.filter(
    (entry) => !isRowSelectable || isRowSelectable(entry.row)
  )
  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((entry) => selected.has(entry.key))
  const someSelected =
    !allSelected && selectableRows.some((entry) => selected.has(entry.key))

  /** ⚠️ Круг: пусто → всё, частично → ВСЁ, всё → пусто. Добрать до полного
   * выбора можно из любого состояния, а сбросить — только из полного. */
  function toggleSelectedAll() {
    changeSelected(
      allSelected ? new Set() : new Set(selectableRows.map((entry) => entry.key))
    )
  }

  return {
    allSelected,
    selected,
    someSelected,
    toggleSelected,
    toggleSelectedAll,
  }
}

export { useTableSelection }
