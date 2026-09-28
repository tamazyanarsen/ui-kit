import * as React from "react"

import type { ToastItem } from "./use-toast"

/**
 * Пауза времени жизни по наведению и по фокусу в колонке тостов.
 *
 * Источников два, и каждый учитывается отдельно: пауза снимается, только
 * когда ушли И курсор, И фокус. С одним общим флагом увод мыши снимал паузу
 * при фокусе внутри колонки, а Tab наружу — при курсоре над ней.
 *
 * ⚠️ Фокус, ушедший вместе с узлом, `blur` не присылает: Tab на крестик и
 * Enter снимают тост из DOM, событие до корня React не доходит — и пауза
 * залипала навсегда, все следующие тосты висели бесконечно. Поэтому после
 * каждого изменения списка фокус перепроверяется по `activeElement`.
 */
function useToasterPause(
  toasts: ToastItem[],
  pause: () => void,
  resume: () => void
) {
  const ref = React.useRef<HTMLDivElement>(null)
  const sources = React.useRef({ hover: false, focus: false })
  const paused = React.useRef(false)

  const sync = React.useCallback(() => {
    const next = sources.current.hover || sources.current.focus
    if (next === paused.current) return
    paused.current = next
    if (next) pause()
    else resume()
  }, [pause, resume])

  React.useEffect(() => {
    if (!sources.current.focus) return
    if (ref.current?.contains(document.activeElement)) return
    sources.current.focus = false
    sync()
  }, [toasts, sync])

  return {
    ref,
    onMouseEnter() {
      sources.current.hover = true
      sync()
    },
    onMouseLeave() {
      sources.current.hover = false
      sync()
    },
    onFocusCapture() {
      sources.current.focus = true
      sync()
    },
    onBlurCapture(event: React.FocusEvent<HTMLDivElement>) {
      // Фокус переходит между кнопками внутри колонки — это не уход.
      if (ref.current?.contains(event.relatedTarget as Node | null)) return
      sources.current.focus = false
      sync()
    },
  }
}

export { useToasterPause }
