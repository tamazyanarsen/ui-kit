import * as React from "react"

import { cn } from "@/lib/utils"

// Scrollbar — "Скролл": themed vertical/horizontal scrollbar styling for any
// overflowing container (dropdown lists, tables, modal bodies). Per the
// spec, thickness genuinely differs by axis — 4px vertical, 8px horizontal
// ("Горизонтальный скролл ... имеет большую толщину") — handled by the
// `.themed-scrollbar` CSS class (styles/base.css) via WebKit's `:vertical`/
// `:horizontal` scrollbar pseudo-classes, with `scrollbar-width: thin` as
// Firefox's best-available (axis-uniform) fallback.
//
// This only supplies the themed look + overflow behavior for a single axis
// each — the spec's own inset rules (8px top/bottom/right in a dropdown,
// 16px left/right/bottom in a table) are layout decisions for the
// *consumer* to apply via padding/className on their own content, not
// something this wrapper should bake in, since those insets depend on
// which component it's embedded in.
interface ScrollbarProps extends React.ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal"
}

// forwardRef because consumers need the scrolling node itself, not just its
// styling — ModalBody, for one, reads scrollTop/scrollHeight off it to decide
// which edge divider to show. Under React 18 a plain function component here
// would drop the ref outright (see the same constraint on Button/Dropdown).
const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar({ orientation = "vertical", className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="scrollbar"
        data-orientation={orientation}
        // Окно прокрутки фокусируемо БЕЗ `tabindex` — браузер даёт его
        // само, чтобы область можно было листать клавиатурой. Маркер
        // ничего не добавляет в обход табом, он только выдаёт кольцо
        // фокуса кита (см. styles/base.css).
        data-scroll-window=""
        className={cn(
          "themed-scrollbar",
          orientation === "vertical"
            ? "overflow-y-auto overflow-x-hidden"
            : "overflow-x-auto overflow-y-hidden",
          className
        )}
        {...props}
      />
    )
  }
)

export { Scrollbar }
export type { ScrollbarProps }
