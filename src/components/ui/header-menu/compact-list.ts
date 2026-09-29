/**
 * Список без пустых элементов. `[cond && item]` и результат `map` с
 * `undefined` дают в массиве `false`/`null`, и строка меню падала на
 * `item.value`. Если выбрасывать нечего, отдаётся тот же массив: ссылка
 * остаётся стабильной для `useMemo` и эффектов.
 */
function compactList<T>(
  list: readonly (T | null | undefined | false)[] | undefined
): T[] | undefined {
  if (!list || list.every(Boolean)) return list as T[] | undefined
  return list.filter(Boolean) as T[]
}

/** Группы меню без пустых групп и пустых ссылок внутри них. */
function compactGroups<G extends { links: readonly unknown[] }>(
  groups: readonly (G | null | undefined | false)[] | undefined
): G[] | undefined {
  const list = compactList(groups)
  if (!list || list.every((group) => group.links.every(Boolean))) return list
  return list.map((group) =>
    group.links.every(Boolean)
      ? group
      : { ...group, links: group.links.filter(Boolean) }
  )
}

export { compactList, compactGroups }
