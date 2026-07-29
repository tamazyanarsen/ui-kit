import * as React from "react"

/** Grows `count` by `step` whenever a sentinel placed after the last
 * rendered section scrolls into view inside `scrollRef` — true infinite
 * scroll (forward direction only; going back is handled by the jump-to
 * picker in the sheet layout, not by scrolling further up). Sheet-only:
 * the popover layout paginates instead. */
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
