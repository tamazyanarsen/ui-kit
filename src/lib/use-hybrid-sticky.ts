import * as React from "react"

// Гибридное закрепление колонки — дизайн-чек от 08.10, замечания 32 и 34.
//
// Колонка закрепляется сверху ИЛИ снизу — в зависимости от направления
// прокрутки и того, помещается ли она в окно. Отступ от края окна в обоих
// случаях 40 px.
//
//   inset  — занятый верх вьюпорта (шапка, верхнее сообщение),
//            `--viewport-inset-top`, по умолчанию 0;
//   minTop = inset + 40 — отступ при закреплении к верху;
//   vh     — высота окна, h — текущая высота колонки.
//
//   А. Колонка помещается (h ≤ vh − minTop − 40): всегда прибита к верху,
//      top = minTop, направление прокрутки не учитывается.
//   Б. Колонка выше окна: на каждый кадр прокрутки
//        top = clamp(prevTop − dy, vh − 40 − h, minTop),
//      dy — сдвиг прокрутки с прошлого кадра (вниз — положительный),
//      начальное prevTop = minTop. Вниз — колонка едет вместе со страницей, пока низ
//      не встанет в 40 px от низа окна; вверх — пока верх не дойдёт до
//      minTop; при смене направления она не прыгает, а начинает ехать от
//      того места, где остановилась.
//
// Реализация по замечанию: обёртка `position: sticky`, `top` — из скрипта.
// Пересчёт — на `scroll` (passive), `resize` и `ResizeObserver` обёртки
// (высота колонки меняется сама: свёрнутые «Рекомендации», переключение
// вкладок, листание карусели). Прокрутка меняет ТОЛЬКО `top` одного узла —
// разметка не трогается.
//
// `inset` входит только в верхний отступ: нижний остаётся 40 px.
//
// Слой: `--z-sticky`, а пока внутри колонки открыто меню (`data-popup-open`
// у триггера Base UI) или задан `raised`, — на 1 выше, чтобы меню соседней
// колонки не пряталось под этой. Правило — в styles/base.css.
//
// ⚠️ Колонка-родитель обязана быть растянута на высоту ряда: `sticky`
// ограничен коробкой родителя (см. `SandboxColumns`, `desktop:self-stretch`).

/** Отступ от края окна при закреплении — и сверху, и снизу. */
const HYBRID_STICKY_GAP = 40

interface HybridStickyOptions {
  /** Выключено — узел возвращается в поток, стили снимаются. */
  enabled?: boolean
  /** Поднять слой на 1 над `--z-sticky` (например, открыто меню «Ещё»). */
  raised?: boolean
}

function readInsetTop() {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    "--viewport-inset-top"
  )
  return Number.parseFloat(value) || 0
}

/**
 * Следующее значение `top` по формуле замечания. Чистая функция — её
 * проверяют тесты.
 */
function nextHybridTop({
  prevTop,
  dy,
  height,
  viewport,
  inset,
}: {
  prevTop: number
  dy: number
  height: number
  viewport: number
  inset: number
}) {
  const minTop = inset + HYBRID_STICKY_GAP
  // Случай А: колонка помещается целиком.
  if (height <= viewport - minTop - HYBRID_STICKY_GAP) return minTop
  // Случай Б: высокая колонка.
  const lowest = viewport - HYBRID_STICKY_GAP - height
  return Math.min(minTop, Math.max(lowest, prevTop - dy))
}

/**
 * Гибридное закрепление узла из `ref` (см. описание файла).
 */
function useHybridSticky(
  ref: React.RefObject<HTMLElement | null>,
  { enabled = true, raised = false }: HybridStickyOptions = {}
) {
  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    let prevTop = readInsetTop() + HYBRID_STICKY_GAP
    let lastScroll = window.scrollY

    const update = (dy: number) => {
      // `clientHeight` корня, а не `innerHeight`: последний включает
      // толщину горизонтальной полосы прокрутки страницы, и нижний отступ
      // выходил бы на 15 px меньше.
      const viewport = document.documentElement.clientHeight
      const next = nextHybridTop({
        prevTop,
        dy,
        height: element.offsetHeight,
        viewport,
        inset: readInsetTop(),
      })
      if (next !== prevTop || !element.style.top) {
        prevTop = next
        element.style.top = `${next}px`
      }
    }

    const onScroll = () => {
      const current = window.scrollY
      const dy = current - lastScroll
      lastScroll = current
      update(dy)
    }
    const onResize = () => update(0)

    element.setAttribute("data-hybrid-sticky", "")
    update(0)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    const observer = new ResizeObserver(onResize)
    observer.observe(element)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      observer.disconnect()
      element.removeAttribute("data-hybrid-sticky")
      element.style.removeProperty("top")
    }
  }, [ref, enabled])

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    if (enabled && raised) element.setAttribute("data-raised", "")
    else element.removeAttribute("data-raised")
  }, [ref, enabled, raised])
}

export { HYBRID_STICKY_GAP, nextHybridTop, useHybridSticky }
export type { HybridStickyOptions }
