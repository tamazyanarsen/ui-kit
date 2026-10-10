import * as React from "react"

/**
 * Плавный уход закрываемого элемента: он гаснет, а его место схлопывается,
 * и соседи съезжают на освободившееся место в ту же анимацию.
 *
 * Дизайн-чек 08.10, замечание 11: «нажал на крестик — элемент не просто
 * уходит одним кадром, а фейдится. В этот же момент соседний контент
 * перестраивается… нижестоящий контент поднимается вверх. Длительность
 * 300ms». Замечание 24 — то же для Top Fixed Message, с подъёмом («фейд ап»).
 *
 * Как устроено. Компоненты кита с крестиком (Informer, Top Fixed Message,
 * файл в File Upload, чипс) управляемые: крестик только зовёт `onClose`, а
 * снимает элемент вызывающий код. Поэтому хук ОТКЛАДЫВАЕТ `onClose` на время
 * ухода: по крестику узел сначала схлопывается сам, а уже потом вызывающий
 * код снимает его из разметки — снятие пустого места невидимо. Вызывающему
 * ничего делать не надо: анимацию получают все потребители разом.
 *
 * Анимация — Web Animations API на самом узле, а не обёртка с
 * `grid-template-rows: 1fr → 0fr`: обёртка поменяла бы корень компонента
 * (его `className`, место во флексе родителя, `firstChild` в тестах). Узел
 * схлопывает свой размер вместе с полями и отступами, а зазор родителя
 * (`gap`) съедает отрицательным отступом — иначе в конце сосед прыгал бы на
 * величину зазора, когда узел снимут.
 *
 * Если анимировать нечем (jsdom, `prefers-reduced-motion`) — `onClose`
 * зовётся сразу, как раньше. Если вызывающий код узел НЕ снял (обработчик
 * только пишет в лог), узел возвращается на место: компонент управляемый, и
 * решать, исчезать ли ему, не ему.
 */
interface CollapseExitOptions {
  /** Ось схлопывания: `height` — для блоков в колонке, `width` — в строке. */
  axis?: "height" | "width"
  /** Подъём при угасании («фейд ап», замечание 24). */
  lift?: boolean
}

/** Длительность ухода — ступень `--duration-overlay` (tokens-motion.css). */
const DURATION = 300
/** `--ease-in-out`: схлопывание — это движение соседей по экрану. */
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)"

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/** Зазор родителя по оси, который узел занимает рядом с соседом. */
function parentGap(el: HTMLElement, axis: "height" | "width") {
  const parent = el.parentElement
  if (!parent) return 0
  const style = getComputedStyle(parent)
  if (!/flex|grid/.test(style.display)) return 0
  const gap = parseFloat(axis === "height" ? style.rowGap : style.columnGap)
  return Number.isFinite(gap) ? gap : 0
}

function sizeKeyframes(el: HTMLElement, axis: "height" | "width") {
  const style = getComputedStyle(el)
  const vertical = axis === "height"
  const [start, end] = vertical ? ["Top", "Bottom"] : ["Left", "Right"]
  const size = vertical ? el.offsetHeight : el.offsetWidth
  // Зазор съедает тот отступ, со стороны которого есть сосед: обычно
  // следующий, а у последнего в ряду — предыдущий.
  const gap = parentGap(el, axis)
  const eatEnd = gap > 0 && el.nextElementSibling != null
  const eatStart = gap > 0 && !eatEnd && el.previousElementSibling != null
  const prop = (side: string, kind: "padding" | "margin" | "border") =>
    kind === "border" ? `border${side}Width` : `${kind}${side}`
  const from: Record<string, string> = {
    [vertical ? "height" : "width"]: `${size}px`,
    [vertical ? "minHeight" : "minWidth"]: "0px",
  }
  const to: Record<string, string> = {
    [vertical ? "height" : "width"]: "0px",
    [vertical ? "minHeight" : "minWidth"]: "0px",
  }
  // Поперечный размер держится: сжимаясь по ширине, чипс иначе переносил
  // бы подпись по строкам и на полпути вырастал в столбик (замер: 36 → 204).
  const cross = vertical ? "width" : "height"
  from[cross] = to[cross] = `${vertical ? el.offsetWidth : el.offsetHeight}px`
  for (const side of [start, end]) {
    for (const kind of ["padding", "margin", "border"] as const) {
      const key = prop(side, kind)
      from[key] = style[key as keyof CSSStyleDeclaration] as string
      to[key] = "0px"
    }
  }
  const startMargin = parseFloat(from[prop(start, "margin")]) || 0
  const endMargin = parseFloat(from[prop(end, "margin")]) || 0
  if (eatEnd) to[prop(end, "margin")] = `${endMargin - gap}px`
  if (eatStart) to[prop(start, "margin")] = `${startMargin - gap}px`
  return [from, to]
}

function useCollapseExit<T extends HTMLElement>(
  onClose: (() => void) | undefined,
  { axis = "height", lift = false }: CollapseExitOptions = {}
) {
  const ref = React.useRef<T>(null)
  const leaving = React.useRef(false)
  const onCloseRef = React.useRef(onClose)
  onCloseRef.current = onClose

  const exit = React.useCallback(() => {
    const el = ref.current
    const done = () => onCloseRef.current?.()
    if (!el || typeof el.animate !== "function" || prefersReducedMotion()) {
      done()
      return
    }
    if (leaving.current) return
    leaving.current = true

    const prevOverflow = el.style.overflow
    const prevPointer = el.style.pointerEvents
    el.style.overflow = "hidden"
    el.style.pointerEvents = "none"

    const size = el.animate(sizeKeyframes(el, axis), {
      duration: DURATION,
      easing: EASE_IN_OUT,
      fill: "forwards",
    })
    const fade = el.animate(
      [
        { opacity: 1, translate: "0 0" },
        { opacity: 0, translate: lift ? "0 -8px" : "0 0" },
      ],
      // Угасание короче схлопывания: к моменту, когда сосед доезжает,
      // элемента уже не видно, и он не «сминается» на глазах.
      // Кривая — штатный `ease-out`, а не резкий `--ease-out`: тот гасит
      // элемент почти целиком за первые 50 мс, и угасания не видно.
      { duration: DURATION * 0.8, easing: "ease-out", fill: "forwards" }
    )

    size.finished
      .then(() => {
        done()
        // Вызывающий код обычно снимает узел в том же такте. Не снял за два
        // кадра — значит, решил оставить: возвращаем как было.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (!el.isConnected) return
            size.cancel()
            fade.cancel()
            el.style.overflow = prevOverflow
            el.style.pointerEvents = prevPointer
            leaving.current = false
          })
        )
      })
      .catch(() => {
        // Анимацию отменили (узел сняли раньше конца) — звать нечего.
        leaving.current = false
      })
  }, [axis, lift])

  return { ref, exit }
}

export { useCollapseExit }
export type { CollapseExitOptions }
