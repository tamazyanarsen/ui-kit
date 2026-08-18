import * as React from "react"

import { ViewportContext } from "./viewport"

/** Matches Tailwind's `md` breakpoint (768px), the same line the kit's
 * mobile/desktop variants switch on.
 *
 * Needed wherever a breakpoint changes *what renders*, not just how it looks:
 * Hint swaps its desktop popover for a Modal bottom sheet below `md`, and
 * Input only offers its overflow Tooltip above it. CSS can't express either,
 * since both are portalled subtrees.
 *
 * Оборачивающий `<ViewportScope viewport="mobile">` перебивает ширину окна —
 * это JS-половина того же механизма, что и вариант `desktop:` в CSS (см.
 * src/lib/viewport.tsx). Без неё матрица с колонками Desktop/Mobile рядом
 * рисовала бы в обеих колонках одну и ту же форму.
 *
 * Guarded for environments without matchMedia (jsdom, SSR) — those report
 * "not desktop" rather than throwing, so the mobile form is the safe default.
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
