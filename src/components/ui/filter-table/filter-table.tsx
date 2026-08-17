import * as React from "react"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// "ELK / filter-table" (node 1303:99241, v1.0.0) — the compact pill used
// both as a tappable suggestion (NPS's reply chips) and as a selected table
// filter. Figma models the two looks as one component with a `Checked`
// property, so they live together here rather than as two lookalikes.
//
// Values below are read off the variant symbols directly:
//   Checked=False  Default  1303:99332 — bg grey-109 #F4F4F4, fg #252628
//                  Hover    1303:99342 — bg grey-114 #EFEFEF
//                  Disabled 1303:99362 — bg grey-114 #EFEFEF, fg grey-166 #C8C8CB
//   Checked=True   Default  1303:99257 — bg dark-blue-1412 #012F42, fg white,
//                                        plus a 16px close cross
// Box is shared: max-w-256, px-16/py-6, radius 16, P2 Medium 14/20, gap 8.
// Note both disabled looks are #EFEFEF/#C8C8CB (i.e. --btn-muted-*), NOT
// --chips-disabled-bg's lighter #F4F4F4.

/** The pill's own visual, split out from the component because the two real
 * call sites cannot share one element type: NPS's suggestion is itself the
 * button, while Filter's chip is a Popover trigger that *nests* a reset
 * button, and nested <button>s are invalid HTML. Sharing the classes keeps
 * one source of truth for the geometry/colours either way. */
function filterTablePillClass({
  selected = false,
  disabled = false,
}: { selected?: boolean; disabled?: boolean } = {}) {
  return cn(
    "inline-flex max-w-64 items-center justify-center gap-2 rounded-[16px] px-4 py-1.5 text-p2-medium whitespace-nowrap transition-colors",
    disabled
      ? // «Disabled гасит ВСЁ» — сквозное правило проекта. В ките у
        // выключенного чипа гаснет подпись (#C8C8CB), а шеврон остаётся
        // #252628; воспроизводить это не надо, глифы наследуют `currentColor`
        // и гаснут вместе с подписью.
        "bg-[var(--btn-muted-bg)] text-[var(--btn-muted-fg)]"
      : selected
        ? "bg-[var(--chips-dark-bg)] text-[var(--chips-dark-fg)] hover:bg-[var(--chips-dark-bg-hover)] active:bg-[var(--chips-dark-bg-active)]"
        : "bg-[var(--chips-light-bg)] text-[var(--chips-fg)] hover:bg-[var(--chips-light-bg-hover)] active:bg-[var(--chips-light-bg-active)]"
  )
}

interface FilterTableProps
  extends Omit<React.ComponentProps<"button">, "onSelect"> {
  /** Figma's `Checked` property: false = grey suggestion, true = dark
   * selected filter. */
  selected?: boolean
  /** Figma's `Counter` property — число в плашке `Badge` рядом с подписью. */
  count?: number
  /**
   * Показывать плашку-счётчик.
   *
   * ⚠️ **По умолчанию выключено, и это отступление от кита.** Вариант сета с
   * `Counter` существует, но в продукте плашка не используется: выбранный чип
   * **называет выбранное** — одно значение подписывается им самим
   * («Действующий»), несколько сворачиваются в «Подпись: N» («Статус: 3»)
   * обычным текстом подписи. По превью кажется, что вокруг цифры плашка, но
   * пипеткой по шаблону фон там тот же `#012F42`, что и у чипа.
   *
   * Механика самой подписи живёт у вызывающей стороны (`children`) — чип
   * рисует то, что ему дали.
   */
  showCounter?: boolean
}

const FilterTable = React.forwardRef<HTMLButtonElement, FilterTableProps>(
  function FilterTable(
    {
      selected = false,
      count,
      showCounter = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="filter-table"
        data-selected={selected || undefined}
        disabled={disabled}
        className={cn(
          filterTablePillClass({ selected, disabled }),
          "cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {/* Only the unselected look centres its label — the selected one is
            left-aligned because the close cross takes the right edge. */}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-center")}>
          {children}
        </span>
        {/* The counter is the same #6D6D6D/white badge in both Checked
            states — Figma's Counter=True variants (1303:99335 grey pill and
            1303:99338 dark pill) carry an identical `ELK / badge`, so it does
            not flip to the pale one on the dark pill. */}
        {showCounter && count !== undefined && (
          <Badge type="counter" value={count} color="dark-grey" disabled={disabled} />
        )}
        {selected && <X aria-hidden="true" className="size-4 shrink-0" />}
      </button>
    )
  }
)

export { FilterTable, filterTablePillClass }
export type { FilterTableProps }
