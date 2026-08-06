import * as React from "react"

import { cn } from "@/lib/utils"
import { Scrollbar } from "@/components/ui/scrollbar"

// Scrollable content area. A divider only appears on the edge where content
// is actually hidden by scrolling (top once scrolled down, bottom while not
// yet at the end) — never on both edges when everything fits.
//
// The scroll region is the kit's own Scrollbar, not a bare overflow-y-auto:
// Figma's Modal canvas places an `ELK / scrollbar` instance inside every
// modal body (29 of them, e.g. node 0:1151 — 4px wide, 8px inset from the
// right/top, hidden until the content actually overflows), which is exactly
// what Scrollbar's themed 4px vertical track provides.
function ModalBody({ className, children, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scrolledFromTop, setScrolledFromTop] = React.useState(false)
  const [scrolledToEnd, setScrolledToEnd] = React.useState(true)

  const updateScrollState = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    setScrolledFromTop(scrollTop > 0)
    setScrolledToEnd(scrollTop + clientHeight >= scrollHeight - 1)
  }, [])

  React.useEffect(() => {
    updateScrollState()
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateScrollState, children])

  return (
    <Scrollbar
      ref={ref}
      onScroll={updateScrollState}
      data-slot="modal-body"
      className={cn(
        "min-h-0 flex-1 border-y border-transparent px-6 py-5 md:px-8 md:py-6",
        scrolledFromTop && "border-t-[var(--modal-divider)]",
        !scrolledToEnd && "border-b-[var(--modal-divider)]",
        className
      )}
      {...props}
    >
      {children}
    </Scrollbar>
  )
}

export { ModalBody }
