import {
  isGroup,
  topicText,
  type HelpNode,
  type HelpSection,
  type HelpTopic,
} from "./types"

// Поиск по разделам — секция «Как работает поиск» (70400:31096), три кадра с
// комментариями:
//
//   Шаг 1. «Нажимаем на строку поиска, пока ничего не ввели — нам доступен
//          весь перечень разделов».
//   Шаг 2. «Ввели поисковый запрос и запустился процесс поиска по названию
//          разделов, названию темы и текстам в контенте. Пока осуществляется
//          поиск — в строке появляется лоадер. Поиск является полнотекстовым».
//   Шаг 3. «Когда процесс поиска завершился, в списке разделов остались
//          только те, в которых: 1) название раздела удовлетворяет поиску;
//          2) название хотя бы одной темы в разделе удовлетворяет поиску;
//          3) в случаях, если раздел состоит в группе, то показывать название
//          группы и только те вложенные разделы, которые удовлетворяют
//          поиску. Выбранным становится первый по списку раздел. Если стереть
//          поисковый запрос, то после обновления вернётся снова полный список
//          разделов».
//
// Пункт 2 комментария говорит «по названию темы», но там же сказано, что
// поиск полнотекстовый и идёт «по текстам в контенте», — поэтому тема
// считается подходящей и по своему тексту, и по именам вложений. Иначе
// «полнотекстовый» не значило бы ничего.

/** ё и е в запросах путают все, поэтому сводим их к одной букве. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/ё/g, "е")
}

/** Сколько раз запрос встречается в строке. */
function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0
  let count = 0
  let from = 0
  for (;;) {
    const at = haystack.indexOf(needle, from)
    if (at === -1) return count
    count += 1
    from = at + needle.length
  }
}

interface SearchResult {
  /** Дерево разделов, обрезанное по правилам Шага 3. */
  nodes: HelpNode[]
  /** Совпадений в разделе — число в счётчике у его строки. */
  counts: Record<string, number>
  /** Темы раздела, попавшие в выдачу. */
  topics: Record<string, HelpTopic[]>
  /** «Найдено совпадений: N». */
  total: number
}

function searchSection(
  section: HelpSection,
  query: string
): { count: number; topics: HelpTopic[] } | null {
  const titleHits = countOccurrences(normalize(section.title), query)
  const topics = section.topics.filter((topic) =>
    normalize(topicText(topic)).includes(query)
  )
  const topicHits = section.topics.reduce(
    (sum, topic) => sum + countOccurrences(normalize(topicText(topic)), query),
    0
  )

  if (!titleHits && !topics.length) return null

  return {
    count: titleHits + topicHits,
    // Раздел мог попасть в выдачу одним своим названием — тогда показываем
    // его целиком, а не пустым.
    topics: topics.length ? topics : section.topics,
  }
}

/** Полный список без фильтрации — состояние «запроса нет». */
function allSections(nodes: HelpNode[]): SearchResult {
  const topics: Record<string, HelpTopic[]> = {}
  for (const node of nodes) {
    const sections = isGroup(node) ? node.children : [node]
    for (const section of sections) topics[section.value] = section.topics
  }
  return { nodes, counts: {}, topics, total: 0 }
}

function searchSections(nodes: HelpNode[], rawQuery: string): SearchResult {
  const query = normalize(rawQuery.trim())
  if (!query) return allSections(nodes)

  const counts: Record<string, number> = {}
  const topics: Record<string, HelpTopic[]> = {}
  let total = 0

  function keep(section: HelpSection): HelpSection | null {
    const hit = searchSection(section, query)
    if (!hit) return null
    counts[section.value] = hit.count
    topics[section.value] = hit.topics
    total += hit.count
    return section
  }

  const result: HelpNode[] = []
  for (const node of nodes) {
    if (!isGroup(node)) {
      if (keep(node)) result.push(node)
      continue
    }
    const children = node.children.filter((child) => keep(child) !== null)
    if (children.length) result.push({ ...node, children })
  }

  return { nodes: result, counts, topics, total }
}

export { searchSections }
export type { SearchResult }
