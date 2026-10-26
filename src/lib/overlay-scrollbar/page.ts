/**
 * Полоса прокрутки всей страницы — Правки UI-Kit от 25.10, «Scrollbar —
 * родные полосы браузера вместо полос кита»: тонкая, поверх страницы, 4 px
 * от правого края и по 4 сверху и снизу; только бегунок, без дорожки
 * (дорожка цвета фона закрывала край содержимого у кромки — например,
 * выглядывающий соседний баннер карусели). Горизонтальная — 4 px от низа,
 * если страница шире окна.
 *
 * Родная полоса страницы прячется атрибутом `data-page-scrollbar` на
 * `<html>` (правило в styles/rules-scroll.css) — только пока полоса кита
 * смонтирована, чтобы страница без неё не осталась совсем без полосы.
 */

import { Bar, type Axis } from "./bar"
import { isScrollable, type ScrollMetrics } from "./geometry"
import { effectiveVisibility, VisibilityController, type ScrollbarVisibility } from "./visibility"

/** Отступ полосы страницы от краёв окна. */
const EDGE = 4

function page(): Element {
  return document.scrollingElement ?? document.documentElement
}

function metrics(axis: Axis): ScrollMetrics {
  const root = page()
  const html = document.documentElement
  return axis === "y"
    ? { client: html.clientHeight, scroll: root.scrollHeight, position: root.scrollTop }
    : { client: html.clientWidth, scroll: root.scrollWidth, position: root.scrollLeft }
}

/** Страницу заперли (модалка, раскрытое меню) — листать нечего. */
function locked() {
  const hidden = (el: Element) => {
    const { overflowY } = getComputedStyle(el)
    return overflowY === "hidden" || overflowY === "clip"
  }
  return hidden(document.documentElement) || hidden(document.body)
}

export interface PageScrollbarHandle {
  update(): void
  setVisibility(mode: ScrollbarVisibility): void
  release(): void
}

/** Смонтировать полосу страницы в `container` (узел в `<body>`). */
export function attachPageScrollbar(
  container: HTMLElement,
  initial: ScrollbarVisibility = "always"
): PageScrollbarHandle {
  let mode = initial
  const html = document.documentElement
  html.setAttribute("data-page-scrollbar", "")

  const bars = {} as Record<Axis, Bar>
  const visibility = new VisibilityController((visible) => {
    for (const bar of Object.values(bars)) bar.el.toggleAttribute("data-visible", visible)
  })
  for (const axis of ["y", "x"] as const) {
    bars[axis] = new Bar(
      {
        axis,
        metrics: () => metrics(axis),
        scrollTo: (position) =>
          window.scrollTo(axis === "y" ? { top: position } : { left: position }),
        onDragChange: (dragging) => visibility.set({ dragging }),
      },
      "page"
    )
    container.appendChild(bars[axis].el)
  }

  const layout = () => {
    const free = !locked()
    const want = {
      y: free && isScrollable(metrics("y")),
      x: free && isScrollable(metrics("x")),
    }
    const { y, x } = bars
    const height = html.clientHeight - EDGE * 2 - (want.x ? EDGE + 4 : 0)
    const width = html.clientWidth - EDGE * 2 - (want.y ? EDGE + 4 : 0)
    Object.assign(y.el.style, { top: `${EDGE}px`, right: `${EDGE}px`, height: `${Math.max(0, height)}px` })
    Object.assign(x.el.style, { left: `${EDGE}px`, bottom: `${EDGE}px`, width: `${Math.max(0, width)}px` })
    y.setTrack(height)
    x.setTrack(width)
    y.el.hidden = !want.y
    x.el.hidden = !want.x
    y.sync()
    x.sync()
    visibility.set({ mode: effectiveVisibility(mode, html), scrollable: want.x || want.y })
  }

  let frame = 0
  const schedule = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      layout()
    })
  }
  const onScroll = () => {
    visibility.activity()
    bars.y.sync()
    bars.x.sync()
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", schedule)
  const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule)
  resize?.observe(document.body)
  resize?.observe(html)
  // Замок прокрутки ставится атрибутом на `<html>` или стилем `<body>`.
  const mutations =
    typeof MutationObserver === "undefined" ? null : new MutationObserver(schedule)
  mutations?.observe(html, { attributes: true })
  mutations?.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] })
  layout()

  return {
    update: layout,
    setVisibility(next) {
      mode = next
      layout()
    },
    release() {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", schedule)
      resize?.disconnect()
      mutations?.disconnect()
      visibility.destroy()
      bars.y.destroy()
      bars.x.destroy()
      html.removeAttribute("data-page-scrollbar")
    },
  }
}
