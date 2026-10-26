/**
 * Наложенная полоса прокрутки области кита (`.themed-scrollbar`, `<Scrollbar>`).
 *
 * Правки UI-Kit от 25.10, «Scrollbar — родные полосы браузера вместо полос
 * кита, полоса занимает место». Вид полосы раньше задавался только через
 * `::-webkit-scrollbar`: в Firefox и при системной настройке «полосы всегда»
 * показывалась родная полоса (толстая, со стрелками, сдвигала содержимое), а
 * полоса кита занимала 4 px ширины, и поля содержимого считались с ней.
 * Теперь у подключённой области (`data-ovs`) родная полоса скрыта
 * (styles/scrollbar.css), а поверх кладётся своя: места не занимает,
 * `offsetWidth − clientWidth` равно одной рамке.
 *
 * Где лежит полоса. Узел полосы — ПЕРВЫЙ ребёнок самой области, но
 * позиционирован относительно её `offsetParent`: у статичной области
 * охватывающий блок абсолютного потомка лежит снаружи, поэтому полоса не
 * едет вместе с содержимым и не обрезается областью, а соседи области
 * (селекторы `шапка + тело`, `тело + подвал` у модалки) остаются соседями.
 * Узел вставляется, только пока есть что прокручивать, — короткие списки
 * с `:only-child` / `:first-child` не задеты. Если область сама
 * позиционирована (или не может иметь детей, как textarea), полоса встаёт
 * перед ней соседом.
 *
 * Положение — у внутреннего края рамки области (там, где была полоса
 * `::-webkit-scrollbar`); отступы дорожки по оси область задаёт
 * переменными `--ovs-start` / `--ovs-end`, поперёк — `--ovs-cross`
 * (отступ от края рамки внутрь, по умолчанию 0).
 */

import { Bar, type Axis } from "./bar"
import { isScrollable, type ScrollMetrics } from "./geometry"
import { effectiveVisibility, VisibilityController, type ScrollbarVisibility } from "./visibility"
import { createWheelHandoffState, decideWheel, wheelDeltaPx } from "./wheel-handoff"
import { findScrollParent, lastScrollOf, scrollElementBy } from "./page-tracking"

export interface OverlayScrollbarOptions {
  /** Когда видна полоса на устройстве с мышью (см. visibility.ts). */
  visibility?: ScrollbarVisibility
  /** Передача колеса странице у края (правило блоков, wheel-handoff.ts). */
  wheelHandoff?: boolean
}

export interface OverlayScrollbarHandle {
  /** Пересчитать сразу (обычно хватает наблюдателей). */
  update(): void
  setOptions(options: OverlayScrollbarOptions): void
  release(): void
}

/** Толщина полосы области: вертикальная 4, горизонтальная 8 (по макету). */
const THICKNESS: Record<Axis, number> = { y: 4, x: 8 }

const CANNOT_HOST = new Set(["TEXTAREA", "INPUT", "SELECT", "IMG", "IFRAME", "VIDEO", "CANVAS"])

const HOVER_ROOT = '[data-ovs-hover], [data-slot="card-box"]'

const controllers = new WeakMap<HTMLElement, AreaController>()

function px(style: CSSStyleDeclaration, name: string) {
  return parseFloat(style.getPropertyValue(name)) || 0
}

function scrollsOn(value: string) {
  return value === "auto" || value === "scroll" || value === "overlay"
}

class AreaController {
  refs = 0
  private options: Required<OverlayScrollbarOptions> = { visibility: "always", wheelHandoff: false }
  private readonly bars: Partial<Record<Axis, Bar>> = {}
  private readonly visibility: VisibilityController
  private readonly resize: ResizeObserver | null
  private readonly mutations: MutationObserver | null
  private readonly wheel = createWheelHandoffState()
  private frame = 0
  private lastMove = -Infinity
  private readonly area: HTMLElement
  private readonly hoverRoot: HTMLElement

  constructor(area: HTMLElement) {
    this.area = area
    area.setAttribute("data-ovs", "")
    this.visibility = new VisibilityController((visible) => {
      for (const bar of Object.values(this.bars)) bar?.el.toggleAttribute("data-visible", visible)
    })
    area.addEventListener("scroll", this.onScroll, { passive: true })
    // «Наведение на блок» — на всю карточку, а не только на окно прокрутки:
    // ближайший предок с `data-ovs-hover` или блок CardBox.
    this.hoverRoot = (area.closest(HOVER_ROOT) as HTMLElement | null) ?? area
    this.hoverRoot.addEventListener("pointerenter", this.onEnter)
    this.hoverRoot.addEventListener("pointerleave", this.onLeave)
    area.addEventListener("wheel", this.onWheel, { passive: false })
    window.addEventListener("resize", this.schedule)

    this.resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(this.schedule)
    this.observeSizes()
    this.mutations =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver((records) => {
            const own = records.every(
              (record) =>
                record.type === "childList" &&
                [...record.addedNodes, ...record.removedNodes].every(
                  (node) => node instanceof HTMLElement && node.dataset.ovsBar !== undefined
                )
            )
            if (own) return
            this.observeSizes()
            this.schedule()
          })
    this.mutations?.observe(area, { childList: true, attributes: true, attributeFilter: ["class", "style"] })
    this.layout()
  }

