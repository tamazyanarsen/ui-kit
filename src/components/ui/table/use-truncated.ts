import * as React from "react"

/** Tooltip-on-overflow: the spec shows a hint with the full value whenever a
 * cell's text is clipped ("При наведении на усечённый текст появляется
 * подсказка с полным содержимым"). Re-measures on column resize. */
function useTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [truncated, setTruncated] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    // +1px guard: sub-pixel text metrics can make scrollWidth exceed
    // clientWidth on text that visually fits (same guard as Input's).
    setTruncated(el.scrollWidth > el.clientWidth + 1)
  }, [])

  // Two effects on purpose. Content can change without the box resizing, so
  // this one re-measures on every render (writing the same boolean bails out
  // before React re-renders, so it can't loop)...
  React.useLayoutEffect(measure)

  // ...and the box can resize without a render — dragging a column border
  // never re-renders the body cells — so this one watches it, and is set up
  // once instead of being torn down and rebuilt for every cell on every
  // render of the table.
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  return { ref, truncated }
}

export { useTruncated }
