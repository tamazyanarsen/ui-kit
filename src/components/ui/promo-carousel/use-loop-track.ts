import * as React from "react"

// useLoopTrack — зацикленная лента поверх НАТИВНОЙ прокрутки. Правки UI-Kit
// от 25.10, правило каркаса «Механики свайпов в мобильном виде»: одна
// механика для всех лент «по одному объекту» с кругом (баннеры, проекты).
//
//   • лента — обычный `overflow-x: auto` со `scroll-snap-type: x mandatory`,
//     у объекта `scroll-snap-align: start` и `scroll-snap-stop: always`:
//     идёт за пальцем и трекпадом, один жест — один шаг, своих обработчиков
//     жестов нет;
//   • по краям — копии крайних объектов (слева последние, справа первые; по
//     столько, сколько объектов в кадре), лента стартует на первом
//     настоящем;
//   • когда прокрутка остановилась (`scrollend`; где его нет — 150 мс без
//     событий прокрутки) на копии, лента мгновенно, без анимации,
//     переставляется на тот же объект в настоящем наборе — вид не меняется;
//   • переход к объекту (точка, стрелка) — кратчайшим путём по кругу.
//
// Копии рисует потребитель (см. `loopSlides`) и обязан сделать их
// недоступными для фокуса и диктора (`inert`, `aria-hidden`).
//
// Шаг ленты меряется по самим объектам (`offsetLeft` второго минус первого),
// поэтому зазор между объектами и их ширина — забота вёрстки, а не хука.

const SETTLE_FALLBACK_MS = 150

interface LoopTrackOptions {
  /** Число настоящих объектов. */
  count: number
  /** Объектов в кадре — столько копий кладётся с каждого края. */
  perView?: number
  /**
   * Зацикливать. По умолчанию — когда объектов больше, чем помещается в
   * кадр (иначе листать нечего: ни копий, ни перескоков).
   */
  loop?: boolean
}

interface LoopTrack {
  /** Текущий настоящий объект, с нуля. */
  index: number
  /** Копий с каждого края (0 — лента не зациклена). */
  clones: number
  /** Листать к объекту кратчайшим путём по кругу. */
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  /** Обработчик `onScroll` ленты. */
  onScroll: () => void
}

interface LoopSlide<T> {
  item: T
  /** Индекс настоящего объекта, который показывает слот. */
  index: number
  clone: boolean
  key: string
}

/** Слоты ленты: копии последних, настоящие, копии первых. */
function loopSlides<T>(items: T[], clones: number): LoopSlide<T>[] {
  const count = items.length
  const n = Math.min(clones, count)
  const head = items.slice(count - n).map((item, i) => ({
    item,
    index: count - n + i,
    clone: true,
    key: `clone-head-${i}`,
  }))
  const real = items.map((item, index) => ({
    item,
    index,
    clone: false,
    key: `real-${index}`,
  }))
  const tail = items.slice(0, n).map((item, index) => ({
    item,
    index,
    clone: true,
    key: `clone-tail-${index}`,
  }))
  return [...head, ...real, ...tail]
}

const mod = (value: number, base: number) => ((value % base) + base) % base

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function measureStep(track: HTMLElement) {
  const first = track.children[0] as HTMLElement | undefined
  const second = track.children[1] as HTMLElement | undefined
  if (!first || !second) return 0
  return second.offsetLeft - first.offsetLeft
}

function useLoopTrack(
  trackRef: React.RefObject<HTMLElement | null>,
  { count, perView = 1, loop }: LoopTrackOptions
): LoopTrack {
  const looping = (loop ?? count > perView) && count > 1
  const clones = looping ? Math.max(1, Math.floor(perView)) : 0
  const [index, setIndex] = React.useState(0)
  const indexRef = React.useRef(0)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const commit = React.useCallback((next: number) => {
    indexRef.current = next
    setIndex(next)
  }, [])

  const place = React.useCallback(
    (slot: number, behavior: ScrollBehavior = "auto") => {
      const track = trackRef.current
      if (!track) return
      const left = slot * measureStep(track)
      if (behavior === "auto") track.scrollLeft = left
      else track.scrollTo({ left, behavior })
    },
    [trackRef]
  )

  // Набор сократился — текущий объект мог пропасть.
  React.useEffect(() => {
    if (count > 0 && indexRef.current >= count) commit(0)
  }, [count, commit])

  // Старт на текущем настоящем объекте и выравнивание после смены размера:
  // шаг в пикселях меняется вместе с шириной кадра.
  React.useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || count === 0) return
    place(indexRef.current + clones)
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => place(indexRef.current + clones))
    observer.observe(track)
    return () => observer.disconnect()
  }, [trackRef, count, clones, place])

  const settle = React.useCallback(() => {
    const track = trackRef.current
    if (!track || !looping) return
    const step = measureStep(track)
    if (step <= 0) return
    const slot = Math.round(track.scrollLeft / step)
    if (slot < clones) place(slot + count)
    else if (slot >= count + clones) place(slot - count)
  }, [trackRef, looping, clones, count, place])

  // `scrollend` — родное событие остановки прокрутки (и пальцем, и после
  // плавного `scrollTo`). Где его нет, остановкой считается 150 мс тишины.
  const hasScrollEnd =
    typeof window !== "undefined" && "onscrollend" in window
  React.useEffect(() => {
    const track = trackRef.current
    if (!track || !hasScrollEnd) return
    track.addEventListener("scrollend", settle)
    return () => track.removeEventListener("scrollend", settle)
  }, [trackRef, hasScrollEnd, settle])

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const onScroll = React.useCallback(() => {
    const track = trackRef.current
    if (!track || count === 0) return
    const step = measureStep(track)
    if (step > 0) {
      const slot = Math.round(track.scrollLeft / step)
      const next = mod(slot - clones, count)
      if (next !== indexRef.current) commit(next)
    }
    if (!hasScrollEnd) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(settle, SETTLE_FALLBACK_MS)
    }
  }, [trackRef, count, clones, commit, hasScrollEnd, settle])

  const goTo = React.useCallback(
    (target: number) => {
      if (count === 0) return
      const to = mod(Math.round(target), count)
      const from = indexRef.current
      let slot = to + clones
      if (looping) {
        // Кратчайший путь по кругу: с последнего «вперёд» — на копию
        // первого справа, перескок на настоящий сделает остановка.
        let delta = mod(to - from, count)
        if (delta > count / 2) delta -= count
        const viaClone = from + clones + delta
        if (viaClone >= 0 && viaClone <= count + clones) slot = viaClone
      }
      commit(to)
      place(slot, prefersReducedMotion() ? "auto" : "smooth")
      // Мгновенный переход (reduced motion) `scrollend` может не дать —
      // ставим на настоящий объект сразу.
      if (prefersReducedMotion()) settle()
    },
    [count, clones, looping, commit, place, settle]
  )

  const next = React.useCallback(() => goTo(indexRef.current + 1), [goTo])
  const prev = React.useCallback(() => goTo(indexRef.current - 1), [goTo])

  return { index, clones, goTo, next, prev, onScroll }
}

export { useLoopTrack, loopSlides }
export type { LoopTrack, LoopTrackOptions, LoopSlide }
