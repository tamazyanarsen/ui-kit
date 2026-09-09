import * as React from "react"

/**
 * Подписка на медиазапрос из JS.
 *
 * Нужна там, где порог меняет НЕ оформление, а состав разметки, — и потому не
 * выражается вариантом Tailwind. Первый такой случай — раскладка раскрытого
 * меню: до 1536 оно строится в три колонки, с 1536 — в четыре (дизайн-чек от
 * 08.09, замечание 3), а колонки здесь настоящие узлы с распределёнными по
 * ним карточками, а не CSS-грид.
 *
 * До первого эффекта возвращает `false`: в jsdom и на сервере `matchMedia`
 * может отсутствовать вовсе, и «узкий» — безопасное умолчание (меньше колонок
 * помещается всегда).
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [query])

  return matches
}

export { useMediaQuery }
