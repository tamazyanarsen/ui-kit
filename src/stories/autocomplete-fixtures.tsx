/* Данные витрин Autocomplete. Лежат в src/stories, а не рядом с компонентом:
   см. docs/conventions.md, «Помощники витрин живут в src/stories». */

export interface Organization {
  value: string
  label: string
  subtitle: string
}

/** Список «поиск организации по названию или ИНН»: у каждой строки заголовок и подзаголовок. */
export const ORGANIZATIONS: Organization[] = [
  { value: "org-1", label: "ООО «Ромашка»", subtitle: "ИНН 7701234567 КПП 770101001" },
  { value: "org-2", label: "ООО «Ромашка-Сервис»", subtitle: "ИНН 7702345678 КПП 770201001" },
  { value: "org-3", label: "АО «Роснефтьторг»", subtitle: "ИНН 7703456789 КПП 770301001" },
  { value: "org-4", label: "ИП Петров Пётр Петрович", subtitle: "ИНН 770412345678" },
  { value: "org-5", label: "ПАО «Северсталь-Инвест»", subtitle: "ИНН 7705567890 КПП 770501001" },
  { value: "org-6", label: "ООО «Вектор»", subtitle: "ИНН 7706678901 КПП 770601001" },
  { value: "org-7", label: "ЗАО «Альфа-Ромео Групп»", subtitle: "ИНН 7707789012 КПП 770701001" },
  { value: "org-8", label: "ООО «Торговый дом Ромашковая долина»", subtitle: "ИНН 7708890123 КПП 770801001" },
]

/** Без учёта регистра: по названию и по подзаголовку (ИНН/КПП), как в «Фильтрации (ЕЛК)». */
export function searchOrganizations(query: string): Organization[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return ORGANIZATIONS.filter((o) => o.label.toLowerCase().includes(q) || o.subtitle.toLowerCase().includes(q))
}
