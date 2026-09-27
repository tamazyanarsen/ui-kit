import * as React from "react"

import { ViewportContext } from "./viewport"

/** Совпадает с брейкпоинтом `md` в Tailwind (768px) — той же границей, по
 * которой переключаются мобильные и десктопные варианты кита.
 *
 * Нужен везде, где брейкпоинт меняет *что именно рисуется*, а не только
 * внешний вид: Hint ниже `md` подменяет десктопный поповер на нижнюю
 * шторку Modal, а Input предлагает свою подсказку о переполнении только
 * выше этой границы. Ни то, ни другое средствами CSS не выразить, потому
 * что оба — поддеревья в портале.
 *
 * Оборачивающий `<ViewportScope viewport="mobile">` перебивает ширину окна —
 * это JS-половина того же механизма, что и вариант `desktop:` в CSS (см.
 * src/lib/viewport.tsx). Без неё матрица с колонками Desktop/Mobile рядом
 * рисовала бы в обеих колонках одну и ту же форму.
 *
 * Защищено от окружений без matchMedia (jsdom, серверная отрисовка): они
 * сообщают «не десктоп», а не падают, поэтому безопасным умолчанием
 * остаётся мобильная форма.
 */
export function useIsDesktop(): boolean {
  const forced = React.useContext(ViewportContext)
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const query = window.matchMedia("(min-width: 768px)")
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  if (forced !== "auto") return forced === "desktop"
  return isDesktop
}
