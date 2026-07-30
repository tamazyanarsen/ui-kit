import { ChevronLeft, ChevronRight, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"

// Pagination ("Paginator") — page-number nav + a page-size selector on the
// right. Two layouts per spec: "L" (single row, selector inline right) and
// "M" (selector wraps below, left-aligned) — the spec frames M as a
// responsive fallback ("used when there's under 16px of horizontal room
// left"), not a fixed size, so it's implemented as natural flex-wrap rather
// than a separate prop.
//
// Truncation (Begin/Middle/End, sampled from the spec's own Value swatches):
// - totalPages <= 7: show every page, no ellipsis.
// - current near the start ("Begin"): 1 2 3 4 5 … last
// - current near the end ("End"):     1 … last-4 last-3 last-2 last-1 last
// - otherwise ("Middle"):             1 … current-1 current current+1 … last

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100]

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  showPageSize?: boolean
  className?: string
}

function getPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages]
  }
  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages]
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="pagination-page"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 min-w-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-1 text-sm text-[var(--pagination-fg)] outline-none transition-colors",
        "not-data-active:hover:bg-[var(--pagination-hover-bg)]",
        "not-data-active:active:bg-[var(--pagination-onclick-bg)]",
        "data-active:bg-[var(--pagination-active-bg)] data-active:font-medium"
      )}
    >
      {page}
    </button>
  )
}

function NavButton({
  icon: Icon,
  disabled,
  onClick,
  label,
}: {
  icon: typeof ChevronLeft
  disabled?: boolean
  onClick?: () => void
  label: string
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      data-slot="pagination-nav"
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--pagination-fg)] outline-none transition-colors not-disabled:hover:bg-[var(--pagination-hover-bg)] disabled:cursor-not-allowed disabled:text-[var(--pagination-disabled-fg)]"
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  )
}

function SizeButton({
  size,
  active,
  onClick,
}: {
  size: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="pagination-size"
      data-active={active || undefined}
      className={cn(
        "flex h-8 min-w-8 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 text-sm text-[var(--pagination-fg)] outline-none transition-colors",
        "not-data-active:hover:bg-[var(--pagination-hover-bg)]",
        "not-data-active:active:bg-[var(--pagination-onclick-bg)]",
        "data-active:bg-[var(--pagination-active-bg)] data-active:font-medium"
      )}
    >
      {size}
    </button>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  showPageSize = true,
  className,
}: PaginationProps) {
  const pages = totalPages > 0 ? getPageList(page, totalPages) : [1]
  const showNav = totalPages > 1

  function goTo(next: number) {
    if (next < 1 || next > totalPages || next === page) return
    onPageChange?.(next)
  }

  return (
    <div
      data-slot="pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
        className
      )}
    >
      <div className="flex items-center gap-0.5">
        {showNav && (
          <NavButton
            icon={ChevronLeft}
            label="Предыдущая страница"
            disabled={page <= 1}
            onClick={() => goTo(page - 1)}
          />
        )}
        {pages.map((entry, index) =>
          entry === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              data-slot="pagination-ellipsis"
              className="flex size-8 shrink-0 items-center justify-center text-[var(--pagination-fg)]"
            >
              <Ellipsis aria-hidden="true" className="size-4" />
            </span>
          ) : (
            <PageButton
              key={entry}
              page={entry}
              active={entry === page}
              onClick={() => goTo(entry)}
            />
          )
        )}
        {showNav && (
          <NavButton
            icon={ChevronRight}
            label="Следующая страница"
            disabled={page >= totalPages}
            onClick={() => goTo(page + 1)}
          />
        )}
      </div>

      {showPageSize && pageSize !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-[var(--pagination-caption-fg)]">
            Показать на странице
          </span>
          <div className="flex items-center gap-0.5">
            {pageSizeOptions.map((size) => (
              <SizeButton
                key={size}
                size={size}
                active={size === pageSize}
                onClick={() => onPageSizeChange?.(size)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { Pagination }
export type { PaginationProps }
