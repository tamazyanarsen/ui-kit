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
  // Нажатие указателем внутри колонки: следующий `focus` пришёл от него.
  const pointerFocus = React.useRef(false)

  const sync = React.useCallback(() => {
    const next = sources.current.hover || sources.current.focus
    if (next === paused.current) return
    paused.current = next
    if (next) pause()
    else resume()
  }, [pause, resume])

  // Колонка, снятая на паузе (смена раскладки, маршрута, условный рендер),
  // иначе навсегда оставляла провайдер на паузе: `add` клал остаток без
  // таймера, и все следующие тосты не закрывались. `resume` берётся из ref,
  // чтобы смена его идентичности не снимала паузу под курсором.
  const resumeRef = React.useRef(resume)
  resumeRef.current = resume
  React.useEffect(
    () => () => {
      if (!paused.current) return
      paused.current = false
      resumeRef.current()
    },
    []
  )

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
      // Кнопку отпустили за колонкой (выделение текста увели наружу) —
      // `pointerup` сюда не пришёл, и флаг дожил бы до Tab с клавиатуры.
      pointerFocus.current = false
      sync()
    },
    onPointerDownCapture() {
      pointerFocus.current = true
    },
    // Фокус от нажатия приходит между `pointerdown` и `pointerup`; щелчок по
    // тексту фокуса не даёт, и флаг не должен дожить до Tab с клавиатуры.
    onPointerUpCapture() {
      pointerFocus.current = false
    },
    onFocusCapture() {
      // Фокус от щелчка мышью паузой не считается: курсор уже держит её
      // наведением, а после увода фокус оставался на кнопке действия — и
      // очередь стояла, пока пользователь не щёлкнет где-то ещё.
      sources.current.focus = !pointerFocus.current
      pointerFocus.current = false
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
