import { ChevronLeft, ChevronRight, Ellipsis } from "@/icons"

import { cn } from "@/lib/utils"

// Pagination ("Paginator") — page-number nav + a page-size selector on the
// right. Two layouts per spec: "L" (single row, selector inline right) and
// "M" (selector wraps below, left-aligned) — the spec frames M as a
// responsive fallback ("used when there's under 16px of horizontal room
// left"), not a fixed size, so it's implemented as natural flex-wrap rather
// than a separate prop.
//
// The outer bar itself carries chrome in both the L and M master symbols
// (confirmed identical on both, and pixel-sampled off a "paginator glued to
// the bottom of a table" usage example): white background, a 1px top
// border, and 16px/4px horizontal/vertical padding — this is the
// component's own footer-style frame, not something callers are expected to
// wrap it in.
//
// All page/size pill text (every state) and the "Показать на странице"
// caption use the kit's Medium (500) weight per spec, not just the active
// pill — Default/Hover/Onclick number pills sample as font-medium too, only
// their background changes.
//
// Truncation (Begin/Middle/End, sampled from the spec's own Value swatches):
// - totalPages <= 7: show every page, no ellipsis.
// - current near the start ("Begin"): 1 2 3 4 5 … last
// - current near the end ("End"):     1 … last-4 last-3 last-2 last-1 last
// - otherwise ("Middle"):             1 … current-1 current current+1 … last

/**
 * Дизайн-чек №4 №7: элемент «Page Count (ELK)» (нода 14679:38986) имеет
 * ровно два значения `Value` — «100 (Without 75)» и «100», поэтому набор
 * записей на странице задаётся выбором из них, а не произвольным массивом.
 */
const PAGE_COUNT_OPTIONS = {
  "100 (Without 75)": [25, 50, 100],
  "100": [25, 50, 75, 100],
} satisfies Record<string, number[]>

type PaginationPageCount = keyof typeof PAGE_COUNT_OPTIONS

/** Порядок как в макете. Отдельным массивом, а не `Object.keys`: ключ «100»
 *  похож на целое число, и в объекте JS поднимает его выше «100 (Without
 *  75)» — перечисление ключей порядок из макета не сохраняет. */
const PAGE_COUNTS: PaginationPageCount[] = ["100 (Without 75)", "100"]

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
  pageSize?: number
  /** «Page Count» — набор вариантов числа записей на странице. */
  pageCount?: PaginationPageCount
  onPageSizeChange?: (size: number) => void
  /**
   * Показывать ли блок переключения страниц.
   *
   * Дизайн-чек №36: «должна быть возможность полного отключения страниц для
   * тех ситуаций, когда всё уместилось на одной странице. Сейчас это
   * проверить нельзя». Раньше симметричный `showPageSize` был, а этого не
   * было — блок страниц отключить было нечем.
   *
   * Документация компонента (нода 30021:39016) описывает два случая:
   * «если все записи отображаются на одной странице, в правой части
   * пагинатора должен оставаться только один активный элемент — текущая
   * страница» (это `totalPages = 1`, стрелки прячутся сами) и «в случае,
   * если система возвращает пустое значение, пагинатор также отображается,
   * но отображается только правая часть (с выбором числа записей на
   * странице)» — вот для второго случая и нужен `showPages={false}`.
   *
   * Дизайн-чек №4 №6: при `showPages={false}` блок «Показать на странице»
   * остаётся на своём месте (справа в Size=L), а не переезжает влево — сам
   * блок Page Count отключать нечем (дизайн-чек №4 №7).
   */
  showPages?: boolean
  /**
   * Свойство `Size` компонент-сета «ELK / paginator» (нода 4244:20536 →
   * 48825:4128): `L` — всё в одну строку, `M` — «используется когда между
   * переключением страниц и выбором числа записей на странице остаётся
   * менее 16 пикселей по горизонтали: выбор числа записей перемещается вниз
   * на левую сторону» (нода 50689:23757).
   */
  size?: "L" | "M"
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
        // pt-[9px]/pb-[7px] instead of a centred h-9: Figma's Paginator
        // Numbers (node 8567:28146) sits the 20px line 1px below centre in
        // its 36px box. Height still resolves to 36 (9 + 20 + 7), width to
        // 44 (8 + 28 + 8).
        "flex min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 pt-[9px] pb-[7px] text-p2-medium text-[var(--pagination-fg)] outline-none focus-visible:focus-ring transition-colors",
        "not-data-active:hover:bg-[var(--pagination-hover-bg)]",
        "not-data-active:active:bg-[var(--pagination-onclick-bg)]",
        "data-active:bg-[var(--pagination-active-bg)]"
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
      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--pagination-fg)] outline-none focus-visible:focus-ring transition-colors not-disabled:hover:bg-[var(--pagination-hover-bg)] disabled:cursor-not-allowed disabled:text-[var(--pagination-disabled-fg)]"
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
        // pt-[9px]/pb-[7px] instead of a centred h-9: Figma's Paginator
        // Numbers (node 8567:28146) sits the 20px line 1px below centre in
        // its 36px box. Height still resolves to 36 (9 + 20 + 7), width to
        // 44 (8 + 28 + 8).
        "flex min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 pt-[9px] pb-[7px] text-p2-medium text-[var(--pagination-fg)] outline-none focus-visible:focus-ring transition-colors",
        "not-data-active:hover:bg-[var(--pagination-hover-bg)]",
        "not-data-active:active:bg-[var(--pagination-onclick-bg)]",
        "data-active:bg-[var(--pagination-active-bg)]"
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
  pageSize = 25,
  pageCount = "100 (Without 75)",
  onPageSizeChange,
  showPages = true,
  size = "L",
  className,
}: PaginationProps) {
  const pages = totalPages > 0 ? getPageList(page, totalPages) : [1]
  const showNav = totalPages > 1
  const pageSizeOptions = PAGE_COUNT_OPTIONS[pageCount]

  function goTo(next: number) {
    if (next < 1 || next > totalPages || next === page) return
    onPageChange?.(next)
  }

  return (
    <div
      data-slot="pagination"
      data-size={size}
      className={cn(
        "flex border-t border-[var(--pagination-border)] bg-white px-4 py-1",
        // Size=M: выбор числа записей уходит на вторую строку и влево.
        size === "M"
          ? "flex-col items-start gap-y-2"
          : "flex-wrap items-center justify-between gap-x-6 gap-y-2",
        className
      )}
    >
      {showPages && (
        <div className="flex items-center gap-1">
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
                className="flex size-9 shrink-0 items-center justify-center text-[var(--pagination-fg)]"
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
      )}

      {/* Page Count — обязательный блок: отключать его нечем, а при
          выключенном блоке страниц он остаётся на своём месте (в Size=L —
          справа, `ml-auto`). */}
      <div className={cn("flex items-center gap-4", size === "L" && "ml-auto")}>
        <span className="text-p2-medium whitespace-nowrap text-[var(--pagination-caption-fg)]">
          Показать на странице
        </span>
        <div className="flex items-center gap-1">
          {pageSizeOptions.map((option) => (
            <SizeButton
              key={option}
              size={option}
              active={option === pageSize}
              onClick={() => onPageSizeChange?.(option)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Pagination, PAGE_COUNT_OPTIONS, PAGE_COUNTS }
export type { PaginationProps, PaginationPageCount }
