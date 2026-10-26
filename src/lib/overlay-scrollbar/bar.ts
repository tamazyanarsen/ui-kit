/**
 * Одна наложенная полоса (дорожка + бегунок) по одной оси — общая часть
 * полосы области (`attach.ts`) и полосы страницы (`PageScrollbar`).
 *
 * Правки UI-Kit от 25.10, «Scrollbar — родные полосы браузера вместо полос
 * кита»: бегунок перетаскивается (зона захвата шире полосы на 6 px с каждой
 * стороны — псевдоэлемент `::before` в styles/scrollbar.css), нажатие на
 * дорожку листает на 90 % видимой высоты в сторону нажатия, колесо над
 * полосой прокручивает её область.
 *
 * Полоса ничего не знает о том, где стоит: положение и длину дорожки задаёт
 * хозяин, полоса только двигает бегунок и обрабатывает указатель.
 */

import {
  computeThumb,
  dragDelta,
  trackClickTarget,
  type ScrollMetrics,
  type ThumbGeometry,
} from "./geometry"
import { wheelDeltaPx } from "./wheel-handoff"

export type Axis = "x" | "y"

export interface BarHost {
  axis: Axis
  metrics(): ScrollMetrics
  scrollTo(position: number): void
  onDragChange(dragging: boolean): void
}

export class Bar {
  readonly el: HTMLDivElement
  readonly thumb: HTMLDivElement
  private track = 0
  private geometry: ThumbGeometry = { scrollable: false, size: 0, offset: 0 }
  private drag: { pointer: number; start: number; id: number } | null = null
  private readonly host: BarHost

  constructor(host: BarHost, kind: "area" | "page") {
    this.host = host
    const el = document.createElement("div")
    el.className = "kit-ovs"
    el.setAttribute("aria-hidden", "true")
    el.dataset.ovsBar = host.axis
    el.dataset.kind = kind
    const thumb = document.createElement("div")
    thumb.className = "kit-ovs-thumb"
    el.appendChild(thumb)
    this.el = el
    this.thumb = thumb

    el.addEventListener("pointerdown", this.onPointerDown)
    el.addEventListener("pointermove", this.onPointerMove)
    el.addEventListener("pointerup", this.onPointerUp)
    el.addEventListener("pointercancel", this.onPointerUp)
    el.addEventListener("lostpointercapture", this.onPointerUp)
    el.addEventListener("wheel", this.onWheel, { passive: false })
  }

  get dragging() {
    return this.drag !== null
  }

  /** Длина дорожки по оси — её задаёт хозяин после расстановки. */
  setTrack(length: number) {
    this.track = Math.max(0, length)
  }

  /** Пересчитать бегунок по текущей прокрутке. Возвращает «есть что листать». */
  sync(): boolean {
    this.geometry = computeThumb(this.host.metrics(), this.track)
    const { size, offset } = this.geometry
    const vertical = this.host.axis === "y"
    this.thumb.style[vertical ? "height" : "width"] = `${size}px`
    this.thumb.style.transform = vertical
      ? `translate3d(0, ${offset}px, 0)`
      : `translate3d(${offset}px, 0, 0)`
    return this.geometry.scrollable
  }

  destroy() {
    this.el.remove()
  }

  /** Координата указателя вдоль дорожки, от её начала. */
  private pointAlong(event: PointerEvent) {
    const rect = this.el.getBoundingClientRect()
    return this.host.axis === "y" ? event.clientY - rect.top : event.clientX - rect.left
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || !this.geometry.scrollable) return
    // Без отмены нажатие выделяло бы текст под полосой и уводило фокус.
    event.preventDefault()
    event.stopPropagation()
    const point = this.pointAlong(event)
    const { offset, size } = this.geometry
    const metrics = this.host.metrics()
    if (point >= offset && point <= offset + size) {
      this.drag = { pointer: point, start: metrics.position, id: event.pointerId }
      this.el.setPointerCapture?.(event.pointerId)
      this.el.dataset.dragging = ""
      this.host.onDragChange(true)
      return
    }
    this.host.scrollTo(trackClickTarget(metrics, this.geometry, point))
  }

  private onPointerMove = (event: PointerEvent) => {
    if (!this.drag || event.pointerId !== this.drag.id) return
    const delta = this.pointAlong(event) - this.drag.pointer
    const metrics = this.host.metrics()
    this.host.scrollTo(this.drag.start + dragDelta(delta, metrics, this.track, this.geometry.size))
  }

  private onPointerUp = (event: PointerEvent) => {
    if (!this.drag || event.pointerId !== this.drag.id) return
    this.drag = null
    delete this.el.dataset.dragging
    if (this.el.hasPointerCapture?.(event.pointerId)) this.el.releasePointerCapture(event.pointerId)
    this.host.onDragChange(false)
  }

  // Полоса лежит вне цепочки прокрутки своей области (её охватывающий блок —
  // снаружи, иначе она ехала бы вместе с содержимым), и родное колесо над ней
  // листало бы страницу. Поэтому колесо над полосой переводится в её область.
  private onWheel = (event: WheelEvent) => {
    if (event.ctrlKey) return
    const metrics = this.host.metrics()
    if (metrics.scroll - metrics.client <= 1) return
    const raw = this.host.axis === "y" ? wheelDeltaPx(event, metrics.client) : event.deltaX || event.deltaY
    if (!raw) return
    event.preventDefault()
    event.stopPropagation()
    this.host.scrollTo(metrics.position + raw)
  }
}
