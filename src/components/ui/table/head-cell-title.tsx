import * as React from "react"

import { ChevronsUpDown } from "@/icons"
import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

import { useTruncated } from "./use-truncated"

/**
 * Подпись столбца — с сортировкой или без.
 *
 * «Текст обрезается многоточием / Индикатор сортировки фиксируется на
 * расстоянии 8px от усечённого текста / Индикатор всегда остаётся видимым,
 * независимо от длины текста» — поэтому подпись усекается, а глиф не
 * сжимается никогда. Подсказка с полным текстом появляется только когда
 * подпись действительно обрезана.
 */
function TableHeadCellTitle({
  children,
  icon,
  sortable,
  sortDirection,
  onSortClick,
  alignRight,
}: {
  children?: React.ReactNode
  icon?: React.ReactNode
  sortable: boolean
  sortDirection: "asc" | "desc" | null
  onSortClick?: () => void
  alignRight: boolean
}) {
  const title = useTruncated<HTMLSpanElement>()

  const label = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      <Tooltip content={children} disabled={!title.truncated}>
        <span ref={title.ref} className="truncate">
          {children}
        </span>
      </Tooltip>
    </>
  )

  if (!sortable) {
    return (
      <span
        className={cn(
          "flex min-w-0 items-center gap-2 text-[var(--table-description-fg)]",
          alignRight ? "justify-end" : "flex-1"
        )}
      >
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onSortClick}
      data-slot="table-sort"
      className={cn(
        // The colour shift alone is not a focus indicator — it is the same
        // darkening the cell already does on hover — so the sort control
        // carries the kit's standard ring as well.
        "flex min-w-0 cursor-pointer items-center gap-2 rounded-[4px] outline-none transition-colors hover:text-[var(--table-fg)] focus-visible:text-[var(--table-fg)] focus-visible:ring-3 focus-visible:ring-ring/50",
        alignRight ? "justify-end" : "flex-1",
        sortDirection
          ? "text-[var(--table-fg)]"
          : "text-[var(--table-description-fg)]"
      )}
    >
      {label}
      {/* 16px, gap 8 — `icon / sort` is a full-size glyph in the spec. Its
          own two chevrons stay muted until the column is actually sorted,
          which is why Hover only darkens the *text* while Active darkens
          text + one chevron. */}
      <ChevronsUpDown
        aria-hidden="true"
        sort={sortDirection ?? "none"}
        className="size-4 shrink-0"
      />
    </button>
  )
}

export { TableHeadCellTitle }