  setOptions(options: OverlayScrollbarOptions) {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) Object.assign(this.options, { [key]: value })
    }
    this.layout()
  }

  destroy() {
    cancelAnimationFrame(this.frame)
    this.resize?.disconnect()
    this.mutations?.disconnect()
    this.visibility.destroy()
    for (const bar of Object.values(this.bars)) bar?.destroy()
    const { area } = this
    area.removeAttribute("data-ovs")
    area.removeEventListener("scroll", this.onScroll)
    this.hoverRoot.removeEventListener("pointerenter", this.onEnter)
    this.hoverRoot.removeEventListener("pointerleave", this.onLeave)
    area.removeEventListener("wheel", this.onWheel)
    window.removeEventListener("resize", this.schedule)
  }

  /** Размер области, её родителя (сдвиг области внутри него) и детей. */
  private observeSizes() {
    const observer = this.resize
    if (!observer) return
    observer.disconnect()
    observer.observe(this.area)
    if (this.area.parentElement) observer.observe(this.area.parentElement)
    for (const child of this.area.children) {
      if (!(child as HTMLElement).dataset?.ovsBar) observer.observe(child)
    }
  }

  schedule = () => {
    if (this.frame) return
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb: () => void) => setTimeout(cb, 16) as unknown as number
    this.frame = raf(() => {
      this.frame = 0
      this.layout()
    })
  }

  private metrics(axis: Axis): ScrollMetrics {
    const { area } = this
    return axis === "y"
      ? { client: area.clientHeight, scroll: area.scrollHeight, position: area.scrollTop }
      : { client: area.clientWidth, scroll: area.scrollWidth, position: area.scrollLeft }
  }

  private bar(axis: Axis): Bar {
    let bar = this.bars[axis]
    if (!bar) {
      bar = new Bar(
        {
          axis,
          metrics: () => this.metrics(axis),
          scrollTo: (position) => {
            if (axis === "y") this.area.scrollTop = position
            else this.area.scrollLeft = position
          },
          onDragChange: (dragging) => this.visibility.set({ dragging }),
        },
        "area"
      )
      bar.el.toggleAttribute("data-visible", this.visibility.visible)
      bar.el.addEventListener("pointerenter", this.onEnter)
      bar.el.addEventListener("pointerleave", this.onLeave)
      this.bars[axis] = bar
    }
    return bar
  }

  layout() {
    const { area } = this
    if (!area.isConnected) return
    const style = getComputedStyle(area)
    // Потребитель сам спрятал полосу (`[scrollbar-width:none]`, как у
    // Notification с `showScrollBar={false}`) — своей тоже не рисуем.
    const suppressed = /scrollbar-width:none/.test(area.className)
    const want: Record<Axis, boolean> = {
      y: !suppressed && scrollsOn(style.overflowY) && isScrollable(this.metrics("y")),
      x: !suppressed && scrollsOn(style.overflowX) && isScrollable(this.metrics("x")),
    }
    const inside = this.canHostInside(style)
    for (const axis of ["y", "x"] as const) {
      if (!want[axis]) {
        this.bars[axis]?.el.remove()
        continue
      }
      const bar = this.bar(axis)
      this.place(bar.el, inside)
      this.position(bar, axis, style, want)
      bar.sync()
    }
    this.visibility.set({
      mode: effectiveVisibility(this.options.visibility, area),
      scrollable: want.x || want.y,
    })
  }

  private canHostInside(style: CSSStyleDeclaration) {
    if (CANNOT_HOST.has(this.area.tagName)) return false
    if (style.position && style.position !== "static") return false
    if (style.transform && style.transform !== "none") return false
    return !/paint|layout|strict|content/.test(style.contain || "")
  }

  private place(el: HTMLElement, inside: boolean) {
    const { area } = this
    if (inside) {
      if (el.parentNode !== area) area.insertBefore(el, area.firstChild)
    } else if (el.parentNode !== area.parentNode) {
      area.parentNode?.insertBefore(el, area)
    }
  }

  private position(bar: Bar, axis: Axis, style: CSSStyleDeclaration, want: Record<Axis, boolean>) {
    const { area } = this
    const el = bar.el
    let ox: number
    let oy: number
    if (el.offsetParent && el.offsetParent === area.offsetParent) {
      ox = area.offsetLeft + area.clientLeft
      oy = area.offsetTop + area.clientTop
    } else {
      // Запасной путь (область `position: fixed` и т. п.): по прямоугольникам.
      const block = (el.offsetParent as HTMLElement | null) ?? document.documentElement
      const a = area.getBoundingClientRect()
      const b = block.getBoundingClientRect()
      ox = a.left + area.clientLeft - b.left - block.clientLeft + block.scrollLeft
      oy = a.top + area.clientTop - b.top - block.clientTop + block.scrollTop
    }
    const start = px(style, "--ovs-start")
    // Вторая полоса в углу: дорожки не пересекаются.
    const end = px(style, "--ovs-end") + (want[axis === "y" ? "x" : "y"] ? THICKNESS[axis === "y" ? "x" : "y"] : 0)
    const cross = px(style, "--ovs-cross")
    const thickness = THICKNESS[axis]
    const s = el.style
    if (axis === "y") {
      const length = area.clientHeight - start - end
      s.left = `${ox + area.clientWidth - thickness - cross}px`
      s.top = `${oy + start}px`
      s.height = `${Math.max(0, length)}px`
      s.width = ""
      bar.setTrack(length)
    } else {
      const length = area.clientWidth - start - end
      s.left = `${ox + start}px`
      s.top = `${oy + area.clientHeight - thickness - cross}px`
      s.width = `${Math.max(0, length)}px`
      s.height = ""
      bar.setTrack(length)
    }
  }

  private onScroll = () => {
    this.lastMove = Date.now()
    this.visibility.activity()
    for (const bar of Object.values(this.bars)) if (bar?.el.isConnected) bar.sync()
  }

  private onEnter = (event: PointerEvent) => {
    if (event.pointerType !== "touch") this.visibility.set({ hovered: true })
  }

  private onLeave = (event: PointerEvent) => {
    const next = event.relatedTarget as Node | null
    if (next && (this.hoverRoot.contains(next) || Object.values(this.bars).some((bar) => bar?.el.contains(next)))) return
    this.visibility.set({ hovered: false })
  }

  private onWheel = (event: WheelEvent) => {
    if (!this.options.wheelHandoff || event.defaultPrevented) return
    if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    if (typeof window.matchMedia === "function" && !window.matchMedia("(hover: hover)").matches) return
    const { area } = this
    const delta = wheelDeltaPx(event, area.clientHeight)
    if (!delta || this.nestedTakes(event.target, delta)) return
    const page = findScrollParent(area)
    const decision = decideWheel(this.wheel, {
      now: Date.now(),
      delta,
      position: area.scrollTop,
      client: area.clientHeight,
      scroll: area.scrollHeight,
      lastBlockMove: this.lastMove,
      lastPageMove: lastScrollOf(page),
    })
    if (decision === "native") return
    event.preventDefault()
    if (decision === "block") area.scrollTop += delta
    else if (decision === "page") scrollElementBy(page, delta)
  }

  /** Колесо над вложенной областью, которой есть куда ехать, — её дело. */
  private nestedTakes(target: EventTarget | null, delta: number) {
    for (let node = target instanceof Element ? target : null; node && node !== this.area; node = node.parentElement) {
      if (node.scrollHeight - node.clientHeight <= 1) continue
      if (!scrollsOn(getComputedStyle(node).overflowY)) continue
      const max = node.scrollHeight - node.clientHeight
      if (delta > 0 ? node.scrollTop < max - 1 : node.scrollTop > 1) return true
    }
    return false
  }
}

/**
 * Подключить наложенную полосу к области. Повторный вызов для той же
 * области возвращает ту же полосу (счётчик ссылок), переданные параметры
 * дописываются. Снимается, когда отпущены все ссылки.
 */
export function attachOverlayScrollbar(
  area: HTMLElement,
  options: OverlayScrollbarOptions = {}
): OverlayScrollbarHandle {
  let controller = controllers.get(area)
  if (!controller) {
    controller = new AreaController(area)
    controllers.set(area, controller)
  }
  controller.refs += 1
  if (Object.keys(options).length) controller.setOptions(options)
  let released = false
  const current = controller
  return {
    update: () => current.layout(),
    setOptions: (next) => current.setOptions(next),
    release: () => {
      if (released) return
      released = true
      current.refs -= 1
      if (current.refs > 0) return
      current.destroy()
      controllers.delete(area)
    },
  }
}

/** Есть ли у области полоса (для автоподключения). */
export function hasOverlayScrollbar(area: HTMLElement) {
  return controllers.has(area)
}
