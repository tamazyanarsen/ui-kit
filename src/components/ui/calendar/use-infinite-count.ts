import * as React from "react"

/** Наращивает `count` на `step` всякий раз, когда маркер, поставленный
 * после последней отрисованной секции, попадает в область видимости внутри
 * `scrollRef` — настоящая бесконечная прокрутка (только вперёд: возврат
 * назад делается переходом через выбор года в раскладке шторки, а не
 * прокруткой ещё выше). Только для шторки: раскладка поповера вместо этого
 * листается страницами. */
export function useInfiniteCount(
  scrollRef: React.RefObject<HTMLElement | null>,
  initial: number,
  step: number
) {
  const [count, setCount] = React.useState(initial)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const sentinel = sentinelRef.current
    const root = scrollRef.current
    if (!sentinel || !root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setCount((c) => c + step)
      },
      { root, rootMargin: "400px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [step, scrollRef])

  const reset = React.useCallback(() => setCount(initial), [initial])

  return { count, sentinelRef, reset }
}
