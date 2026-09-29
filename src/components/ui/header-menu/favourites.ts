import type { HeaderMenuGroup, HeaderMenuLink } from "./header-menu"

// Избранное — единственный источник для пунктов нижнего ряда шапки.
//
// Это прямо задокументировано в MENU DOCS: у
// `Menu Header (ELK)` есть вариант `Size=None` с подсказкой «Избранное —
// наведите курсор на элемент в меню и нажмите ☆ справа, чтобы добавить его
// сюда», комментарий «Начально закреплённые наборы» перечисляет три
// стартовых набора избранного (именно ими и заполнен нижний ряд на макетах),
// а «Настройка избранного» делит все разделы на «Добавлено» и «Остальные
// разделы». То есть звезда в раскрытом меню и пункт в шапке — одно и то же
// состояние, а не два независимых списка.

/** Все ссылки раскрытого меню одним списком, в порядке групп. */
function collectMenuLinks(groups: HeaderMenuGroup[]): HeaderMenuLink[] {
  // Пустые группы и ссылки (`false`/`null` из `cond && …`) отбрасываются.
  return groups.flatMap((group) => (group?.links ?? []).filter(Boolean))
}

/**
 * Избранные разделы в порядке самого избранного (а не в порядке групп) —
 * пользователь задаёт этот порядок перетаскиванием в «Настройке
 * избранного», и нижний ряд шапки обязан его сохранять.
 *
 * Значения, которых в меню нет, отбрасываются: раздел мог уехать из
 * продуктовой полки, и держать в шапке пункт без названия хуже, чем
 * молча его не показать.
 */
function resolveFavouriteLinks(
  groups: HeaderMenuGroup[],
  favourites: string[]
): HeaderMenuLink[] {
  const byValue = new Map(collectMenuLinks(groups).map((link) => [link.value, link]))
  return favourites
    .map((value) => byValue.get(value))
    .filter((link): link is HeaderMenuLink => link !== undefined)
    // Повтор в списке избранного — одна ссылка, а не две с одним ключом.
    .filter((link, index, all) => all.indexOf(link) === index)
}

/** Остальные разделы — не добавленные в избранное, по алфавиту. */
function resolveRemainingLinks(
  groups: HeaderMenuGroup[],
  favourites: string[]
): HeaderMenuLink[] {
  const chosen = new Set(favourites)
  return collectMenuLinks(groups)
    .filter((link) => !chosen.has(link.value))
    .sort((a, b) => linkText(a).localeCompare(linkText(b), "ru"))
}

/**
 * Текст ссылки для сортировки. `label` — ReactNode, поэтому для строк
 * берём их как есть, а для разметки откатываемся на `value`: сортировать по
 * `String(<span/>)` было бы хуже, чем по стабильному идентификатору.
 */
function linkText(link: HeaderMenuLink): string {
  return typeof link.label === "string" ? link.label : link.value
}

/** Переключение одной звезды: добавляем в конец, убираем по значению. */
function toggleFavourite(favourites: string[], value: string): string[] {
  return favourites.includes(value)
    ? favourites.filter((item) => item !== value)
    : [...favourites, value]
}

/** Перестановка внутри избранного (перетаскивание в «Настройке»). */
function moveFavourite(favourites: string[], from: number, to: number): string[] {
  if (from === to || from < 0 || to < 0 || from >= favourites.length || to >= favourites.length) {
    return favourites
  }
  const next = favourites.slice()
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export {
  collectMenuLinks,
  resolveFavouriteLinks,
  resolveRemainingLinks,
  toggleFavourite,
  moveFavourite,
  linkText,
}
