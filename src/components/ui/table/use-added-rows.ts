import * as React from "react"

/**
 * Подсветка появившихся строк — корневое правило таблиц кита.
 *
 * Дизайн-чек от 08.09, замечание 30: «Появление новых строк должно быть с
 * окраской. Завести корневое правило в таблицы, взять отсюда:
 * Templates-Containers».
 *
 * Механика подсветки в ките была и раньше (`<TableRow added>` и анимация
 * `table-row-added`, 2000 ms по документации таблиц), но включалась она только
 * вручную — через `isRowAdded`. То есть каждый экран должен был сам помнить,
 * какие строки только что приехали, и ни один этого не делал: реестр
 * аккредитивов после создания заявки показывал новую строку ровно так же, как
 * все остальные.
 *
 * Хук закрывает это правилом: строка, чьего ключа таблица ещё НЕ показывала,
 * считается появившейся, если рядом с ней остались строки прошлого набора.
 * Первый набор не подсвечивается — иначе таблица вспыхивала бы целиком при
 * монтировании.
 *
 * ⚠️ Отслеживаются ключи ВСЕГО дерева, а не видимых строк: раскрытие группы
 * добавляет её потомков в видимый набор, и по «видимым» они читались бы как
 * новые. Раскрытие — это не появление.
 */
const ADDED_HIGHLIGHT_MS = 2000

function useAddedRows(keys: string[], enabled: boolean) {
  // `null` — «первого набора ещё не было». Отличать его от пустого набора
  // обязательно: у таблицы, которая начинается с нуля строк, ПЕРВАЯ же
  // добавленная строка и есть появившаяся, и подсветить её надо.
  const previousRef = React.useRef<Set<string> | null>(null)
  // Все ключи, которые таблица когда-либо показывала. Строка, вернувшаяся
  // после сброса поиска или фильтра, не «появилась» — она уже была.
  const seenRef = React.useRef(new Set<string>())
  // Таймеры живут по партиям и гасятся ТОЛЬКО при размонтировании. Раньше
  // очистка эффекта убивала таймер прошлой партии, если набор менялся ещё
  // раз быстрее чем за 2000 мс, и её ключи оставались подсвеченными навсегда.
  const timersRef = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const [added, setAdded] = React.useState<ReadonlySet<string>>(new Set())

  React.useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const timer of timers) clearTimeout(timer)
      timers.clear()
    }
  }, [])

  // Ключ зависимости — строка, а не массив: массив пересоздаётся на каждый
  // рендер, и эффект срабатывал бы вхолостую (а вместе с ним и таймер).
  //
  // Разделитель — `\u0000`, потому что в ключе строки может встретиться
  // что угодно, включая запятую: на `join(",")` наборы `["a,b"]` и
  // `["a", "b"]` дали бы одну подпись и подсветка бы не сработала.
  const signature = keys.join("\u0000")

  React.useEffect(() => {
    if (!enabled) return
    const current = new Set(keys)
    const previous = previousRef.current
    const seen = seenRef.current
    previousRef.current = current

    const fresh = keys.filter((key) => !seen.has(key))
    for (const key of keys) seen.add(key)
    if (previous === null || fresh.length === 0) return

    // ⚠️ Появление — это новые строки РЯДОМ со старыми. Если из прошлого
    // набора не осталось ни одной строки, сменилась страница (или отбор
    // целиком), а не приехали данные: с `rows={pageRows}` каждая новая
    // страница иначе заливалась бы зелёным целиком. Пустой прошлый набор —
    // исключение: у таблицы с нуля строк первая же строка и есть новая.
    const continued =
      previous.size === 0 || keys.some((key) => previous.has(key))
    if (!continued) return

    setAdded((prev) => new Set([...prev, ...fresh]))
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      setAdded((prev) => {
        const next = new Set(prev)
        for (const key of fresh) next.delete(key)
        return next
      })
    }, ADDED_HIGHLIGHT_MS)
    timersRef.current.add(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, enabled])

  return added
}

export { useAddedRows, ADDED_HIGHLIGHT_MS }
