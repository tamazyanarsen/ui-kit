import * as React from "react"

import { useLatest } from "@/lib/use-latest"

/**
 * Появление и уход ButtonMenuBlack движением.
 *
 * Правки UI-Kit от 25.10, «ButtonMenuBlack — появление и уход движением»:
 * появление — выезд снизу вверх на свою высоту (320 мс, мягкая кривая
 * `--ease-soft`), уход — вниз (200 мс, `--ease-out`), и только потом панель
 * убирается из разметки. На время ухода она показывает последний состав
 * выбранного, а не пустое состояние. При «уменьшить движение» — без сдвига:
 * классы с кадрами стоят под `motion-safe:`, а уход тогда не ждёт вовсе.
 * Сами кадры (`button-menu-black-in` / `-out`) — в styles/rules-overlays.css.
 */

/** Появление — 320 мс. */
const ENTER_MS = 320
/** Уход — 200 мс: уход всегда быстрее появления. */
const EXIT_MS = 200

const ENTER_CLASS =
  "motion-safe:animate-[button-menu-black-in_320ms_var(--ease-soft)_both]"
const EXIT_CLASS =
  "pointer-events-none motion-safe:animate-[button-menu-black-out_200ms_var(--ease-out)_forwards]"

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Держит панель в разметке на время ухода и отдаёт класс движения.
 *
 * Класс появления живёт только первые 320 мс после показа: блок «кнопка +
 * панель» и голая панель — разные узлы, и класс, оставленный насовсем,
 * проигрывал бы выезд заново на каждом переключении «выбрано всё / не всё».
 *
 * `onEntered` зовётся, когда выезд доиграл: панель публикует занятый низ
 * вьюпорта (`--viewport-inset-bottom`) по своему прямоугольнику, а на первом
 * кадре выезда она ещё сдвинута вниз на свою высоту.
 */
function useBlackPresence<P>(
  open: boolean | undefined,
  props: P,
  onEntered?: () => void
) {
  const shown = open !== false
  const held = React.useRef(props)
  if (shown) held.current = props

  const [present, setPresent] = React.useState(shown)
  if (shown && !present) setPresent(true)

  // Выезд играет при показе: первом и повторном — в том числе когда панель
  // вернули посреди ухода.
  const [entering, setEntering] = React.useState(shown)
  const wasClosing = React.useRef(false)
  if (shown && (!present || wasClosing.current) && !entering) setEntering(true)

  const onEnteredRef = useLatest(onEntered)
  React.useEffect(() => {
    if (!entering) return
    const timer = setTimeout(() => {
      setEntering(false)
      onEnteredRef.current?.()
    }, ENTER_MS)
    return () => clearTimeout(timer)
  }, [entering, onEnteredRef])

  React.useEffect(() => {
    if (shown || !present) return
    if (prefersReducedMotion()) {
      setPresent(false)
      return
    }
    const timer = setTimeout(() => setPresent(false), EXIT_MS)
    return () => clearTimeout(timer)
  }, [shown, present])

  const closing = !shown && present
  wasClosing.current = closing
  return {
    /** Рисовать ли панель вообще. */
    present: shown || present,
    /** Идёт уход. */
    closing,
    /** Пропсы для отрисовки: на время ухода — последние показанные. */
    props: shown ? props : held.current,
    /** Класс движения для внешнего узла панели. */
    motionClass: closing ? EXIT_CLASS : entering ? ENTER_CLASS : undefined,
  }
}

export { useBlackPresence, ENTER_MS, EXIT_MS }
