/**
 * Когда наложенная полоса видна — Правки UI-Kit от 25.10, пункты «Scrollbar
 * — родные полосы браузера вместо полос кита» и «Scrollbar — видимость
 * полосы и передача прокрутки странице».
 *
 *   • `always` — всегда, когда есть что прокручивать (страница, модалки,
 *     списки на устройстве с мышью);
 *   • `hover` — при наведении на блок и во время прокрутки (блоки);
 *   • `scroll` — только во время прокрутки или перетаскивания бегунка. Так
 *     ведут себя ВСЕ полосы в мобильном виде (уже 1280) и на тач-устройствах
 *     (`hover: none`), какой бы режим ни был задан.
 *
 * «Во время прокрутки» длится ещё 800 мс после последнего события scroll.
 * Сами длительности появления (150) и угасания (400) — переход `opacity` в
 * styles/scrollbar.css; здесь только признак «видна».
 */

import { DESKTOP_QUERY } from "../use-is-desktop"

export type ScrollbarVisibility = "always" | "hover" | "scroll"

/** Пауза после остановки прокрутки, после которой полоса гаснет. */
export const IDLE_HIDE_MS = 800

interface VisibilityState {
  mode: ScrollbarVisibility
  scrollable: boolean
  hovered: boolean
  dragging: boolean
  scrolling: boolean
}

export class VisibilityController {
  private state: VisibilityState = {
    mode: "always",
    scrollable: false,
    hovered: false,
    dragging: false,
    scrolling: false,
  }
  private timer: ReturnType<typeof setTimeout> | undefined
  private last: boolean | undefined
  private readonly onChange: (visible: boolean) => void

  constructor(onChange: (visible: boolean) => void) {
    this.onChange = onChange
  }

  get visible(): boolean {
    const { mode, scrollable, hovered, dragging, scrolling } = this.state
    if (!scrollable) return false
    if (dragging || scrolling) return true
    if (mode === "always") return true
    return mode === "hover" && hovered
  }

  set(partial: Partial<Omit<VisibilityState, "scrolling">>) {
    Object.assign(this.state, partial)
    // Отпустили бегунок — полоса гаснет так же, как после прокрутки.
    if (partial.dragging === false) this.activity()
    else this.emit()
  }

  /** Было событие прокрутки: полоса видна ещё 800 мс после последнего. */
  activity() {
    this.state.scrolling = true
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.state.scrolling = false
      this.emit()
    }, IDLE_HIDE_MS)
    this.emit()
  }

  destroy() {
    clearTimeout(this.timer)
  }

  private emit() {
    const visible = this.visible
    if (visible === this.last) return
    this.last = visible
    this.onChange(visible)
  }
}

/**
 * Режим, который действует на самом деле. Мобильный вид — по атрибуту
 * `data-viewport` ближайшего предка (ViewportScope, портал с
 * `useViewportAttr`), иначе по ширине окна; тач — по `(hover: none)`.
 */
export function effectiveVisibility(
  mode: ScrollbarVisibility,
  element: Element | null
): ScrollbarVisibility {
  if (mode === "scroll") return mode
  if (!isFinePointerDesktop(element)) return "scroll"
  return mode
}

export function isFinePointerDesktop(element: Element | null): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true
  const forced = element?.closest("[data-viewport]")?.getAttribute("data-viewport")
  const desktop =
    forced === "desktop" || forced === "mobile"
      ? forced === "desktop"
      : window.matchMedia(DESKTOP_QUERY).matches
  if (!desktop) return false
  return !window.matchMedia("(hover: none)").matches
}
