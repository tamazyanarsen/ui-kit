import * as React from "react"

import { useLatest } from "@/lib/use-latest"

/**
 * Мобильная штора, которой не хватает высоты, — на весь экран (вариант
 * «Size=Mobile, Type=Large Modal»).
 *
 * Правки UI-Kit от 25.10, «Modal, мобильный вид — переход в полноэкранный
 * вариант»: пока естественная высота шторы (шапка + всё содержимое тела +
 * кнопки) помещается в 87% высоты экрана — прежняя штора снизу со
 * скруглением 24. Больше — окно встаёт на весь вьюпорт: от верха, `100dvh`,
 * без скруглений, листается только тело.
 *
 * ⚠️ Решение — по ЕСТЕСТВЕННОЙ высоте, а не по текущей. Текущая у шторы
 * обрезана своим `max-height`, у полноэкранного окна — растянута на весь
 * экран; решая по ней, вид мигал бы на границе. Поэтому прокручиваемая
 * часть меряется высотой своего содержимого (диапазон по всем её узлам плюс
 * поля), а не коробкой. У подвала в полноэкранном виде поле сверху 8 вместо
 * 20 — разница прибавляется обратно, иначе окно на границе прыгало бы туда и
 * обратно на эти 12.
 *
 * Признак варианта — атрибут `data-full` на корне окна. Ставится прямо в
 * DOM, без перерисовки React: пересчёт идёт из `ResizeObserver` /
 * `MutationObserver` до отрисовки кадра, и вид не успевает мигнуть.
 */

/** Доля высоты экрана, после которой штора уходит на весь экран. */
const SHEET_MAX_SHARE = 0.87
/** Поле подвала над кнопками: 20 у шторы минус 8 на весь экран. */
const FOOTER_FULL_DELTA = 12

/** Прокручиваемая часть: сам узел или окно прокрутки внутри него. */
function findScroller(part: HTMLElement): HTMLElement | null {
  if (part.hasAttribute("data-scroll-window")) return part
  const overflow = getComputedStyle(part).overflowY
  if (overflow === "auto" || overflow === "scroll") return part
  return part.querySelector<HTMLElement>("[data-scroll-window]")
}

/** Высота содержимого прокручиваемого узла, независимо от его коробки. */
function contentHeight(scroller: HTMLElement): number {
  const style = getComputedStyle(scroller)
  const padding =
    (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0)
  if (typeof document.createRange === "function") {
    const range = document.createRange()
    range.selectNodeContents(scroller)
    if (typeof range.getBoundingClientRect === "function") {
      const rect = range.getBoundingClientRect()
      if (rect.height > 0) return rect.height + padding
    }
  }
  return scroller.scrollHeight
}

/** Естественная высота окна в виде шторы. */
function naturalHeight(frame: HTMLElement, full: boolean): number {
  let total = 0
  for (const part of Array.from(frame.children) as HTMLElement[]) {
    const scroller = findScroller(part)
    if (!scroller) {
      total += part.offsetHeight
      if (full && part.dataset.slot === "modal-footer") total += FOOTER_FULL_DELTA
      continue
    }
    total += part.offsetHeight - scroller.clientHeight + contentHeight(scroller)
  }
  return total
}

interface FullScreenOptions {
  /** Мерить и переключать (мобильный вид и вид не задан пропом). */
  enabled: boolean
  /** Вызывается при каждой смене вида — до отрисовки кадра. */
  onSwitch?: () => void
}

function useFullScreen(
  popup: HTMLElement | null,
  { enabled, onSwitch }: FullScreenOptions
) {
  const onSwitchRef = useLatest(onSwitch)

  React.useLayoutEffect(() => {
    if (!popup || !enabled) return
    const frame = popup.firstElementChild as HTMLElement | null
    if (!frame) return

    const update = () => {
      const full = popup.hasAttribute("data-full")
      const next = naturalHeight(frame, full) > window.innerHeight * SHEET_MAX_SHARE
      if (next === full) return
      if (next) popup.setAttribute("data-full", "")
      else popup.removeAttribute("data-full")
      onSwitchRef.current?.()
    }

    // Наблюдаются окно, его части и содержимое прокручиваемых частей: смена
    // содержимого тела не меняет коробку тела (она обрезана), а меняет
    // только его детей.
    const sizes = new ResizeObserver(update)
    const observeAll = () => {
      sizes.disconnect()
      sizes.observe(popup)
      for (const part of Array.from(frame.children)) {
        sizes.observe(part)
        const scroller = findScroller(part as HTMLElement)
        if (scroller) for (const child of Array.from(scroller.children)) sizes.observe(child)
      }
    }
    observeAll()
    const mutations =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            observeAll()
            update()
          })
    mutations?.observe(frame, { childList: true, subtree: true, characterData: true })
    window.addEventListener("resize", update)
    update()

    return () => {
      sizes.disconnect()
      mutations?.disconnect()
      window.removeEventListener("resize", update)
      // Вид снимается вместе с наблюдением: на десктопе (или когда вид задан
      // пропом) признак от прежнего замера не должен оставаться.
      if (popup.hasAttribute("data-full") && !popup.hasAttribute("data-full-forced")) {
        popup.removeAttribute("data-full")
      }
    }
  }, [popup, enabled, onSwitchRef])
}

export { useFullScreen, naturalHeight, SHEET_MAX_SHARE }
