import * as React from "react"

import { useLatest } from "@/lib/use-latest"

/**
 * Плавная смена высоты контейнера, у которого высота по содержимому.
 *
 * Правки UI-Kit от 25.10, «Высоты перестраиваются с анимацией»: когда
 * содержимое меняется разом (фильтр, переключение вида, пустое состояние),
 * контейнер — модалка, штора не на весь экран, мобильный блок — меняет
 * высоту за 300 мс по мягкой кривой (`--duration-height`, `--ease-soft`).
 * Содержимое сразу в новом виде, анимируется только высота.
 *
 * Как устроено. `ResizeObserver` на самом контейнере сообщает новую высоту
 * уже после раскладки, но до отрисовки кадра — в этот момент на узел
 * ставится анимация Web Animations API «от прежней высоты к новой», и первый
 * же кадр рисуется со старой высотой: скачка нет. Анимация без `fill`, по
 * окончании узел возвращается к своей высоте по содержимому. Пока она идёт,
 * новые замеры пропускаются; если содержимое за это время ещё раз сменилось,
 * по окончании высота доезжает второй анимацией.
 *
 * Не анимируется (высота просто запоминается):
 *   • первое появление — у окна своя анимация открытия, и пока на узле идёт
 *     любая другая анимация (открытие, закрытие), высота не трогается;
 *   • смена размера окна браузера (поворот, клавиатура, ресайз);
 *   • `prefers-reduced-motion: reduce`;
 *   • схлопывание убранного элемента (`useCollapseExit` ставит на `<html>`
 *     атрибут `data-collapsing`) — контейнер и так ужимается следом;
 *   • `enabled: false` и случаи, на которые ответил `skip` (у модалки — вид
 *     на весь экран).
 *
 * Возвращает callback-ref: узел контейнера часто монтируется позже самого
 * компонента (попап модалки живёт в портале и появляется только открытым).
 */
interface SmoothHeightOptions {
  /** Выключить анимацию, не снимая ref. По умолчанию включено. */
  enabled?: boolean
  /**
   * Подрезать содержимое на время анимации (`overflow: hidden`). По
   * умолчанию да; выключают, когда подрезка уже есть внутри (у модалки —
   * внутренняя обёртка, а вынесенный крестик лежит за краем окна).
   */
  clip?: boolean
  /** Пропустить эту смену высоты (вызывается на каждой смене). */
  skip?: (element: HTMLElement) => boolean
}

const FALLBACK_DURATION = 300
const FALLBACK_EASING = "cubic-bezier(0.32, 0.72, 0, 1)"
/** Сколько после последнего `resize` окна смена высоты считается его следствием. */
const RESIZE_QUIET_MS = 200

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/** Убранный элемент схлопывается (`useCollapseExit`). */
function isCollapsing() {
  return document.documentElement.hasAttribute("data-collapsing")
}

/** Длительность и кривая — из токенов движения, с запасным значением. */
function readMotion() {
  const style = getComputedStyle(document.documentElement)
  const rawDuration = style.getPropertyValue("--duration-height").trim()
  const easing = style.getPropertyValue("--ease-soft").trim() || FALLBACK_EASING
  const value = parseFloat(rawDuration)
  const duration = Number.isFinite(value)
    ? rawDuration.endsWith("ms")
      ? value
      : value * 1000
    : FALLBACK_DURATION
  return { duration, easing }
}

/** На узле идёт чужая анимация (открытие/закрытие окна). */
function hasOtherAnimation(element: HTMLElement, own: Animation | null) {
  if (typeof element.getAnimations !== "function") return false
  return element
    .getAnimations()
    .some((animation) => animation !== own && animation.playState === "running")
}

function useSmoothHeight<T extends HTMLElement>(
  options: SmoothHeightOptions = {}
): React.RefCallback<T> {
  const [element, setElement] = React.useState<T | null>(null)
  const optionsRef = useLatest(options)

  React.useLayoutEffect(() => {
    if (!element || typeof ResizeObserver === "undefined") return
    let last = element.offsetHeight
    let animation: Animation | null = null
    let resizedAt = -Infinity

    const onResize = () => {
      resizedAt = performance.now()
    }

    const check = () => {
      if (animation) return
      const next = element.offsetHeight
      if (next === last) return
      const from = last
      last = next
      const { enabled = true, clip = true, skip } = optionsRef.current
      if (
        !enabled ||
        from === 0 ||
        performance.now() - resizedAt < RESIZE_QUIET_MS ||
        typeof element.animate !== "function" ||
        prefersReducedMotion() ||
        isCollapsing() ||
        hasOtherAnimation(element, null) ||
        skip?.(element)
      ) {
        return
      }

      const { duration, easing } = readMotion()
      const prevOverflow = element.style.overflow
      if (clip) element.style.overflow = "hidden"
      const current = element.animate(
        [{ height: `${from}px` }, { height: `${next}px` }],
        { duration, easing }
      )
      animation = current
      const settle = () => {
        if (animation !== current) return
        animation = null
        if (clip) element.style.overflow = prevOverflow
        // Содержимое могло смениться ещё раз, пока высота ехала.
        check()
      }
      current.onfinish = settle
      current.oncancel = settle
    }

    const observer = new ResizeObserver(check)
    observer.observe(element)
    window.addEventListener("resize", onResize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", onResize)
      const running = animation
      animation = null
      running?.cancel()
    }
  }, [element, optionsRef])

  return setElement as React.RefCallback<T>
}

export { useSmoothHeight }
export type { SmoothHeightOptions }
