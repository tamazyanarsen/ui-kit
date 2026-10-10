import type { SortableEntry } from "./use-sortable"

/**
 * Куда «приземлится» строка — разбор места вставки по структуре списка.
 * Вынесено из `use-sortable.ts` ради лимита 400 строк на файл.
 */

/** Индекс ближайшей строки, отличной от взятой, начиная с `from` вниз. */
function nextRow(items: SortableEntry[], dragId: string, from: number) {
  for (let i = from; i < items.length; i += 1) if (items[i].id !== dragId) return i
  return -1
}

/**
 * Глубина, на которой окажется строка после броска на `insertAt`.
 *
 * Линия наследует глубину строки под курсором (кадры 4/5 макета), но для
 * СМЫСЛА броска этого мало: нижняя половина раскрытого заголовка группы
 * даёт линию на уровне 0, а строка при этом встаёт первой ВНУТРЬ группы —
 * следующая за местом вставки строка вложенная. Поэтому глубина — бо́льшая
 * из двух: линии и следующей строки.
 */
function landingDepth(
  items: SortableEntry[],
  dragId: string,
  insertAt: number,
  lineDepth: number
) {
  const next = nextRow(items, dragId, insertAt)
  return Math.max(lineDepth, next >= 0 ? (items[next].depth ?? 0) : 0)
}

/**
 * Бросок на `insertAt` упирается в лимит группы — «ложный прогноз».
 *
 * Дизайн-чек 08.10, замечание 7: если в целевой группе уже предельное число
 * элементов (5 из 5 избранных), строка, вставшая ПОД последним, ничего не
 * поменяет — она не вытолкнет его собой. Значит, и линии там быть не должно.
 * А вот место ВМЕСТО последнего (и выше) законно: новая строка встаёт в
 * группу, а последняя уходит из неё — это решает потребитель в `onReorder`.
 *
 * Перестановка внутри той же группы лимит не задевает: число строк не
 * меняется.
 */
function exceedsGroupLimit(
  items: SortableEntry[],
  dragId: string,
  insertAt: number,
  depth: number
) {
  if (depth <= 0) return false
  // Заголовок группы — первая строка выше места вставки с меньшей глубиной.
  let header = -1
  for (let i = insertAt - 1; i >= 0; i -= 1) {
    if (items[i].id === dragId) continue
    if ((items[i].depth ?? 0) < depth) {
      if (items[i].group) header = i
      break
    }
  }
  const limit = header >= 0 ? items[header].limit : undefined
  if (limit === undefined) return false

  const headerDepth = items[header].depth ?? 0
  let last = header
  let count = 0
  for (let i = header + 1; i < items.length; i += 1) {
    if ((items[i].depth ?? 0) <= headerDepth) break
    if (items[i].id === dragId) return false
    last = i
    count += 1
  }
  return count >= limit && insertAt > last
}

/**
 * Глубины, на которых строка может приземлиться в место `insertAt`, — от
 * ближайшей к `ownDepth`.
 *
 * Мышь выбирает одну из двух линий на одном и том же месте вставки: нижняя
 * половина строки выше (её глубина) или верхняя половина строки ниже (её
 * глубина). Перенос стрелкой обязан давать те же ответы, что и бросок мышью
 * в ту же точку, — иначе `meta.depth` у потребителя зависел от устройства
 * ввода (ревью 10.10, п. 16). Из двух вариантов предпочитается тот, что
 * ближе к нынешней глубине строки: стрелка двигает строку, а не перекладывает
 * её между уровнями без нужды.
 */
function landingDepthOptions(
  items: SortableEntry[],
  dragId: string,
  insertAt: number,
  ownDepth: number
) {
  const lines: number[] = []
  for (let i = insertAt - 1; i >= 0; i -= 1) {
    if (items[i].id === dragId) continue
    lines.push(items[i].depth ?? 0)
    break
  }
  const next = nextRow(items, dragId, insertAt)
  if (next >= 0) lines.push(items[next].depth ?? 0)
  if (lines.length === 0) lines.push(0)
  const options = [...new Set(lines.map((line) => landingDepth(items, dragId, insertAt, line)))]
  return options.sort((a, b) => Math.abs(a - ownDepth) - Math.abs(b - ownDepth) || a - b)
}

export { landingDepth, landingDepthOptions, exceedsGroupLimit }
