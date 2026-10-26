import * as React from "react"

import { ViewportContext } from "./viewport"

/** Порог десктопа — 1280px, та же граница, по которой переключаются
 * мобильные и десктопные варианты кита (вариант `desktop:` в
 * src/styles/variants.css). Правки UI-Kit от 25.10, правило каркаса «Порог
 * десктопа — 1280 вместо 768»: десктопная раскладка не бывает уже 1280
 * (`GRID_VIEWPORT_MIN`), поэтому всё, что уже, — мобильный/планшетный вид.
 * До 25.10 порог совпадал с `md` Tailwind (768px), а на 768–1279 страница
 * держала 1280 с горизонтальной прокруткой.
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
 *
 * ⚠️ В браузере значение читается СРАЗУ, в инициализаторе состояния, а не
 * первым эффектом. С `false` до эффекта первый кадр на десктопе рисовался
 * мобильным: Hint с `defaultOpen` успевал смонтировать шторку Modal (с
 * подложкой, блокировкой прокрутки и перехватом фокуса), а шапка
 * BlockWidget — переложить `action` в другого родителя и перемонтировать
 * его. Цена — расхождение с серверной разметкой при SSR-гидратации на
 * десктопе; кит отрисовывается на клиенте, так что это осознанный обмен.
 */
function readIsDesktop(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false
  }
  return window.matchMedia(DESKTOP_QUERY).matches
}

export const DESKTOP_QUERY = "(min-width: 1280px)"

export function useIsDesktop(): boolean {
  const forced = React.useContext(ViewportContext)
  const [isDesktop, setIsDesktop] = React.useState(readIsDesktop)

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const query = window.matchMedia(DESKTOP_QUERY)
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  if (forced !== "auto") return forced === "desktop"
  return isDesktop
}
