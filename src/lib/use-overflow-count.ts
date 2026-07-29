import * as React from "react"

// Shared by Tabs and Switcher — both specs describe the same "Show More"
// behavior: once the row doesn't fit, the trailing items move behind a
// "..." trigger that opens a dropdown. Measured once on mount and again on
// window resize (not a per-item ResizeObserver) — this is a
// spec-verification demo, not a component that needs to track continuous
// layout thrash.
//
// `itemRefs` must be attached to an *always-rendered, off-screen* copy of
// every item (see Tabs/Switcher's own "measure" row) rather than the
// visible row itself — items hidden behind the overflow trigger would
// otherwise report a width of 0 the next time this recomputes, permanently
// wrecking the count.
export function useOverflowCount(itemCount: number, reservedWidth: number) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])
  const [visibleCount, setVisibleCount] = React.useState(itemCount)

  React.useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current
      if (!container || itemCount === 0) return

      const fitsAll = itemRefs.current
        .slice(0, itemCount)
        .reduce((sum, el) => sum + (el?.offsetWidth ?? 0), 0)
      const available = container.clientWidth

      if (fitsAll <= available) {
        setVisibleCount(itemCount)
        return
      }

      let used = reservedWidth
      let count = 0
      for (let i = 0; i < itemCount; i++) {
        used += itemRefs.current[i]?.offsetWidth ?? 0
        if (used > available) break
        count++
      }
      setVisibleCount(Math.max(1, count))
    }

    recompute()
    window.addEventListener("resize", recompute)
    return () => window.removeEventListener("resize", recompute)
  }, [itemCount, reservedWidth])

  return { containerRef, itemRefs, visibleCount }
}
