import * as React from "react"

import { cn } from "@/lib/utils"

// Scrollable content area. A divider only appears on the edge where content
// is actually hidden by scrolling (top once scrolled down, bottom while not
// yet at the end) — never on both edges when everything fits.
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
    <div
      ref={ref}
      onScroll={updateScrollState}
      data-slot="modal-body"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto border-y border-transparent px-6 py-5 md:px-8 md:py-6",
        scrolledFromTop && "border-t-[var(--modal-divider)]",
        !scrolledToEnd && "border-b-[var(--modal-divider)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ModalBody }
